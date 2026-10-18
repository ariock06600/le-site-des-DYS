import React from 'react';
import { SuperPageId } from './SuperCerveauxHeader';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Brain,
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
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const quickCards: {
    id: SuperPageId;
    title: string;
    icon: React.ReactNode;
    desc: string;
    tag: string;
    tagColor: string;
  }[] = [
    {
      id: 'dyslexie',
      title: 'Dyslexie',
      icon: <BookOpen className="w-6 h-6 text-sky-600" />,
      desc: 'Quand les lettres dansent ou changent de place. Découvre comment les dompter avec les syllabes !',
      tag: 'Lecture',
      tagColor: 'bg-sky-100 text-sky-800 border-sky-300',
    },
    {
      id: 'dyscalculie',
      title: 'Dyscalculie',
      icon: <Calculator className="w-6 h-6 text-emerald-600" />,
      desc: 'Quand les nombres, les calculs et le sens du temps ont besoin de repères visuels concrets.',
      tag: 'Nombres & Mesures',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'dyspraxie',
      title: 'Dyspraxie',
      icon: <Compass className="w-6 h-6 text-amber-600" />,
      desc: 'Le chef d’orchestre des mouvements et de la coordination spatiale (lacets, découpage, sport).',
      tag: 'Gestes & Espace',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'dysphasie',
      title: 'Dysphasie',
      icon: <MessageSquare className="w-6 h-6 text-purple-600" />,
      desc: 'Quand les mots oraux jouent à cache-cache dans les phrases et demandent du temps.',
      tag: 'Langage oral',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      id: 'dysorthographie',
      title: 'Dysorthographie',
      icon: <PenTool className="w-6 h-6 text-rose-600" />,
      desc: 'Quand les accords et les pièges de l’orthographe s’emmêlent les pinceaux.',
      tag: 'Orthographe',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      id: 'dysgraphie',
      title: 'Dysgraphie',
      icon: <Edit3 className="w-6 h-6 text-indigo-600" />,
      desc: 'Quand tenir le stylo fatigue la main et que tracer les lettres demande un effort immense.',
      tag: 'Écriture manuelle',
      tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      id: 'tdah',
      title: 'TDAH',
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      desc: 'Un moteur de fusée dans la tête : une curiosité géante, une immense énergie et l’hyperfocus !',
      tag: 'Attention & Énergie',
      tagColor: 'bg-orange-100 text-orange-800 border-orange-300',
    },
    {
      id: 'professionnels',
      title: 'Les Alliés',
      icon: <Users className="w-6 h-6 text-teal-600" />,
      desc: 'Orthophonistes, ergothérapeutes, enseignants, parents : la super équipe qui t’accompagne.',
      tag: 'Entourage & Soins',
      tagColor: 'bg-teal-100 text-teal-800 border-teal-300',
    },
    {
      id: 'super-pouvoirs',
      title: 'Super-pouvoirs',
      icon: <Award className="w-6 h-6 text-yellow-600" />,
      desc: 'Créativité, vision globale, empathie, persévérance : les talents cachés des profils neuroatypiques.',
      tag: 'Forces uniques',
      tagColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
  ];

  return (
    <div className="bg-[#f7f9fc] text-[#111111] font-comicneue text-lg sm:text-xl leading-relaxed">
      {/* Main Container styled exactly like user's snippet */}
      <main className="max-w-[920px] mx-auto my-6 sm:my-8 p-4 sm:p-8 bg-white border-2 border-[#222222] rounded-xl shadow-md space-y-8">
        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#005a9c] m-0 tracking-tight leading-tight">
          Bienvenue dans l'aventure des cerveaux extraordinaires !
        </h1>

        {/* Story Box */}
        <section
          aria-labelledby="story-title"
          className="bg-[#eef5fc] border-l-6 border-[#005a9c] p-4 sm:p-6 rounded-r-xl space-y-3"
        >
          <h2
            id="story-title"
            className="text-xl sm:text-2xl font-bold text-[#005a9c] border-b-0 pb-0 m-0"
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
            className="text-xl sm:text-2xl font-bold text-[#222222] border-b-2 border-[#dddddd] pb-1 m-0"
          >
            C'est quoi un trouble DYS ? 💡
          </h2>
          <p className="m-0">
            Le mot <strong>"DYS"</strong> regroupe de petites difficultés naturelles du cerveau pour
            lire, écrire, compter, parler ou faire des gestes précis.
          </p>
          <p className="m-0">
            Ce n'est pas une maladie, ce n'est pas contagieux et cela n'a rien à voir avec
            l'intelligence ! C'est simplement une manière différente de fonctionner.
          </p>
        </section>

        {/* Big Highlight Card: Launch the SyllaboDys Subpage */}
        <section className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-3 border-[#005a9c] rounded-xl p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#005a9c] text-white">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Outil pédagogique intégré</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#005a9c] m-0">
                Atelier de Lecture SyllaboDys 📖🎨
              </h2>
              <p className="text-base sm:text-lg text-[#222222] m-0 max-w-xl">
                Une application complète pour <strong>découper et colorer les syllabes</strong>,
                espacer les mots, afficher des ponts de lecture et exporter des fiches d'exercices
                en PDF en 1 clic !
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-bold pt-1">
                <span className="px-2.5 py-0.5 rounded bg-white border border-slate-300">
                  Polices DYS & Lexend
                </span>
                <span className="px-2.5 py-0.5 rounded bg-white border border-slate-300">
                  Palettes bicolores & tricolores
                </span>
                <span className="px-2.5 py-0.5 rounded bg-white border border-slate-300">
                  Export PDF propre A4
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('syllabodys')}
              className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#005a9c] hover:bg-[#003d6b] text-white font-black text-lg transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#ffbf47] cursor-pointer group"
            >
              <span>Ouvrir l'Atelier SyllaboDys</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Video Section styled exactly like user's snippet */}
        <section
          aria-labelledby="video-title"
          className="bg-[#e8f5e9] border-l-6 border-[#2e7d32] p-4 sm:p-6 rounded-r-xl space-y-3"
        >
          <h2
            id="video-title"
            className="text-xl sm:text-2xl font-bold text-[#1b5e20] border-b-0 pb-0 m-0"
          >
            À découvrir en musique : DYS, DYS, DYS... C'est pas grave ! 🎵
          </h2>
          <p className="m-0 text-[#1b5e20]">
            Découvre cette vidéo musicale pour chanter et comprendre que chacun apprend à sa manière :
          </p>

          <div className="video-container shadow-xs">
            <iframe
              src="https://www.youtube.com/embed/j3JXTtPyOXU"
              title="DYS, DYS, DYS... C'est pas grave ! 🎵 (Chanson sur la Neurodiversité et les DYS)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        {/* Explore all chapters */}
        <section aria-labelledby="chapters-title" className="space-y-4 pt-4 border-t-2 border-slate-200">
          <div className="flex items-center justify-between">
            <h2 id="chapters-title" className="text-xl sm:text-2xl font-bold text-[#222222] m-0">
              Explorer les guides des Super Cerveaux 🚀
            </h2>
            <span className="text-sm font-bold text-[#005a9c]">9 thématiques</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigate(card.id)}
                className="text-left p-4 rounded-xl border-2 border-[#222222] bg-[#fdfdfd] hover:bg-[#eef5fc] hover:border-[#005a9c] transition-all cursor-pointer flex flex-col justify-between group focus:outline-none focus:ring-3 focus:ring-[#ffbf47]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      {card.icon}
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${card.tagColor}`}
                    >
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#005a9c] group-hover:underline">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-700 mt-1.5 leading-normal">{card.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#005a9c]">
                  <span>Lire la fiche</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer matching user's snippet */}
      <footer className="text-center p-6 bg-white border-t-2 border-[#dddddd] mt-8 text-sm sm:text-base text-slate-700">
        <p className="m-0 font-medium">
          Site éducatif et accessible — Conçu pour l'apprentissage et l'entraide à l'école primaire.
        </p>
      </footer>
    </div>
  );
};
