import React from 'react';
import { SuperPageId } from './SuperCerveauxHeader';
import { ArrowLeft } from 'lucide-react';

interface ThematicPageProps {
  pageId: SuperPageId;
  onNavigate: (page: SuperPageId) => void;
  theme: 'light' | 'dark';
}

interface BulletItem {
  title: string;
  text: string;
}

interface ThematicContent {
  pageTitle: string;
  story: {
    header: string;
    paragraphs: string[];
  };
  explanation: {
    header: string;
    paragraphs?: string[];
    bullets?: BulletItem[];
  };
  tips: {
    header: string;
    bullets: BulletItem[];
  };
}

const THEMATIC_DATA: Record<Exclude<SuperPageId, 'accueil' | 'syllabodys'>, ThematicContent> = {
  dyslexie: {
    pageTitle: "La Dyslexie : Les lettres acrobates 🤸‍♂️📖",
    story: {
      header: "L'histoire : Le bal masqué des lettres 🎭",
      paragraphs: [
        "Imagine que les lettres d'un livre aiment faire la fête ! Quand un enfant dyslexique ouvre un livre, les lettres comme le b, le d, le p et le q mettent des masques et dansent sur la page.",
        "Elles se ressemblent beaucoup et se mélangent facilement. Le cerveau doit faire un grand effort d'enquêteur pour reconnaître qui est qui !",
      ],
    },
    explanation: {
      header: "Qu'est-ce que la dyslexie ? 🔍",
      paragraphs: [
        "La dyslexie est une difficulté particulière à transformer les lettres écrites en sons parlés.",
        "Lire demande beaucoup plus d'énergie et de concentration. Ce n'est pas parce que l'enfant ne veut pas lire, mais parce que son cerveau emprunte un chemin plus long pour décoder les mots.",
      ],
    },
    tips: {
      header: "Conseils & astuces pour s'entraider 🤝",
      bullets: [
        {
          title: "Utiliser un réglet de lecture",
          text: "Poser une règle sous la ligne pour aider les yeux à ne pas se perdre.",
        },
        {
          title: "Prendre son temps",
          text: "Laisser son camarade lire à son rythme sans lui couper la parole.",
        },
        {
          title: "Écouter des livres audio",
          text: "C'est une super façon d'aimer les histoires en soulageant ses yeux !",
        },
      ],
    },
  },
  dyscalculie: {
    pageTitle: "La Dyscalculie : La magie des nombres 🧮🔢",
    story: {
      header: "L'histoire : Le labyrinthe des nombres mystères 🧩",
      paragraphs: [
        "Pour beaucoup, les nombres sont comme des briques très ordonnées : 1, puis 2, puis 3. Mais pour un enfant dyscalculique, les chiffres ressemblent parfois à un labyrinthe secret ou à une langue étrangère.",
        "Imaginer la taille d'une quantité ou retenir une table de multiplication devient alors un vrai défi qui demande des trésors d'astuces.",
      ],
    },
    explanation: {
      header: "Qu'est-ce que la dyscalculie ? 💡",
      paragraphs: [
        "La dyscalculie touche la compréhension des nombres, des formes géométriques, du temps et des calculs mathématiques.",
        "Cela ne veut pas dire qu'on ne peut pas aimer les maths ! Cela veut dire qu'on a besoin d'outils concrets (comme des objets, des dessins ou des bouliers) pour bien se représenter ce que représentent les chiffres.",
      ],
    },
    tips: {
      header: "Conseils & astuces pour s'entraider 🤝",
      bullets: [
        {
          title: "Utiliser des objets ou ses doigts",
          text: "Compter avec des jetons, des bandes numériques ou des lignes du temps.",
        },
        {
          title: "Dessiner les problèmes",
          text: "Transformer un énoncé de maths en un petit dessin coloré.",
        },
        {
          title: "Prendre du matériel visuel",
          text: "S'aider de tables d'addition/multiplication sous la main.",
        },
      ],
    },
  },
  dyspraxie: {
    pageTitle: "La Dyspraxie : Les gestes maladroits 🎨✂️👟",
    story: {
      header: "L'histoire : Le chef d'orchestre des mouvements 🎼",
      paragraphs: [
        "Imagine que ton cerveau soit un chef d'orchestre qui envoie des messages à tes mains et tes pieds. Pour fermer une fermeture éclair, nouer ses lacets ou découper une feuille, il faut envoyer plusieurs ordres très vite !",
        "Chez un enfant dyspraxique, les musiciens mettent un peu plus de temps à recevoir la partition du chef d'orchestre. Le geste demande beaucoup plus d'efforts et d'attention.",
      ],
    },
    explanation: {
      header: "Qu'est-ce que la dyspraxie ? 💡",
      paragraphs: [
        "La dyspraxie est un trouble de la planification et de la coordination des mouvements.",
        "Faire du vélo, utiliser des ciseaux, dessiner ou s'habiller demande une énergie immense. Les personnes dyspraxiques ne font pas exprès d'être \"maladroites\" : leur cerveau doit réapprendre chaque geste séparément.",
      ],
    },
    tips: {
      header: "Conseils & astuces pour s'entraider 🤝",
      bullets: [
        {
          title: "Utiliser des outils adaptés",
          text: "Des ciseaux ergonomiques, des chaussures à scratchs ou du matériel antidérapant.",
        },
        {
          title: "Encourager sans presser",
          text: "Laisser du temps pour s'habiller ou ranger ses affaires sans se moquer des petits accidents.",
        },
        {
          title: "Proposer son aide",
          text: "Tenir la feuille pendant que son camarade découpe ou colle un élément.",
        },
      ],
    },
  },
  dysphasie: {
    pageTitle: "La Dysphasie : Les mots sur le bout de la langue 🗣️💬",
    story: {
      header: "L'histoire : Le traducteur un peu débordé 🎙️",
      paragraphs: [
        "Imagine que dans ta tête, tu as plein d'idées géniales et de belles histoires à raconter. Mais au moment de parler, le petit traducteur secret de ton cerveau hésite ou mélange la place des mots.",
        "Le mot que tu cherches est juste là, sur le bout de la langue, mais il met un peu plus de temps à sortir !",
      ],
    },
    explanation: {
      header: "Qu'est-ce que la dysphasie ? 💡",
      paragraphs: [
        "La dysphasie est un trouble du langage oral qui touche la façon d'exprimer ses idées ou de comprendre ce que disent les autres.",
        "Trouver le bon mot, construire de longues phrases ou suivre une consigne orale très rapide demande un gros effort d'attention.",
      ],
    },
    tips: {
      header: "Conseils & astuces pour s'entraider 🤝",
      bullets: [
        {
          title: "S'aider des gestes et des images",
          text: "Utiliser des dessins ou pointer du doigt pour compléter sa parole.",
        },
        {
          title: "Faire des phrases simples",
          text: "Parler calmement, une idée à la fois.",
        },
        {
          title: "Écouter avec patience",
          text: "Laisser son camarade finir ses phrases sans lui couper la parole ou deviner trop vite à sa place.",
        },
      ],
    },
  },
  dysorthographie: {
    pageTitle: "La Dysorthographie : L'art des sons et des lettres ✍️🔍",
    story: {
      header: "L'histoire : Le détective des secrets cachés 🕵️",
      paragraphs: [
        "Dans la langue française, les mots sont parfois de vraies énigmes ! Pourquoi y a-t-il un \"s\" muet à la fin de \"temps\" ? Pourquoi \"eau\" fait le son [o] ?",
        "Pour un enfant dysorthographique, retenir l'orthographe exacte des mots et les règles d'accord ressemble à une enquête sans fin où les règles changent tout le temps.",
      ],
    },
    explanation: {
      header: "Qu'est-ce que la dysorthographie ? 💡",
      paragraphs: [
        "La dysorthographie est une difficulté durable à assimiler l'orthographe, les accords et la découpe des mots dans la phrase.",
        "Elle est souvent associée à la dyslexie. L'enfant entend bien les sons, mais le cerveau a du mal à fixer la \"photo\" exacte du mot dans sa mémoire.",
      ],
    },
    tips: {
      header: "Conseils & astuces pour s'entraider 🤝",
      bullets: [
        {
          title: "Créer des fiches illustrées",
          text: "Associer un petit dessin ou une couleur à la lettre muette d'un mot (ex: un grand \"T\" en forme de toit pour \"chat\").",
        },
        {
          title: "Utiliser des correcteurs vocaux",
          text: "S'aider d'outils numériques pour relire ses écrits.",
        },
        {
          title: "Privilégier le fond sur la forme",
          text: "Valoriser les bonnes idées racontées plutôt que de compter uniquement les fautes d'orthographe.",
        },
      ],
    },
  },
  dysgraphie: {
    pageTitle: "La Dysgraphie : Le crayon rebelle ✏️🎨",
    story: {
      header: "L'histoire : Dessiner avec des gants de ski ⛷️✏️",
      paragraphs: [
        "Pour comprendre ce que ressent un enfant dysgraphique, imagine que tu dois écrire toute une journée en portant de gros gants de ski.",
        "Tenir le stylo fait vite mal aux doigts, la main fatigue énormément et tracer de belles boucles régulières demande une attention de tous les instants.",
      ],
    },
    explanation: {
      header: "Qu'est-ce que la dysgraphie ? 💡",
      paragraphs: [
        "La dysgraphie est un trouble qui affecte le geste d'écriture (la forme des lettres, la vitesse et la régularité du tracé).",
        "Ce n'est absolument pas de la paresse ou du soin négligé : la main se fatigue simplement beaucoup plus vite que chez les autres enfants.",
      ],
    },
    tips: {
      header: "Conseils & astuces pour s'entraider 🤝",
      bullets: [
        {
          title: "Utiliser un guide-doigts",
          text: "Mettre un petit embout en caoutchouc sur son crayon pour mieux le tenir.",
        },
        {
          title: "Découvrir le clavier",
          text: "Utiliser un ordinateur pour taper les textes plus rapidement sans fatigue physique.",
        },
        {
          title: "Faire des pauses étirements",
          text: "Détendre ses doigts et son poignet en faisant l'étoile de mer avec la main !",
        },
      ],
    },
  },
  tdah: {
    pageTitle: "Le TDAH : Le moteur de fusée et les super-antennes 🚀📡",
    story: {
      header: "L'histoire : Le bolide aux mille pensées 🏎️🧠",
      paragraphs: [
        "Imagine que ton cerveau soit un moteur de formule 1 très puissant, connecté à des antennes réceptrices ultra-sensibles qui captent le moindre petit bruit : l'oiseau à la fenêtre, le crayon qui tombe, ou le murmure dans le couloir.",
        "Le moteur va très vite, mais les freins de la voiture demandent un apprentissage particulier pour bien doser la vitesse et rester sur le circuit !",
      ],
    },
    explanation: {
      header: "Qu'est-ce que le TDAH ? 💡",
      paragraphs: [
        "TDAH signifie Trouble du Déficit de l'Attention avec ou sans Hyperactivité.",
        "Le cerveau capte tout en même temps ! Il a parfois du mal à filtrer les informations inutiles, ce qui rend l'écoute prolongée difficile ou donne une grande envie de bouger pour se reconcentrer.",
      ],
    },
    tips: {
      header: "Conseils & astuces pour s'entraider 🤝",
      bullets: [
        {
          title: "Faire de petites pauses mouvements",
          text: "S'accorder quelques secondes pour s'étirer ou bouger discrètement (ex: ballon assise ou fidget).",
        },
        {
          title: "Découper le travail en mini-missions",
          text: "Se concentrer sur une seule tâche courte à la fois.",
        },
        {
          title: "Créer un espace calme",
          text: "Éloigner les objets distrayants au moment des devoirs.",
        },
      ],
    },
  },
  professionnels: {
    pageTitle: "Les Alliés : L'équipe des entraîneurs de choc 👨‍⚕️🤝",
    story: {
      header: "L'histoire : La dream team du cerveau 🦸✨",
      paragraphs: [
        "Même les plus grands champions du monde ont besoin d'entraîneurs, de préparateurs physiques et de spécialistes pour réussir des exploits.",
        "Pour les enfants avec des troubles DYS, c'est la même chose ! Ils ont autour d'eux une équipe formidable d'adultes bienveillants, chacun spécialisé dans un domaine précis pour les aider à s'épanouir.",
      ],
    },
    explanation: {
      header: "Qui sont tous ces super professionnels ? 💡",
      bullets: [
        {
          title: "L'Orthophoniste",
          text: "Le coach des mots, de la lecture, de la parole et des calculs.",
        },
        {
          title: "Le Psychologue / Neuropsychologue",
          text: "L'enquêteur du cerveau ! Il évalue la mémoire, la concentration et aide à comprendre ses émotions et ses super forces.",
        },
        {
          title: "Le Psychomotricien",
          text: "L'entraîneur de l'équilibre, de la coordination du corps, du repérage dans l'espace et du geste de la main.",
        },
        {
          title: "L'Ergothérapeute",
          text: "Le spécialiste des astuces du quotidien ! Il aide à utiliser l'ordinateur, les outils adaptés et à organiser son bureau.",
        },
        {
          title: "L'Orthoptiste",
          text: "L'expert de la vue et des yeux ! Il rééduque les muscles des yeux pour que le regard suive bien les lignes de lecture.",
        },
        {
          title: "Le Médecin (Pédiatre, Neuropédiatre)",
          text: "Le docteur capitaine qui coordonne la santé et valide les bilans.",
        },
        {
          title: "Les alliés à l'école (Enseignant, AESH)",
          text: "Les guides au quotidien qui adaptent le travail en classe et encouragent chaque élève.",
        },
      ],
    },
    tips: {
      header: "Quels sont les super aménagements à l'école ? 🎒",
      bullets: [
        {
          title: "Le temps supplémentaire",
          text: "Avoir un peu plus de temps pour terminer un contrôle sans se presser.",
        },
        {
          title: "Les supports adaptés",
          text: "Textes écrits plus gros, couleurs repères ou ordinateur en classe.",
        },
        {
          title: "Le droit de souffler",
          text: "Des petites pauses autorisées pour détendre son attention et son corps.",
        },
      ],
    },
  },
  'super-pouvoirs': {
    pageTitle: "Nos super-pouvoirs & Tous ensemble ! 🌟🚀",
    story: {
      header: "L'histoire : La ligue des esprits créatifs 🎨🧩💡",
      paragraphs: [
        "Savais-tu que de très grands inventeurs, artistes, scientifiques et champions de sport étaient dyslexiques, dyspraxiques ou avaient un TDAH ?",
        "Parce que leur cerveau fonctionne différemment, ils ont développé une imagination débordante, une grande mémoire visuelle, une énergie incroyable et une façon unique de résoudre les problèmes !",
      ],
    },
    explanation: {
      header: "Quels sont nos super-pouvoirs ? 💡",
      bullets: [
        {
          title: "Une créativité débordante",
          text: "Inventer des histoires, dessiner, construire et imaginer des solutions originales.",
        },
        {
          title: "Une grande empathie",
          text: "Comprendre facilement ce que ressentent les autres et aimer les aider.",
        },
        {
          title: "Une vision globale",
          text: "Voir le tableau d'ensemble très rapidement avant même d'étudier les détails.",
        },
        {
          title: "Une persévérance de champion",
          text: "À force de s'entraîner, les enfants DYS développent un courage et une volonté extraordinaires !",
        },
      ],
    },
    tips: {
      header: "Le pacte de l'entraide en classe 🤝",
      bullets: [
        {
          title: "Célébrer la différence",
          text: "Chaque élève est fort dans un domaine et a besoin d'aide dans un autre.",
        },
        {
          title: "S'encourager tous les jours",
          text: "Un mot gentil ou un geste d'aide rend la classe plus forte et plus heureuse.",
        },
        {
          title: "N'avoir jamais honte de demander",
          text: "Poser une question, c'est le premier pas pour apprendre !",
        },
      ],
    },
  },
};

export const ThematicPage: React.FC<ThematicPageProps> = ({ pageId, onNavigate, theme }) => {
  if (pageId === 'accueil' || pageId === 'syllabodys') return null;

  const isDark = theme === 'dark';
  const data = THEMATIC_DATA[pageId];

  return (
    <div
      className={`font-comicneue text-lg sm:text-xl leading-relaxed py-6 sm:py-8 px-4 transition-colors min-h-screen ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f7f9fc] text-[#111111]'
      }`}
    >
      <main
        className={`max-w-[860px] mx-auto rounded-xl p-6 sm:p-10 space-y-7 transition-colors ${
          isDark
            ? 'bg-slate-900 border-2 border-slate-700 shadow-2xl'
            : 'bg-white border-2 border-[#222222] shadow-md'
        }`}
      >
        {/* Top Navigation button back to Home */}
        <div
          className={`flex items-center justify-start border-b-2 pb-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => onNavigate('accueil')}
            className={`inline-flex items-center gap-2 text-sm sm:text-base font-bold hover:underline cursor-pointer ${
              isDark ? 'text-sky-400 hover:text-sky-300' : 'text-[#005a9c]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>
        </div>

        {/* 1. Page Header matching user's image exactly */}
        <h1
          className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold m-0 tracking-tight leading-tight ${
            isDark ? 'text-sky-400' : 'text-[#005a9c]'
          }`}
        >
          {data.pageTitle}
        </h1>

        {/* 2. Story Box ("L'histoire") matching user's image */}
        <section
          className={`border-l-[5px] p-5 sm:p-6 rounded-r-lg space-y-3 transition-colors ${
            isDark
              ? 'bg-slate-800/85 border-sky-400 text-slate-100'
              : 'bg-[#eef5fc] border-[#005a9c] text-slate-900'
          }`}
        >
          <h2
            className={`text-xl sm:text-2xl font-bold m-0 ${
              isDark ? 'text-sky-300' : 'text-[#0f172a]'
            }`}
          >
            {data.story.header}
          </h2>

          <div
            className={`border-b my-2 ${
              isDark ? 'border-slate-700/80' : 'border-[#d8e7f5]'
            }`}
          />

          <div className="space-y-3 text-base sm:text-lg leading-relaxed">
            {data.story.paragraphs.map((p, idx) => (
              <p key={idx} className="m-0">
                {/* Highlight letters b, d, p, q in bold as in image 1 */}
                {p.includes('le b, le d, le p et le q') ? (
                  <>
                    Imagine que les lettres d'un livre aiment faire la fête ! Quand un enfant dyslexique
                    ouvre un livre, les lettres comme le <strong>b</strong>, le <strong>d</strong>, le{' '}
                    <strong>p</strong> et le <strong>q</strong> mettent des masques et dansent sur la
                    page.
                  </>
                ) : (
                  p
                )}
              </p>
            ))}
          </div>
        </section>

        {/* 3. Explanation Section matching user's image */}
        <section className="space-y-3 pt-1">
          <h2
            className={`text-xl sm:text-2xl font-bold m-0 ${
              isDark ? 'text-slate-100' : 'text-[#111111]'
            }`}
          >
            {data.explanation.header}
          </h2>

          <div
            className={`border-b my-2 ${
              isDark ? 'border-slate-700' : 'border-gray-200'
            }`}
          />

          {data.explanation.paragraphs && (
            <div className="space-y-3 text-base sm:text-lg leading-relaxed">
              {data.explanation.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={`m-0 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                >
                  {p}
                </p>
              ))}
            </div>
          )}

          {data.explanation.bullets && (
            <ul className="space-y-2.5 m-0 p-0 list-none text-base sm:text-lg leading-relaxed">
              {data.explanation.bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span
                    className={`font-black select-none text-lg leading-normal ${
                      isDark ? 'text-sky-400' : 'text-[#005a9c]'
                    }`}
                  >
                    •
                  </span>
                  <span>
                    <strong className="font-bold">{b.title}</strong> : {b.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 4. Tips Box ("Conseils & astuces") matching user's image */}
        <section
          className={`border-l-[5px] p-5 sm:p-6 rounded-r-lg space-y-3 transition-colors ${
            isDark
              ? 'bg-emerald-950/35 border-emerald-500 text-emerald-100'
              : 'bg-[#eef7ee] border-[#2e7d32] text-slate-900'
          }`}
        >
          <h2
            className={`text-xl sm:text-2xl font-bold m-0 ${
              isDark ? 'text-emerald-400' : 'text-[#1b5e20]'
            }`}
          >
            {data.tips.header}
          </h2>

          <div
            className={`border-b my-2 ${
              isDark ? 'border-emerald-800/50' : 'border-[#c8e6c9]'
            }`}
          />

          <ul className="space-y-2.5 m-0 p-0 list-none text-base sm:text-lg leading-relaxed">
            {data.tips.bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span
                  className={`font-black select-none text-lg leading-normal ${
                    isDark ? 'text-emerald-400' : 'text-[#2e7d32]'
                  }`}
                >
                  •
                </span>
                <span>
                  <strong className="font-bold">{b.title}</strong> : {b.text}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom Navigation */}
        <div
          className={`pt-4 border-t-2 flex items-center justify-between gap-3 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => onNavigate('accueil')}
            className={`px-4 py-2 rounded-lg border-2 font-bold text-sm sm:text-base cursor-pointer transition-colors ${
              isDark
                ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'border-[#222222] bg-white hover:bg-slate-100 text-slate-900'
            }`}
          >
            ← Retour à l'accueil
          </button>
        </div>
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
