import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

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
}

export const SuperCerveauxHeader: React.FC<SuperCerveauxHeaderProps> = ({
  currentPage,
  onNavigate,
}) => {
  const navItems: { id: SuperPageId; label: string; icon?: string }[] = [
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
    <header className="no-print bg-white border-b-4 border-[#005a9c] px-4 py-3 sm:py-4 shadow-xs">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
        {/* Title */}
        <button
          type="button"
          onClick={() => onNavigate('accueil')}
          className="cursor-pointer group flex items-center justify-center gap-2"
        >
          <span className="text-2xl sm:text-3xl font-extrabold text-[#005a9c] tracking-tight hover:opacity-90 transition-opacity">
            ✨ Les Super Cerveaux
          </span>
        </button>

        {/* Navigation bar following user's original CSS & style */}
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
                      isActive
                        ? 'bg-[#005a9c] text-white border-[#005a9c] underline underline-offset-4 shadow-xs'
                        : 'bg-white text-[#005a9c] border-[#005a9c] hover:bg-[#005a9c] hover:text-white focus:outline-none focus:ring-3 focus:ring-[#ffbf47]'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}

            {/* Special Highlighted Item for the SyllaboDys Subpage */}
            <li>
              <button
                type="button"
                onClick={() => onNavigate('syllabodys')}
                aria-current={currentPage === 'syllabodys' ? 'page' : undefined}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-sm sm:text-base font-bold transition-all border-2 flex items-center gap-1.5 ${
                  currentPage === 'syllabodys'
                    ? 'bg-[#0284c7] text-white border-[#0284c7] ring-2 ring-[#ffbf47] shadow-sm'
                    : 'bg-amber-50 text-[#0369a1] border-[#0284c7] hover:bg-[#0284c7] hover:text-white focus:outline-none focus:ring-3 focus:ring-[#ffbf47]'
                }`}
                title="Accéder à l'Atelier de lecture syllabique SyllaboDys"
              >
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Atelier SyllaboDys</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
