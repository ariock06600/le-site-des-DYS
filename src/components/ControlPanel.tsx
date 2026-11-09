import React from 'react';
import {
  FontFamilyOption,
  FONT_OPTIONS,
  PALETTE_PRESETS,
  PalettePreset,
} from '../utils/palettes';
import { ColorUnitMode } from '../utils/syllabifier';
import { Sun, Moon, Type, Palette, Sliders, Sparkles, RotateCcw, Layers, Hash, EyeOff, Scissors } from 'lucide-react';

interface ControlPanelProps {
  theme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
  fontFamily: FontFamilyOption;
  onSetFontFamily: (font: FontFamilyOption) => void;
  fontSize: number;
  onSetFontSize: (size: number) => void;
  lineHeight: number;
  onSetLineHeight: (lh: number) => void;
  letterSpacing: number;
  onSetLetterSpacing: (ls: number) => void;
  wordSpacing: number;
  onSetWordSpacing: (ws: number) => void;
  unitMode: ColorUnitMode;
  onSetUnitMode: (mode: ColorUnitMode) => void;
  colorCount: number;
  onSetColorCount: (count: number) => void;
  colors: string[];
  onUpdateSingleColor: (index: number, hex: string) => void;
  selectedPresetId: string;
  onSelectPreset: (preset: PalettePreset) => void;
  resetColorPerWord: boolean;
  onSetResetColorPerWord: (val: boolean) => void;
  showSyllableArcs: boolean;
  onSetShowSyllableArcs: (val: boolean) => void;
  customOverridesCount: number;
  onClearCustomOverrides: () => void;
  showLineWordCount: boolean;
  onSetShowLineWordCount: (val: boolean) => void;
  lineWordCountMode: 'cumulative' | 'line' | 'both';
  onSetLineWordCountMode: (mode: 'cumulative' | 'line' | 'both') => void;
  showSilentLetters: boolean;
  onSetShowSilentLetters: (val: boolean) => void;
  silentLetterColor: string;
  onSetSilentLetterColor: (color: string) => void;
  manualWordCustomizationsCount?: number;
  onClearAllManualWordCustomizations?: () => void;
}

const UNIT_MODE_OPTIONS: { id: ColorUnitMode; label: string; desc: string }[] = [
  { id: 'syllable', label: 'Par syllabe', desc: 'Alternance syllabique' },
  { id: 'word', label: 'Mot à mot', desc: 'Un mot = une couleur' },
  { id: 'sentence', label: 'Par phrase', desc: 'Une phrase = une couleur' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  theme,
  onSetTheme,
  fontFamily,
  onSetFontFamily,
  fontSize,
  onSetFontSize,
  lineHeight,
  onSetLineHeight,
  letterSpacing,
  onSetLetterSpacing,
  wordSpacing,
  onSetWordSpacing,
  unitMode,
  onSetUnitMode,
  colorCount,
  onSetColorCount,
  colors,
  onUpdateSingleColor,
  selectedPresetId,
  onSelectPreset,
  resetColorPerWord,
  onSetResetColorPerWord,
  showSyllableArcs,
  onSetShowSyllableArcs,
  customOverridesCount,
  onClearCustomOverrides,
  showLineWordCount,
  onSetShowLineWordCount,
  lineWordCountMode,
  onSetLineWordCountMode,
  showSilentLetters,
  onSetShowSilentLetters,
  silentLetterColor,
  onSetSilentLetterColor,
  manualWordCustomizationsCount = 0,
  onClearAllManualWordCustomizations,
}) => {
  const isDark = theme === 'dark';

  return (
    <aside
      aria-label="Panneau de personnalisation ergonomique"
      className={`no-print w-full lg:w-[360px] xl:w-[380px] shrink-0 rounded-xl border p-5 space-y-6 transition-colors ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Section 1: Thème Visuel (Contraste optimisé) */}
      <section aria-labelledby="heading-theme" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="heading-theme" className="text-sm font-semibold flex items-center gap-2">
            <Sun className="w-4 h-4 text-sky-500" />
            <span>1. Thème et Contraste Visuel</span>
          </h2>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Anti-fatigue
          </span>
        </div>

        <div
          role="group"
          aria-label="Sélecteur de thème"
          className={`grid grid-cols-2 gap-1.5 p-1 rounded-lg border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => onSetTheme('light')}
            aria-pressed={theme === 'light'}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              theme === 'light'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Mode Clair</span>
          </button>
          <button
            type="button"
            onClick={() => onSetTheme('dark')}
            aria-pressed={theme === 'dark'}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-sky-400" />
            <span>Mode Sombre</span>
          </button>
        </div>
      </section>

      <hr className={isDark ? 'border-slate-800' : 'border-slate-200'} />

      {/* Section 2: Police d'écriture adaptée */}
      <section aria-labelledby="heading-font" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="heading-font" className="text-sm font-semibold flex items-center gap-2">
            <Type className="w-4 h-4 text-sky-500" />
            <span>2. Police d'écriture adaptée</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Choix de la police">
          {FONT_OPTIONS.map((font) => {
            const active = fontFamily === font.id;
            return (
              <button
                key={font.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSetFontFamily(font.id)}
                style={{ fontFamily: font.cssFamily }}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  active
                    ? isDark
                      ? 'bg-sky-950/60 border-sky-500 text-white'
                      : 'bg-sky-50 border-sky-600 text-slate-900'
                    : isDark
                    ? 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-semibold whitespace-nowrap">{font.label}</span>
                <span
                  className={`text-[11px] mt-0.5 whitespace-nowrap ${
                    active
                      ? isDark
                        ? 'text-sky-300'
                        : 'text-sky-700'
                      : isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {font.badge}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <hr className={isDark ? 'border-slate-800' : 'border-slate-200'} />

      {/* Section 3: Curseurs d'espacement et de taille */}
      <section aria-labelledby="heading-sliders" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="heading-sliders" className="text-sm font-semibold flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-500" />
            <span>3. Réglages Typographiques</span>
          </h2>
        </div>

        {/* Font size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="slider-font-size" className="font-medium">
              Taille du texte
            </label>
            <span className="font-mono tabular-nums font-semibold text-sky-500">
              {fontSize} px
            </span>
          </div>
          <input
            id="slider-font-size"
            type="range"
            min={16}
            max={44}
            step={1}
            value={fontSize}
            onChange={(e) => onSetFontSize(Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
        </div>

        {/* Line height */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="slider-line-height" className="font-medium">
              Interligne
            </label>
            <span className="font-mono tabular-nums font-semibold text-sky-500">
              {lineHeight.toFixed(1)}×
            </span>
          </div>
          <input
            id="slider-line-height"
            type="range"
            min={1.4}
            max={3.2}
            step={0.1}
            value={lineHeight}
            onChange={(e) => onSetLineHeight(Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
        </div>

        {/* Letter spacing */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="slider-letter-spacing" className="font-medium">
              Espacement des lettres
            </label>
            <span className="font-mono tabular-nums font-semibold text-sky-500">
              {Math.round(letterSpacing * 100)}%
            </span>
          </div>
          <input
            id="slider-letter-spacing"
            type="range"
            min={0}
            max={0.25}
            step={0.01}
            value={letterSpacing}
            onChange={(e) => onSetLetterSpacing(Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
        </div>

        {/* Word spacing */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="slider-word-spacing" className="font-medium">
              Espacement des mots
            </label>
            <span className="font-mono tabular-nums font-semibold text-sky-500">
              {Math.round(wordSpacing * 100)}%
            </span>
          </div>
          <input
            id="slider-word-spacing"
            type="range"
            min={0.05}
            max={0.8}
            step={0.05}
            value={wordSpacing}
            onChange={(e) => onSetWordSpacing(Number(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer"
          />
        </div>
      </section>

      <hr className={isDark ? 'border-slate-800' : 'border-slate-200'} />

      {/* Section 4: Mode de découpage et Palette de personnalisation */}
      <section aria-labelledby="heading-palette" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="heading-palette" className="text-sm font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4 text-sky-500" />
            <span>4. Découpage & Palette Couleurs</span>
          </h2>
        </div>

        {/* Mode d'alternance automatique: Syllabe, Mot à mot, Phrase */}
        <div className="space-y-1.5">
          <span className="text-xs font-medium flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-500" />
            <span>Mode d'alternance sur tout le texte</span>
          </span>
          <div
            role="radiogroup"
            aria-label="Mode d'alternance automatique des couleurs"
            className="grid grid-cols-3 gap-1.5"
          >
            {UNIT_MODE_OPTIONS.map((opt) => {
              const active = unitMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onSetUnitMode(opt.id)}
                  className={`flex flex-col items-start p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    active
                      ? isDark
                        ? 'bg-sky-950/60 border-sky-500 text-white'
                        : 'bg-sky-50 border-sky-600 text-slate-900'
                      : isDark
                      ? 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-semibold whitespace-nowrap">{opt.label}</span>
                  <span
                    className={`text-[10px] mt-0.5 truncate w-full ${
                      active
                        ? isDark
                          ? 'text-sky-300'
                          : 'text-sky-700'
                        : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector for number of active colors (2 to 5) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Nombre de couleurs actives</span>
            <span className="font-mono tabular-nums font-semibold text-sky-500">
              {colorCount} couleurs
            </span>
          </div>
          <div
            role="group"
            aria-label="Nombre de couleurs pour l'alternance"
            className={`grid grid-cols-4 gap-1.5 p-1 rounded-lg border ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            {[2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onSetColorCount(num)}
                aria-pressed={colorCount === num}
                className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  colorCount === num
                    ? isDark
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-900 shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {num} coul.
              </button>
            ))}
          </div>
        </div>

        {/* Individual Color Pickers for each active color */}
        <div className="space-y-2">
          <span className="text-xs font-medium block">
            Couleurs actives (cliquez pour personnaliser)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array.from({ length: colorCount }).map((_, idx) => {
              const currentColor = colors[idx] || '#0284C7';
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <label
                      htmlFor={`color-picker-${idx}`}
                      className="text-xs font-semibold block cursor-pointer"
                    >
                      Couleur {idx + 1}
                    </label>
                    <span
                      className={`text-[10px] font-mono tabular-nums block uppercase ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {currentColor}
                    </span>
                  </div>
                  <input
                    id={`color-picker-${idx}`}
                    type="color"
                    aria-label={`Couleur ${idx + 1}`}
                    value={currentColor}
                    onChange={(e) => onUpdateSingleColor(idx, e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0 shrink-0"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <span className="text-xs font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Préréglages à fort contraste</span>
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {PALETTE_PRESETS.map((preset) => {
              const activeColors = isDark ? preset.darkColors : preset.lightColors;
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-sky-950/50 border-sky-500'
                        : 'bg-sky-50/80 border-sky-600'
                      : isDark
                      ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold truncate">{preset.name}</div>
                    <div
                      className={`text-[11px] truncate ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {preset.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {activeColors.slice(0, colorCount).map((hex, i) => (
                      <span
                        key={i}
                        style={{ backgroundColor: hex }}
                        className="w-3.5 h-3.5 rounded-full border border-black/15"
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Repères visuels complémentaires */}
        <div className="pt-1 space-y-2">
          {unitMode === 'syllable' && (
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span>Redémarrer le cycle à chaque mot</span>
              <input
                type="checkbox"
                checked={resetColorPerWord}
                onChange={(e) => onSetResetColorPerWord(e.target.checked)}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </label>
          )}
          <label className="flex items-center justify-between text-xs cursor-pointer">
            <span>Afficher les ponts syllabiques sous les mots</span>
            <input
              type="checkbox"
              checked={showSyllableArcs}
              onChange={(e) => onSetShowSyllableArcs(e.target.checked)}
              className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
            />
          </label>
        </div>

        {customOverridesCount > 0 && (
          <button
            type="button"
            onClick={onClearCustomOverrides}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-700 bg-slate-800/70 text-slate-200 hover:bg-slate-800'
                : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              Réinitialiser {customOverridesCount} couleur{customOverridesCount > 1 ? 's' : ''}{' '}
              manuelle{customOverridesCount > 1 ? 's' : ''}
            </span>
          </button>
        )}
      </section>

      <hr className={isDark ? 'border-slate-800' : 'border-slate-200'} />

      {/* Section 5: Aides à la lecture (Fluence & Lettres muettes) */}
      <section aria-labelledby="heading-aides" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="heading-aides" className="text-sm font-semibold flex items-center gap-2">
            <Hash className="w-4 h-4 text-sky-500" />
            <span>5. Aides & Fluence de lecture</span>
          </h2>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isDark
                ? 'bg-sky-950 text-sky-400 border border-sky-800'
                : 'bg-sky-50 text-sky-700 border border-sky-200'
            }`}
          >
            MCLM & Orthophonie
          </span>
        </div>

        {/* Option 1: Nombre de mots par ligne */}
        <div
          className={`p-3 rounded-lg border space-y-2.5 transition-colors ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="toggle-line-word-count"
              className="text-xs font-semibold cursor-pointer flex items-center gap-2"
            >
              <Hash className="w-3.5 h-3.5 text-sky-500" />
              <span>Nombre de mots par ligne</span>
            </label>
            <input
              id="toggle-line-word-count"
              type="checkbox"
              checked={showLineWordCount}
              onChange={(e) => onSetShowLineWordCount(e.target.checked)}
              className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
            />
          </div>

          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Affiche un badge repère en bout de ligne pour mesurer la vitesse de lecture (mots lus par minute).
          </p>

          {showLineWordCount && (
            <div className="pt-1 space-y-1.5">
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold block ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Format du décompte :
              </span>
              <div
                role="group"
                aria-label="Format du compteur de mots par ligne"
                className={`grid grid-cols-3 gap-1 p-1 rounded-lg border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {(
                  [
                    { id: 'cumulative', label: 'Cumulé', sub: 'Fluence' },
                    { id: 'line', label: 'Par ligne', sub: 'Ligne' },
                    { id: 'both', label: 'Détaillé', sub: 'Les 2' },
                  ] as { id: 'cumulative' | 'line' | 'both'; label: string; sub: string }[]
                ).map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => onSetLineWordCountMode(fmt.id)}
                    aria-pressed={lineWordCountMode === fmt.id}
                    className={`py-1 px-1.5 rounded-md text-[11px] font-semibold transition-colors flex flex-col items-center justify-center cursor-pointer ${
                      lineWordCountMode === fmt.id
                        ? isDark
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-sky-100 text-sky-950 font-bold border border-sky-300'
                        : isDark
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{fmt.label}</span>
                    <span className="text-[9px] opacity-75">{fmt.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Option 2: Lettres muettes */}
        <div
          className={`p-3 rounded-lg border space-y-2.5 transition-colors ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="toggle-silent-letters"
              className="text-xs font-semibold cursor-pointer flex items-center gap-2"
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-500" />
              <span>Colorer les lettres muettes</span>
            </label>
            <input
              id="toggle-silent-letters"
              type="checkbox"
              checked={showSilentLetters}
              onChange={(e) => onSetShowSilentLetters(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Distingue d'une couleur spécifique les lettres non prononcées (<span className="italic">e</span> muet, consonnes finales <span className="italic">s, t, d, p, x</span>, terminaisons <span className="italic">-ent</span>, <span className="italic">h</span> muet).
          </p>

          {showSilentLetters && (
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] uppercase tracking-wider font-semibold block ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Couleur des lettres muettes :
                </span>
                <span
                  style={{ color: silentLetterColor }}
                  className="font-mono text-[11px] font-bold uppercase"
                >
                  {silentLetterColor}
                </span>
              </div>

              {/* Swatches presets for silent letters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { hex: '#94A3B8', name: 'Gris doux (estompé classique)' },
                  { hex: '#64748B', name: 'Gris ardoise' },
                  { hex: '#A855F7', name: 'Violet doux' },
                  { hex: '#10B981', name: 'Vert sauge' },
                  { hex: '#F43F5E', name: 'Rose doux' },
                  { hex: '#F59E0B', name: 'Ambre' },
                ].map((swatch, sIdx) => {
                  const isCur = silentLetterColor.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => onSetSilentLetterColor(swatch.hex)}
                      title={swatch.name}
                      aria-label={swatch.name}
                      style={{ backgroundColor: swatch.hex }}
                      className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 cursor-pointer ${
                        isCur
                          ? 'ring-2 ring-amber-400 border-white scale-105'
                          : 'border-black/20'
                      }`}
                    />
                  );
                })}

                {/* Free color picker */}
                <div className="flex items-center gap-1 ml-auto">
                  <input
                    type="color"
                    aria-label="Couleur personnalisée des lettres muettes"
                    value={silentLetterColor}
                    onChange={(e) => onSetSilentLetterColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Libre
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <hr className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`} />

      {/* Section 6: Modifications manuelles (Syllabes & Lettres muettes) */}
      <section aria-labelledby="heading-manual-edits" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="heading-manual-edits" className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Scissors className="w-3.5 h-3.5 text-sky-500" />
            <span>6. Syllabes & Lettres manuelles</span>
          </h2>
          {manualWordCustomizationsCount > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {manualWordCustomizationsCount} mot{manualWordCustomizationsCount > 1 ? 's' : ''} modifié{manualWordCustomizationsCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Vous pouvez ajuster manuellement le découpage syllabique et choisir quelles lettres sont muettes en cliquant directement sur n'importe quel mot de la feuille de lecture.
        </p>

        {manualWordCustomizationsCount > 0 && onClearAllManualWordCustomizations && (
          <button
            type="button"
            onClick={onClearAllManualWordCustomizations}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-700 hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Réinitialiser les mots personnalisés ({manualWordCustomizationsCount})</span>
          </button>
        )}
      </section>
    </aside>
  );
};
