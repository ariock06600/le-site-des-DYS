import React, { useState, useEffect, useMemo } from 'react';
import { X, Scissors, VolumeX, Volume2, RotateCcw, Check, Sparkles } from 'lucide-react';
import { splitFrenchWordIntoSyllables } from '../utils/syllabifier';
import { identifySilentLetterIndices } from '../utils/silentLetters';

export interface WordEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordIndex: number;
  wordText: string;
  initialSyllables: string[];
  initialSilentFlags: boolean[];
  onSave: (data: {
    wordIndex: number;
    wordText: string;
    syllables: string[];
    silentFlags: boolean[];
    applyToAllOccurrences: boolean;
  }) => void;
  onResetWord: (wordIndex: number, wordText: string) => void;
  isCustom: boolean;
  theme: 'light' | 'dark';
}

export const WordEditorModal: React.FC<WordEditorModalProps> = ({
  isOpen,
  onClose,
  wordIndex,
  wordText,
  initialSyllables,
  initialSilentFlags,
  onSave,
  onResetWord,
  isCustom,
  theme,
}) => {
  const isDark = theme === 'dark';
  const rawClean = useMemo(() => wordText.replace(/[\/|\-]/g, ''), [wordText]);
  const chars = useMemo(() => rawClean.split(''), [rawClean]);

  // Syllable cuts: array of boolean between characters (length = chars.length - 1)
  // cutAt[i] is true if there is a syllable cut after character index i
  const [cuts, setCuts] = useState<boolean[]>([]);
  // Silent letter flags: boolean per character (length = chars.length)
  const [silentFlags, setSilentFlags] = useState<boolean[]>([]);
  const [applyToAll, setApplyToAll] = useState<boolean>(false);
  const [slashInput, setSlashInput] = useState<string>('');

  // Re-initialize when modal opens or word changes
  useEffect(() => {
    if (!isOpen) return;

    // Build cut positions from initialSyllables
    const newCuts = new Array(Math.max(0, chars.length - 1)).fill(false);
    let charAcc = 0;
    initialSyllables.forEach((syl, sIdx) => {
      charAcc += syl.length;
      if (sIdx < initialSyllables.length - 1 && charAcc - 1 < newCuts.length) {
        newCuts[charAcc - 1] = true;
      }
    });
    setCuts(newCuts);
    setSlashInput(initialSyllables.join('/'));

    // Silent flags
    if (initialSilentFlags && initialSilentFlags.length === chars.length) {
      setSilentFlags([...initialSilentFlags]);
    } else {
      setSilentFlags(identifySilentLetterIndices(rawClean));
    }

    setApplyToAll(false);
  }, [isOpen, wordIndex, wordText, initialSyllables, initialSilentFlags, chars, rawClean]);

  // Compute syllables from cuts
  const computedSyllables = useMemo(() => {
    if (chars.length === 0) return [];
    const syls: string[] = [];
    let current = chars[0];
    for (let i = 0; i < cuts.length; i++) {
      if (cuts[i]) {
        syls.push(current);
        current = chars[i + 1] || '';
      } else {
        current += chars[i + 1] || '';
      }
    }
    if (current) syls.push(current);
    return syls;
  }, [chars, cuts]);

  if (!isOpen) return null;

  const toggleCut = (index: number) => {
    setCuts((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      // Sync slash input
      const nextSyllables: string[] = [];
      let cur = chars[0];
      for (let i = 0; i < next.length; i++) {
        if (next[i]) {
          nextSyllables.push(cur);
          cur = chars[i + 1] || '';
        } else {
          cur += chars[i + 1] || '';
        }
      }
      if (cur) nextSyllables.push(cur);
      setSlashInput(nextSyllables.join('/'));
      return next;
    });
  };

  const toggleSilent = (charIndex: number) => {
    setSilentFlags((prev) => {
      const next = [...prev];
      next[charIndex] = !next[charIndex];
      return next;
    });
  };

  const handleSlashInputChange = (value: string) => {
    setSlashInput(value);
    const parts = value
      .split(/[\/|·•\-]+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (parts.join('').toLowerCase() === rawClean.toLowerCase()) {
      const newCuts = new Array(Math.max(0, chars.length - 1)).fill(false);
      let charAcc = 0;
      parts.forEach((p, idx) => {
        charAcc += p.length;
        if (idx < parts.length - 1 && charAcc - 1 < newCuts.length) {
          newCuts[charAcc - 1] = true;
        }
      });
      setCuts(newCuts);
    }
  };

  const handleResetToAuto = () => {
    const autoSyllables = splitFrenchWordIntoSyllables(rawClean);
    const newCuts = new Array(Math.max(0, chars.length - 1)).fill(false);
    let charAcc = 0;
    autoSyllables.forEach((syl, sIdx) => {
      charAcc += syl.length;
      if (sIdx < autoSyllables.length - 1 && charAcc - 1 < newCuts.length) {
        newCuts[charAcc - 1] = true;
      }
    });
    setCuts(newCuts);
    setSlashInput(autoSyllables.join('/'));
    setSilentFlags(identifySilentLetterIndices(rawClean));
  };

  const handleSave = () => {
    onSave({
      wordIndex,
      wordText: rawClean,
      syllables: computedSyllables,
      silentFlags,
      applyToAllOccurrences: applyToAll,
    });
    onClose();
  };

  const handleRemoveCustomization = () => {
    onResetWord(wordIndex, rawClean);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-editor-title"
      className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl space-y-6 transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 id="word-editor-title" className="text-lg font-bold flex items-center gap-2">
                <span>Modifier le mot</span>
                <span className="font-mono text-sky-500 px-2 py-0.5 rounded bg-sky-500/10">
                  {rawClean}
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Mot #{wordIndex + 1} du document · Découpage syllabique et lettres muettes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Découpage des syllabes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-sky-500">
              <Scissors className="w-3.5 h-3.5" />
              <span>1. Découpage des syllabes</span>
            </label>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Cliquez entre deux lettres pour couper ou fusionner
            </span>
          </div>

          {/* Interactive letters row with boundary toggle buttons */}
          <div
            className={`p-4 rounded-xl border flex flex-wrap items-center justify-center gap-1.5 overflow-x-auto ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {chars.map((char, cIdx) => (
              <React.Fragment key={cIdx}>
                {/* Letter chip */}
                <div
                  className={`w-10 h-11 rounded-lg border font-mono text-lg font-bold flex items-center justify-center shadow-xs ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-100'
                      : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {char}
                </div>

                {/* Boundary cut button between letters */}
                {cIdx < cuts.length && (
                  <button
                    type="button"
                    onClick={() => toggleCut(cIdx)}
                    title={
                      cuts[cIdx]
                        ? 'Coupure active : cliquez pour fusionner'
                        : 'Cliquez pour insérer une coupure syllabique'
                    }
                    className={`h-9 px-1.5 rounded-md font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-0.5 border ${
                      cuts[cIdx]
                        ? 'bg-sky-600 border-sky-500 text-white shadow-sm ring-2 ring-sky-500/30'
                        : isDark
                        ? 'bg-slate-800/60 border-dashed border-slate-700 text-slate-500 hover:border-sky-500 hover:text-sky-400 hover:bg-slate-800'
                        : 'bg-slate-200/60 border-dashed border-slate-300 text-slate-400 hover:border-sky-600 hover:text-sky-700 hover:bg-slate-200'
                    }`}
                  >
                    {cuts[cIdx] ? <span>|</span> : <span className="text-[10px]">+</span>}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Quick text input for manual slash typing */}
          <div className="flex items-center gap-2">
            <span className={`text-xs whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Ou saisir au clavier :
            </span>
            <input
              type="text"
              value={slashInput}
              onChange={(e) => handleSlashInputChange(e.target.value)}
              placeholder="ex: re/nard"
              className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* Syllables preview chips */}
          <div className="flex items-center gap-2 pt-1">
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Résultat ({computedSyllables.length} syllabe{computedSyllables.length > 1 ? 's' : ''}) :
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {computedSyllables.map((syl, sIdx) => (
                <span
                  key={sIdx}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold border font-mono ${
                    sIdx % 2 === 0
                      ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                  }`}
                >
                  {syl}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Lettres Muettes */}
        <div className="space-y-3 border-t pt-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
              <VolumeX className="w-3.5 h-3.5" />
              <span>2. Lettres muettes</span>
            </label>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Cliquez sur une lettre pour la rendre muette ou prononcée
            </span>
          </div>

          {/* Clickable letters row for silent state toggle */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {chars.map((char, cIdx) => {
              const isSilent = Boolean(silentFlags[cIdx]);
              return (
                <button
                  key={cIdx}
                  type="button"
                  onClick={() => toggleSilent(cIdx)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSilent
                      ? isDark
                        ? 'bg-slate-800 border-amber-500/50 text-slate-300 ring-2 ring-amber-500/20'
                        : 'bg-amber-50 border-amber-300 text-slate-700 ring-2 ring-amber-400/20'
                      : isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-100 hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`font-mono text-xl font-bold ${
                      isSilent ? 'opacity-40 line-through decoration-amber-500' : ''
                    }`}
                  >
                    {char}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                      isSilent
                        ? 'bg-amber-500/20 text-amber-500'
                        : isDark
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isSilent ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
                    <span>{isSilent ? 'Muette' : 'Son'}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply to all occurrences checkbox */}
        <div
          className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
          onClick={() => setApplyToAll(!applyToAll)}
        >
          <input
            type="checkbox"
            id="apply-all-checkbox"
            checked={applyToAll}
            onChange={(e) => setApplyToAll(e.target.checked)}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
          />
          <label htmlFor="apply-all-checkbox" className="text-xs cursor-pointer select-none">
            Appliquer ces modifications à <strong>toutes les occurrences</strong> du mot «{' '}
            <span className="font-mono text-sky-500">{rawClean}</span> » dans le document
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToAuto}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Règles auto</span>
            </button>

            {isCustom && (
              <button
                type="button"
                onClick={handleRemoveCustomization}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Supprimer personnalisation</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'border-slate-800 text-slate-400 hover:text-white'
                  : 'border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer et appliquer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
