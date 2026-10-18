import React from 'react';
import { SuperPageId } from './SuperCerveauxHeader';
import {
  BookOpen,
  ArrowRight,
  Calculator,
  Compass,
  MessageSquare,
  PenTool,
  Edit3,
  Zap,
  Users,
  Award,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: SuperPageId) => void;
  theme: 'light' | 'dark';
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, theme }) => {
  const isDark = theme === 'dark';

  const quickCards: {
    id: SuperPageId;
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    desc: string;
    tag: string;
    tagColor: string;
  }[] = [
    {
      id: 'dyslexie',
      title: 'La Dyslexie',
      subtitle: 'Les lettres acrobates 🤸‍♂️📖',
      icon: <BookOpen className={`w-6 h-6 ${isDark ? 'text-sky-400' : 'text-sky-600'}`} />,
      desc: "Quand les lettres d'un livre font la fête et mettent des masques pour danser sur la page !",
      tag: 'Lecture',
      tagColor: isDark
        ? 'bg-sky-950/80 text-sky-300 border-sky-800'
        : 'bg-sky-100 text-sky-800 border-sky-300',
    },
    {
      id: 'dyscalculie',
      title: 'La Dyscalculie',
      subtitle: 'La magie des nombres 🧮🔢',
      icon: <Calculator className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />,
      desc: 'Comprendre les quantités, le labyrinthe des nombres mystères et trouver des outils concrets.',
      tag: 'Nombres & Mesures',
      tagColor: isDark
        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
        : 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'dyspraxie',
      title: 'La Dyspraxie',
      subtitle: 'Les gestes maladroits 🎨✂️👟',
      icon: <Compass className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />,
      desc: 'Le chef d’orchestre des mouvements et les musiciens qui ont besoin de temps pour jouer.',
      tag: 'Gestes & Espace',
      tagColor: isDark
        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
        : 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'dysphasie',
      title: 'La Dysphasie',
      subtitle: 'Les mots sur le bout de la langue 🗣️💬',
      icon: <MessageSquare className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />,
      desc: 'Le petit traducteur secret du cerveau qui hésite quand on a plein de belles histoires en tête.',
      tag: 'Langage oral',
      tagColor: isDark
        ? 'bg-purple-950/80 text-purple-300 border-purple-800'
        : 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      id: 'dysorthographie',
      title: 'La Dysorthographie',
      subtitle: "L'art des sons et des lettres ✍️🔍",
      icon: <PenTool className={`w-6 h-6 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />,
      desc: 'Le détective des secrets cachés face aux règles et aux lettres muettes des mots.',
      tag: 'Orthographe',
      tagColor: isDark
        ? 'bg-rose-950/80 text-rose-300 border-rose-800'
        : 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'dysgraphie',
      title: 'La Dysgraphie',
      subtitle: 'Le crayon rebelle ✏️🎨',
      icon: <Edit3 className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />,
      desc: 'Écrire comme avec des gants de ski : comprendre la fatigue de la main et les astuces.',
      tag: 'Écriture manuelle',
      tagColor: isDark
        ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
        : 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      id: 'tdah',
      title: 'Le TDAH',
      subtitle: 'Le moteur de fusée et les super-antennes 🚀📡',
      icon: <Zap className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />,
      desc: 'Le bolide aux mille pensées et aux antennes réceptrices ultra-sensibles prêtes à explorer.',
      tag: 'Attention & Énergie',
      tagColor: isDark
        ? 'bg-orange-950/80 text-orange-300 border-orange-800'
        : 'bg-orange-100 text-orange-800 border-orange-300',
    },
    {
      id: 'professionnels',
      title: 'Les Alliés',
      subtitle: "L'équipe des entraîneurs de choc 👨‍⚕️🤝",
      icon: <Users className={`w-6 h-6 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />,
      desc: 'La dream team du cerveau : orthophonistes, ergothérapeutes, enseignants et parents bienveillants.',
      tag: 'Entourage & Soins',
      tagColor: isDark
        ? 'bg-teal-950/80 text-teal-300 border-teal-800'
        : 'bg-teal-100 text-teal-800 border-teal-300',
    },
    {
      id: 'super-pouvoirs',
      title: 'Super-pouvoirs',
      subtitle: 'Nos forces & Tous ensemble ! 🌟🚀',
      icon: <Award className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />,
      desc: 'La ligue des esprits créatifs, l’empathie, la persévérance et le pacte d’entraide en classe.',
      tag: 'Forces uniques',
      tagColor: isDark
        ? 'bg-yellow-950/80 text-yellow-300 border-yellow-800'
        : 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
  ];

  return (
    <div
      className={`font-comicneue text-lg sm:text-xl leading-relaxed transition-colors min-h-screen ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f7f9fc] text-[#111111]'
      }`}
    >
      {/* Main Container */}
      <main
        className={`max-w-[920px] mx-auto my-6 sm:my-8 p-4 sm:p-8 rounded-xl space-y-8 transition-colors ${
          isDark
            ? 'bg-slate-900 border-2 border-slate-700 shadow-2xl'
            : 'bg-white border-2 border-[#222222] shadow-md'
        }`}
      >
        {/* Main Title */}
        <h1
          className={`text-2xl sm:text-4xl font-extrabold m-0 tracking-tight leading-tight ${
            isDark ? 'text-sky-400' : 'text-[#005a9c]'
          }`}
        >
          Bienvenue dans l'aventure des cerveaux extraordinaires !
        </h1>

        {/* Story Box */}
        <section
          aria-labelledby="story-title"
          className={`border-l-6 p-4 sm:p-6 rounded-r-xl space-y-3 transition-colors ${
            isDark
              ? 'bg-slate-800/80 border-sky-400 text-slate-100'
              : 'bg-[#eef5fc] border-[#005a9c] text-slate-900'
          }`}
        >
          <h2
            id="story-title"
            className={`text-xl sm:text-2xl font-bold border-b-0 pb-0 m-0 ${
              isDark ? 'text-sky-300' : 'text-[#005a9c]'
            }`}
          >
            L'histoire : Le grand orchestre des idées 🎻🎷🥁
          </h2>
          <p className="m-0">
            Imagine que ton cerveau est un grand orchestre. Dans cet orchestre, il y a des violons,
            des flûtes, des tambours et des pianos.
          </p>
          <p className="m-0">
            Chez certaines personnes, la musique se joue très vite. Chez d'autres, certains
            instruments jouent une mélodie différente ou ont besoin de plus de temps pour
            s'accorder. Est-ce que la musique est moins belle ? Pas du tout ! Elle est juste originale
            et unique.
          </p>
        </section>

        {/* What is a DYS disorder? */}
        <section aria-labelledby="dys-def-title" className="space-y-3">
          <h2
            id="dys-def-title"
            className={`text-xl sm:text-2xl font-bold border-b-2 pb-1 m-0 ${
              isDark
                ? 'text-slate-100 border-slate-700'
                : 'text-[#222222] border-[#dddddd]'
            }`}
          >
            C'est quoi un trouble DYS ? 💡
          </h2>
          <p className={`m-0 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Le mot <strong>"DYS"</strong> regroupe de petites difficultés naturelles du cerveau pour
            lire, écrire, compter, parler ou faire des gestes précis.
          </p>
          <p className={`m-0 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            Ce n'est pas une maladie, ce n'est pas contagieux et cela n'a rien à voir avec
            l'intelligence ! C'est simplement une manière différente de fonctionner.
          </p>
        </section>

        {/* Video Section */}
        <section
          aria-labelledby="video-title"
          className={`border-l-6 p-4 sm:p-6 rounded-r-xl space-y-3 transition-colors ${
            isDark
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-100'
              : 'bg-[#e8f5e9] border-[#2e7d32] text-slate-900'
          }`}
        >
          <h2
            id="video-title"
            className={`text-xl sm:text-2xl font-bold border-b-0 pb-0 m-0 ${
              isDark ? 'text-emerald-400' : 'text-[#1b5e20]'
            }`}
          >
            À découvrir en musique : DYS, DYS, DYS... C'est pas grave ! 🎵
          </h2>
          <p className={`m-0 ${isDark ? 'text-emerald-200' : 'text-[#1b5e20]'}`}>
            Découvre cette vidéo musicale pour chanter et comprendre que chacun apprend à sa manière :
          </p>

          <div
            className={`video-container shadow-xs ${
              isDark ? 'border-2 border-slate-700' : 'border-2 border-[#222222]'
            }`}
          >
            <iframe
              src="https://www.youtube.com/embed/j3JXTtPyOXU"
              title="DYS, DYS, DYS... C'est pas grave ! 🎵 (Chanson sur la Neurodiversité et les DYS)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        {/* Explore all chapters */}
        <section
          aria-labelledby="chapters-title"
          className={`space-y-4 pt-4 border-t-2 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2
              id="chapters-title"
              className={`text-xl sm:text-2xl font-bold m-0 ${
                isDark ? 'text-slate-100' : 'text-[#222222]'
              }`}
            >
              Explorer les guides des Super Cerveaux 🚀
            </h2>
            <span className={`text-sm font-bold ${isDark ? 'text-sky-400' : 'text-[#005a9c]'}`}>
              9 thématiques
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigate(card.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between group focus:outline-none focus:ring-3 focus:ring-amber-400 ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-sky-400 text-slate-100'
                    : 'bg-[#fdfdfd] border-[#222222] hover:bg-[#eef5fc] hover:border-[#005a9c] text-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-lg border ${
                        isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                      }`}
                    >
                      {card.icon}
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${card.tagColor}`}
                    >
                      {card.tag}
                    </span>
                  </div>
                  <h3
                    className={`text-lg font-bold group-hover:underline ${
                      isDark ? 'text-sky-300' : 'text-[#005a9c]'
                    }`}
                  >
                    {card.title}
                  </h3>
                  <div
                    className={`text-xs font-bold mt-0.5 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {card.subtitle}
                  </div>
                  <p
                    className={`text-sm mt-1.5 leading-normal ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {card.desc}
                  </p>
                </div>
                <div
                  className={`mt-3 pt-2 border-t flex items-center justify-between text-xs font-bold ${
                    isDark
                      ? 'border-slate-700 text-sky-400'
                      : 'border-slate-200 text-[#005a9c]'
                  }`}
                >
                  <span>Lire la fiche</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`text-center p-6 border-t-2 mt-8 text-sm sm:text-base transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-400'
            : 'bg-white border-[#dddddd] text-slate-700'
        }`}
      >
        <p className="m-0 font-medium">
          Site éducatif et accessible — Conçu pour l'apprentissage et l'entraide à l'école primaire.
        </p>
      </footer>
    </div>
  );
};
