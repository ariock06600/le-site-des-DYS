import React from 'react';
import { Sun, Moon, FileDown, RotateCcw } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onExportPdf: () => void;
  onResetAll: () => void;
  isExporting: boolean;
  activeSection: 'atelier' | 'modeles' | 'guide';
  onSelectSection: (sec: 'atelier' | 'modeles' | 'guide') => void;
  onBackToPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onExportPdf,
  onResetAll,
  isExporting,
  activeSection,
  onSelectSection,
  onBackToPortal,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`no-print flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b transition-colors ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Zone 1: Brand Title with Portal Back Button */}
      <div className="flex items-center gap-3 shrink-0">
        {onBackToPortal && (
          <button
            type="button"
            onClick={onBackToPortal}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title="Revenir au site Les Super Cerveaux"
          >
            <span>←</span>
            <span className="hidden sm:inline">Les Super Cerveaux</span>
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold tracking-tight whitespace-nowrap">
            SyllaboDys
          </span>
          <span
            className={`hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isDark ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'bg-sky-50 text-sky-700 border border-sky-200'
            }`}
          >
            Sous-page Atelier
          </span>
        </div>
      </div>

      {/* Zone 2: Clean single-line navigation links */}
      <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-6 text-sm font-medium">
        <a
          href="#atelier"
          onClick={(e) => {
            e.preventDefault();
            onSelectSection('atelier');
          }}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
            activeSection === 'atelier'
              ? isDark
                ? 'border-sky-400 text-white'
                : 'border-sky-600 text-slate-900'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-slate-100'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Atelier de lecture
        </a>
        <a
          href="#modeles"
          onClick={(e) => {
            e.preventDefault();
            onSelectSection('modeles');
          }}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
            activeSection === 'modeles'
              ? isDark
                ? 'border-sky-400 text-white'
                : 'border-sky-600 text-slate-900'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-slate-100'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Textes pédagogiques
        </a>
        <a
          href="#guide"
          onClick={(e) => {
            e.preventDefault();
            onSelectSection('guide');
          }}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
            activeSection === 'guide'
              ? isDark
                ? 'border-sky-400 text-white'
                : 'border-sky-600 text-slate-900'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-slate-100'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Règles syllabiques
        </a>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
          className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          <span>{isDark ? 'Mode Clair' : 'Mode Sombre'}</span>
        </button>
        <button
          type="button"
          onClick={onResetAll}
          className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser</span>
        </button>
      </nav>

      {/* Zone 3: 1 Primary CTA button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onExportPdf}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <FileDown className="w-4 h-4" />
          <span>{isExporting ? 'Génération PDF...' : 'Exporter en PDF'}</span>
        </button>
      </div>
    </header>
  );
};
