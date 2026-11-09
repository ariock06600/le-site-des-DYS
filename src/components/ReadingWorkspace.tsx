import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  TokenNode,
  SyllableSegment,
  ColorUnitMode,
  computeReadingStats,
} from '../utils/syllabifier';
import {
  FontFamilyOption,
  FONT_OPTIONS,
  SAMPLE_TEXTS,
  SampleTextItem,
} from '../utils/palettes';
import {
  FileText,
  Trash2,
  FileDown,
  BookOpen,
  RefreshCw,
  Scissors,
  Palette as PaletteIcon,
  Sparkles,
} from 'lucide-react';
import { WordEditorModal } from './WordEditorModal';
import { ExactVisualLine, extractExactVisualLinesFromDOM } from '../utils/pdfExport';

interface ReadingWorkspaceProps {
  theme: 'light' | 'dark';
  documentTitle: string;
  onSetDocumentTitle: (title: string) => void;
  rawText: string;
  onSetRawText: (text: string) => void;
  tokens: TokenNode[];
  fontFamily: FontFamilyOption;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  unitMode: ColorUnitMode;
  colors: string[];
  colorCount: number;
  customSyllableColors: Record<string, string>;
  onApplyColorToSyllableIds: (syllableIds: string[], colorHex: string) => void;
  showSyllableArcs: boolean;
  onExportPdf: (exactLines?: ExactVisualLine[]) => void;
  isExporting: boolean;
  sheetRef: React.RefObject<HTMLDivElement | null>;
  showLineWordCount: boolean;
  lineWordCountMode: 'cumulative' | 'line' | 'both';
  showSilentLetters: boolean;
  silentLetterColor: string;
  onSaveWordOverrides?: (data: {
    wordIndex: number;
    wordText: string;
    syllables: string[];
    silentFlags: boolean[];
    applyToAllOccurrences: boolean;
  }) => void;
  onResetWordOverrides?: (wordIndex: number, wordText: string) => void;
}

interface VisualLineInfo {
  lineNumber: number;
  wordCount: number;
  cumulativeWordCount: number;
  top: number;
  bottom: number;
  height: number;
}

export const ReadingWorkspace: React.FC<ReadingWorkspaceProps> = ({
  theme,
  documentTitle,
  onSetDocumentTitle,
  rawText,
  onSetRawText,
  tokens,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  wordSpacing,
  unitMode,
  colors,
  colorCount,
  customSyllableColors,
  onApplyColorToSyllableIds,
  showSyllableArcs,
  onExportPdf,
  isExporting,
  sheetRef,
  showLineWordCount,
  lineWordCountMode,
  showSilentLetters,
  silentLetterColor,
  onSaveWordOverrides,
  onResetWordOverrides,
}) => {
  const isDark = theme === 'dark';
  const readingAreaRef = useRef<HTMLDivElement | null>(null);
  const [activeToolMode, setActiveToolMode] = useState<'color' | 'edit'>('color');
  const [editingWord, setEditingWord] = useState<{
    wordIndex: number;
    wordText: string;
    syllables: string[];
    silentFlags: boolean[];
    isCustom: boolean;
  } | null>(null);

  const fontObj = FONT_OPTIONS.find((f) => f.id === fontFamily) || FONT_OPTIONS[0];
  const stats = computeReadingStats(tokens);

  // Flatten all syllables for quick lookup by wordIndex and sentenceIndex
  const allSyllables = useMemo(() => {
    return tokens.flatMap((t) => t.syllables);
  }, [tokens]);

  const getSyllableIdsByScope = (targetSyl: SyllableSegment, scope: ColorUnitMode): string[] => {
    if (scope === 'syllable') return [targetSyl.id];
    if (scope === 'word') {
      return allSyllables
        .filter((s) => s.wordIndex === targetSyl.wordIndex)
        .map((s) => s.id);
    }
    if (scope === 'sentence') {
      return allSyllables
        .filter((s) => s.sentenceIndex === targetSyl.sentenceIndex)
        .map((s) => s.id);
    }
    return [targetSyl.id];
  };

  const handleLoadSample = (sample: SampleTextItem) => {
    onSetDocumentTitle(sample.title);
    onSetRawText(sample.content);
  };

  // Dynamic visual line measurement based on real DOM layout and font size
  const [visualLines, setVisualLines] = useState<VisualLineInfo[]>([]);

  useEffect(() => {
    if (!showLineWordCount) {
      setVisualLines([]);
      return;
    }

    const container = readingAreaRef.current;
    if (!container) return;

    let animId: number;

    const measureLines = () => {
      const containerRect = container.getBoundingClientRect();
      if (containerRect.width === 0) return;

      const wordNodes = container.querySelectorAll<HTMLElement>('[data-word-node="true"]');
      if (wordNodes.length === 0) {
        setVisualLines([]);
        return;
      }

      const linesMap: { top: number; bottom: number; words: number }[] = [];
      let currentLineIdx = -1;
      let lastTop = -9999;
      // Allow slight baseline jitter (< 8px or 0.35 * fontSize)
      const threshold = Math.max(7, fontSize * 0.35);

      wordNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;

        const relTop = rect.top - containerRect.top;
        const relBottom = rect.bottom - containerRect.top;

        if (currentLineIdx === -1 || Math.abs(relTop - lastTop) > threshold) {
          currentLineIdx++;
          lastTop = relTop;
          linesMap.push({
            top: relTop,
            bottom: relBottom,
            words: 1,
          });
        } else {
          linesMap[currentLineIdx].words += 1;
          if (relBottom > linesMap[currentLineIdx].bottom) {
            linesMap[currentLineIdx].bottom = relBottom;
          }
        }
      });

      let cum = 0;
      const computed: VisualLineInfo[] = linesMap.map((l, i) => {
        cum += l.words;
        return {
          lineNumber: i + 1,
          wordCount: l.words,
          cumulativeWordCount: cum,
          top: Math.round(l.top),
          bottom: Math.round(l.bottom),
          height: Math.max(Math.round(l.bottom - l.top), Math.round(fontSize * lineHeight)),
        };
      });

      setVisualLines(computed);
    };

    // Measure on animation frame to allow layout & fonts to settle
    animId = requestAnimationFrame(measureLines);

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(measureLines);
    });

    observer.observe(container);

    if (document.fonts) {
      document.fonts.ready.then(() => {
        measureLines();
      });
    }

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [
    tokens,
    fontSize,
    lineHeight,
    fontFamily,
    letterSpacing,
    wordSpacing,
    showLineWordCount,
    showSyllableArcs,
  ]);

  const handleExportClick = () => {
    const container = readingAreaRef.current;
    let exactLines: ExactVisualLine[] | undefined = undefined;
    if (container) {
      exactLines = extractExactVisualLinesFromDOM(container, tokens);
    }
    onExportPdf(exactLines);
  };

  return (
    <div className="flex-1 min-w-0 space-y-5">
      {/* Zone 1: Saisie et modification du texte (masquée à l'export PDF) */}
      <section
        aria-labelledby="heading-raw-input"
        className={`no-print rounded-xl border p-5 transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 id="heading-raw-input" className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>Saisie et modification du texte</span>
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Collez ou modifiez votre texte ci-dessous. Astuce : insérez{' '}
              <code className="font-mono px-1 py-0.5 rounded bg-sky-500/10 text-sky-500">/</code>{' '}
              dans un mot (ex: <span className="font-mono">or/tho/pho/nie</span>) pour forcer une
              coupure syllabique personnalisée.
            </p>
          </div>

          {/* Sample Text Quick Loaders */}
          <div className="flex flex-wrap items-center gap-1.5">
            {SAMPLE_TEXTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-sky-500 hover:text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-sky-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                <span>{sample.title.split(' (')[0]}</span>
              </button>
            ))}

            {rawText.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onSetRawText('');
                }}
                aria-label="Effacer le texte"
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isDark
                    ? 'border-slate-800 text-rose-400 hover:bg-rose-950/40'
                    : 'border-slate-200 text-rose-600 hover:bg-rose-50'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vider</span>
              </button>
            )}
          </div>
        </div>

        <label htmlFor="raw-text-textarea" className="sr-only">
          Texte à découper en syllabes
        </label>
        <textarea
          id="raw-text-textarea"
          rows={4}
          value={rawText}
          onChange={(e) => {
            onSetRawText(e.target.value);
          }}
          placeholder="Collez ou saisissez ici le texte destiné à l'élève..."
          className={`w-full rounded-lg border p-3.5 text-sm leading-relaxed transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
          }`}
        />

        {/* Clean unboxed metadata statistics bar */}
        <div
          className={`mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2 font-mono tabular-nums">
            <span>{stats.wordCount} mots</span>
            <span aria-hidden="true">·</span>
            <span>{stats.syllableCount} syllabes</span>
            <span aria-hidden="true">·</span>
            <span>{stats.characterCount} caractères</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Police : {fontObj.label}</span>
            <span aria-hidden="true">·</span>
            <span>
              Mode :{' '}
              {unitMode === 'syllable'
                ? 'Syllabe'
                : unitMode === 'word'
                ? 'Mot à mot'
                : 'Phrase'}{' '}
              ({colorCount} coul.)
            </span>
            {showLineWordCount && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-sky-500 font-medium">Mots/ligne actif ({visualLines.length} lignes)</span>
              </>
            )}
            {showSilentLetters && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-amber-500 font-medium">Lettres muettes</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Zone Feuille de lecture mise en forme (Seule zone incluse dans l'export PDF) */}
      <div
        ref={sheetRef}
        id="reading-pdf-sheet"
        className={`print-only-sheet rounded-xl border p-8 md:p-10 transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* En-tête de la fiche de lecture avec Titre et Bouton Export PDF */}
        <div
          className={`pb-4 mb-6 border-b flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <input
            type="text"
            aria-label="Titre de la fiche de lecture"
            value={documentTitle}
            onChange={(e) => onSetDocumentTitle(e.target.value)}
            placeholder="Titre de la fiche de lecture..."
            className={`flex-1 min-w-[220px] text-xl md:text-2xl font-bold bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded px-1 -ml-1 ${
              isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportClick}
              disabled={isExporting || rawText.trim().length === 0}
              className="no-print inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? 'Exportation PDF...' : 'Exporter la fiche en PDF'}</span>
            </button>
          </div>
        </div>

        {/* Barre d'outils interactive : Choix entre Mode Coloration et Mode Découpage Syllabes & Lettres */}
        <div
          className={`no-print mb-5 p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Mode d'action sur la fiche :
            </span>
            <div className="inline-flex rounded-lg p-0.5 border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveToolMode('color')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeToolMode === 'color'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PaletteIcon className="w-3.5 h-3.5" />
                <span>Alterner les couleurs</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveToolMode('edit')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  activeToolMode === 'edit'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Modifier syllabes & lettres</span>
              </button>
            </div>
          </div>

          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {activeToolMode === 'edit' ? (
              <span className="text-sky-400 font-medium flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5" />
                <span>Cliquez sur n'importe quel mot ci-dessous pour couper ses syllabes ou basculer ses lettres muettes.</span>
              </span>
            ) : (
              <span>
                💡 Cliquez sur une syllabe pour alterner sa couleur · <strong className="text-sky-400 font-medium">Double-cliquez</strong> sur un mot pour l'éditer.
              </span>
            )}
          </div>
        </div>

        {/* Zone de lecture interactive */}
        {rawText.trim().length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              La feuille de lecture est vide. Saisissez votre texte dans le champ ci-dessus ou
              chargez un exemple pédagogique.
            </p>
            <button
              type="button"
              onClick={() => handleLoadSample(SAMPLE_TEXTS[0])}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Charger « Le petit renard curieux »</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Zone de texte avec padding droit réservé pour les badges dynamiques */}
            <div
              ref={readingAreaRef}
              id="syllable-reading-area"
              data-testid="syllable-reading-area"
              aria-label="Zone de lecture syllabique interactive"
              style={{
                fontFamily: fontObj.cssFamily,
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}em`,
                wordSpacing: `${wordSpacing}em`,
              }}
              className={`min-h-[280px] rounded-lg select-text ${
                showLineWordCount ? 'pr-16 md:pr-20' : ''
              }`}
            >
              {tokens.map((token) => {
                if (token.type === 'newline') {
                  return <br key={token.id} />;
                }
                if (token.type === 'separator') {
                  const sepColor =
                    unitMode === 'sentence'
                      ? colors[token.defaultColorIndex % colorCount] || colors[0]
                      : undefined;
                  return (
                    <span key={token.id} style={sepColor ? { color: sepColor } : undefined}>
                      {token.raw}
                    </span>
                  );
                }

                const isWordCustom = Boolean(token.isCustomSyllables || token.isCustomSilentLetters);

                const handleOpenWordEditor = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const currentSyllables = token.syllables.map((s) => s.text);
                  const currentSilentFlags = token.syllables.flatMap((s) =>
                    s.parts && s.parts.length > 0
                      ? s.parts.flatMap((p) => new Array(p.text.length).fill(p.isSilent))
                      : new Array(s.text.length).fill(false)
                  );
                  setEditingWord({
                    wordIndex: token.wordIndex ?? 0,
                    wordText: token.raw,
                    syllables: currentSyllables,
                    silentFlags: currentSilentFlags,
                    isCustom: isWordCustom,
                  });
                };

                return (
                  <span
                    key={token.id}
                    data-word-node="true"
                    data-word-index={token.wordIndex}
                    onClick={(e) => {
                      if (activeToolMode === 'edit') {
                        handleOpenWordEditor(e);
                      }
                    }}
                    onDoubleClick={handleOpenWordEditor}
                    title={
                      activeToolMode === 'edit'
                        ? `Cliquer pour modifier les syllabes ou lettres muettes de « ${token.raw} »`
                        : isWordCustom
                        ? `Mot personnalisé · Double-cliquez pour modifier « ${token.raw} »`
                        : `Double-cliquez pour modifier « ${token.raw} »`
                    }
                    className={`inline-block relative rounded transition-all ${
                      activeToolMode === 'edit'
                        ? 'cursor-pointer hover:ring-2 hover:ring-sky-500 hover:bg-sky-500/10 px-0.5'
                        : isWordCustom
                        ? 'ring-1 ring-sky-500/40 rounded px-0.5'
                        : ''
                    }`}
                  >
                    {token.syllables.map((syl) => {
                      const defaultHex = colors[syl.defaultColorIndex % colorCount] || colors[0];
                      const hexColor = customSyllableColors[syl.id] || defaultHex;

                      return (
                        <span
                          key={syl.id}
                          data-syllable-id={syl.id}
                          data-word-index={syl.wordIndex}
                          data-sentence-index={syl.sentenceIndex}
                          title={
                            activeToolMode === 'edit'
                              ? `Cliquer pour modifier « ${token.raw} »`
                              : 'Cliquez pour alterner la couleur · Double-cliquez pour modifier le mot'
                          }
                          onClick={(e) => {
                            if (activeToolMode === 'edit') {
                              handleOpenWordEditor(e);
                              return;
                            }
                            const sel = window.getSelection();
                            if (sel && !sel.isCollapsed && sel.toString().trim().length > 0) {
                              return;
                            }
                            e.stopPropagation();
                            const targetIds = getSyllableIdsByScope(syl, unitMode);

                            const currentColorIdx = colors
                              .slice(0, colorCount)
                              .findIndex((c) => c.toLowerCase() === hexColor.toLowerCase());
                            const nextColorIdx =
                              currentColorIdx >= 0
                                ? (currentColorIdx + 1) % colorCount
                                : (syl.defaultColorIndex + 1) % colorCount;
                            const nextHex = colors[nextColorIdx] || colors[0];
                            onApplyColorToSyllableIds(targetIds, nextHex);
                          }}
                          style={{
                            borderBottom: showSyllableArcs
                              ? `2px solid ${hexColor}`
                              : undefined,
                            paddingBottom: showSyllableArcs ? '2px' : undefined,
                            marginRight: showSyllableArcs ? '1px' : undefined,
                          }}
                          className={`rounded-xs transition-colors ${
                            activeToolMode === 'color' ? 'cursor-pointer hover:bg-sky-500/15' : ''
                          }`}
                        >
                          {showSilentLetters && syl.parts && syl.parts.length > 0 ? (
                            syl.parts.map((part, pIdx) => (
                              <span
                                key={pIdx}
                                style={{
                                  color: part.isSilent ? silentLetterColor : hexColor,
                                  opacity: part.isSilent ? 0.85 : 1,
                                }}
                                title={part.isSilent ? `Lettre muette « ${part.text} »` : undefined}
                              >
                                {part.text}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: hexColor }}>{syl.text}</span>
                          )}
                        </span>
                      );
                    })}

                    {/* Subtle dot indicator when word has custom manual overrides */}
                    {isWordCustom && (
                      <span
                        aria-hidden="true"
                        title="Ce mot a des coupures ou lettres muettes personnalisées"
                        className="no-print absolute -top-1.5 -right-1 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900"
                      />
                    )}
                  </span>
                );
              })}
            </div>

            {/* Badges de décompte de mots dynamiques calculés sur les vraies lignes physiques */}
            {showLineWordCount && visualLines.length > 0 && (
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 w-14 md:w-16 h-full pointer-events-none select-none"
              >
                {visualLines.map((line) => (
                  <div
                    key={line.lineNumber}
                    style={{
                      position: 'absolute',
                      top: `${line.top}px`,
                      height: `${line.height}px`,
                      right: 0,
                    }}
                    className="flex items-center justify-end"
                  >
                    <span
                      className={`font-mono text-xs font-semibold px-1.5 py-0.5 rounded border tabular-nums shadow-xs ${
                        isDark
                          ? 'bg-slate-950/90 border-slate-700 text-sky-400'
                          : 'bg-sky-50 border-sky-300 text-sky-800'
                      }`}
                      title={`Ligne ${line.lineNumber} : ${line.wordCount} mot${line.wordCount > 1 ? 's' : ''} · Cumulé (fluence MCLM) : ${line.cumulativeWordCount}`}
                    >
                      {lineWordCountMode === 'line'
                        ? `${line.wordCount} m.`
                        : lineWordCountMode === 'cumulative'
                        ? `${line.cumulativeWordCount}`
                        : `${line.wordCount} · ${line.cumulativeWordCount}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Word Editor Modal for manual syllable cuts and silent letters */}
      {editingWord && (
        <WordEditorModal
          isOpen={editingWord !== null}
          onClose={() => setEditingWord(null)}
          wordIndex={editingWord.wordIndex}
          wordText={editingWord.wordText}
          initialSyllables={editingWord.syllables}
          initialSilentFlags={editingWord.silentFlags}
          isCustom={editingWord.isCustom}
          theme={theme}
          onSave={(data) => {
            if (onSaveWordOverrides) {
              onSaveWordOverrides(data);
            }
          }}
          onResetWord={(wIdx, wText) => {
            if (onResetWordOverrides) {
              onResetWordOverrides(wIdx, wText);
            }
          }}
        />
      )}
    </div>
  );
};
