import React from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';

export type SuperPageId =
  | 'accueil'
  | 'dyslexie'
  | 'dyscalculie'
  | 'dyspraxie'
  | 'dysphasie'
  | 'dysorthographie'
  | 'dysgraphie'
  | 'tdah'
  | 'professionnels'
  | 'super-pouvoirs'
  | 'syllabodys';

interface SuperCerveauxHeaderProps {
  currentPage: SuperPageId;
  onNavigate: (page: SuperPageId) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const SuperCerveauxHeader: React.FC<SuperCerveauxHeaderProps> = ({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  const navItems: { id: SuperPageId; label: string }[] = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'dyslexie', label: 'Dyslexie' },
    { id: 'dyscalculie', label: 'Dyscalculie' },
    { id: 'dyspraxie', label: 'Dyspraxie' },
    { id: 'dysphasie', label: 'Dysphasie' },
    { id: 'dysorthographie', label: 'Dysorthographie' },
    { id: 'dysgraphie', label: 'Dysgraphie' },
    { id: 'tdah', label: 'TDAH' },
    { id: 'professionnels', label: 'Les Alliés' },
    { id: 'super-pouvoirs', label: 'Super-pouvoirs' },
  ];

  return (
    <header
      className={`no-print border-b-4 transition-colors px-4 py-3 sm:py-4 shadow-sm ${
        isDark
          ? 'bg-slate-900 border-sky-500 text-slate-100'
          : 'bg-white border-[#005a9c] text-slate-900'
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
        {/* Top bar with Title & Theme Switch */}
        <div className="w-full flex items-center justify-between">
          <div className="w-10 sm:w-24" /> {/* Spacer for centering */}

          {/* Title */}
          <button
            type="button"
            onClick={() => onNavigate('accueil')}
            className="cursor-pointer group flex items-center justify-center gap-2"
          >
            <span
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors ${
                isDark
                  ? 'text-sky-400 group-hover:text-sky-300'
                  : 'text-[#005a9c] group-hover:text-[#003d6b]'
              }`}
            >
              ✨ Les Super Cerveaux
            </span>
          </button>

          {/* Theme Switcher Button */}
          <div className="w-auto flex items-center justify-end">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 hover:text-amber-200'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Mode Sombre</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">Mode Clair</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation bar following user's structure with high-contrast accessible styling */}
        <nav aria-label="Menu principal" className="w-full">
          <ul className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 m-0 p-0 list-none">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm sm:text-base font-bold transition-all border-2 ${
                      isDark
                        ? isActive
                          ? 'bg-sky-600 text-white border-sky-400 underline underline-offset-4 shadow-sm'
                          : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white hover:border-sky-400 focus:outline-none focus:ring-3 focus:ring-amber-400'
                        : isActive
                        ? 'bg-[#005a9c] text-white border-[#005a9c] underline underline-offset-4 shadow-xs'
                        : 'bg-white text-[#005a9c] border-[#005a9c] hover:bg-[#005a9c] hover:text-white focus:outline-none focus:ring-3 focus:ring-[#ffbf47]'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}

            {/* Highlighted Item for the SyllaboDys Subpage */}
            <li>
              <button
                type="button"
                onClick={() => onNavigate('syllabodys')}
                aria-current={currentPage === 'syllabodys' ? 'page' : undefined}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-sm sm:text-base font-bold transition-all border-2 flex items-center gap-1.5 ${
                  isDark
                    ? currentPage === 'syllabodys'
                      ? 'bg-sky-500 text-white border-sky-300 ring-2 ring-amber-400 shadow-md'
                      : 'bg-slate-800 text-sky-300 border-sky-500 hover:bg-sky-600 hover:text-white focus:outline-none focus:ring-3 focus:ring-amber-400'
                    : currentPage === 'syllabodys'
                    ? 'bg-[#0284c7] text-white border-[#0284c7] ring-2 ring-[#ffbf47] shadow-sm'
                    : 'bg-amber-50 text-[#0369a1] border-[#0284c7] hover:bg-[#0284c7] hover:text-white focus:outline-none focus:ring-3 focus:ring-[#ffbf47]'
                }`}
                title="Accéder à l'Atelier de lecture syllabique SyllaboDys"
              >
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Atelier SyllaboDys</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
