import React from 'react';
import { SuperPageId } from './SuperCerveauxHeader';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Heart,
  Zap,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

interface ThematicPageProps {
  pageId: SuperPageId;
  onNavigate: (page: SuperPageId) => void;
}

interface ThematicContent {
  title: string;
  subtitle: string;
  metaphor: {
    title: string;
    description: string;
    icon: string;
  };
  whatIsIt: string[];
  superpowers: string[];
  tipsForSchoolAndHome: string[];
  showSyllaboDysCTA?: boolean;
}

const THEMATIC_DATA: Record<Exclude<SuperPageId, 'accueil' | 'syllabodys'>, ThematicContent> = {
  dyslexie: {
    title: 'La Dyslexie 📖',
    subtitle: 'Lire avec des yeux différents et dompter le mystère des lettres',
    metaphor: {
      title: 'L’explorateur des chemins de traverse 🧭',
      description:
        'Pour la plupart des gens, lire est une autoroute toute droite. Pour le cerveau dyslexique, c’est un sentier en forêt avec des panoramas magnifiques : il faut décoder les repères un par un avec persévérance !',
      icon: '🌳',
    },
    whatIsIt: [
      'Difficulté à associer rapidement les lettres (graphèmes) et leurs sons correspondants (phonèmes).',
      'Les lettres comme b / d ou p / q peuvent sembler se retourner ou tourner comme des miroirs.',
      'La lecture à voix haute demande une très grande énergie mentale, ce qui peut provoquer une fatigue rapide.',
      'Cela n’a aucun rapport avec l’intelligence : de très grands inventeurs, écrivains et scientifiques sont dyslexiques !',
    ],
    superpowers: [
      'Une mémoire visuelle et spatiale souvent hors du commun (pensée en 3D).',
      'Une créativité débordante pour trouver des solutions originales.',
      'Une capacité à voir "la grande image" (big picture) plutôt que de rester bloqué sur les détails.',
    ],
    tipsForSchoolAndHome: [
      'Segmenter et colorer les syllabes en alternance (utilise notre outil SyllaboDys !).',
      'Augmenter l’espacement entre les lignes (interligne 1.8 ou 2.0) et entre les lettres.',
      'Utiliser des polices de caractères adaptées comme OpenDyslexic ou Lexend.',
      'Accorder du temps supplémentaire pour lire les consignes sans stress.',
    ],
    showSyllaboDysCTA: true,
  },
  dyscalculie: {
    title: 'La Dyscalculie 🔢',
    subtitle: 'Comprendre les nombres, le temps et la boussole mathématique',
    metaphor: {
      title: 'La balance magique des quantités ⚖️',
      description:
        'Quand d’autres visualisent tout de suite que 7 est plus grand que 5, le cerveau dyscalculique a besoin de peser, toucher et voir concrètement les billes sur la balance.',
      icon: '🧮',
    },
    whatIsIt: [
      'Difficulté persistante à mémoriser les tables d’addition et de multiplication.',
      'Difficulté à estimer des grandeurs, des distances ou à lire l’heure sur une horloge à aiguilles.',
      'Confusion fréquente entre les symboles mathématiques (+, -, ×, ÷).',
      'Difficulté à manipuler la monnaie ou à compter de tête.',
    ],
    superpowers: [
      'Grande sensibilité artistique, littéraire ou verbale.',
      'Sens développé de l’empathie et de la narration.',
      'Talent pour conceptualiser des idées abstraites sans passer par des chiffres.',
    ],
    tipsForSchoolAndHome: [
      'Utiliser du matériel manipulable : jetons, réglettes Cuisenaire, perles ou LEGO.',
      'Associer des couleurs à chaque opération (+ en vert, - en rouge).',
      'Autoriser les tables mémo et la calculatrice en classe.',
      'Privilégier les montres digitales avec repères de temps visuels (ex: Time Timer).',
    ],
  },
  dyspraxie: {
    title: 'La Dyspraxie ✂️',
    subtitle: 'L’orchestration des gestes du quotidien et de l’espace',
    metaphor: {
      title: 'L’astronaute en apesanteur 🧑‍🚀',
      description:
        'Chaque geste automatique (nouer ses lacets, découper droit, faire du vélo) demande au cerveau dyspraxique de recalculer la trajectoire à chaque milliseconde, comme un pilote de navette spatiale !',
      icon: '🚀',
    },
    whatIsIt: [
      'Difficulté à planifier et automatiser les gestes moteurs fins (boutons, fermeture éclair, compas).',
      'Difficulté à organiser son regard dans une page ou sur un tableau (trouble visuo-spatial).',
      'Tendance à trébucher, se cogner ou renverser des verres malgré une attention sincère.',
      'Lenteur pour préparer son cartable ou ranger ses affaires dans l’espace.',
    ],
    superpowers: [
      'Excellente mémoire auditive : apprend très vite en écoutant.',
      'Vocabulaire riche et passion pour les débats oraux.',
      'Grande persévérance face aux défis manuels.',
    ],
    tipsForSchoolAndHome: [
      'Utiliser des ciseaux à ressort, des crayons ergonomiques ou un ordinateur à l’école.',
      'Mettre des repères de couleur (lignes d’écriture Seyès avec ligne de terre marron, herbe verte, ciel bleu).',
      'Décomposer les consignes complexes en étapes simples numérotées.',
      'Valoriser les évaluations orales.',
    ],
  },
  dysphasie: {
    title: 'La Dysphasie 🗣️',
    subtitle: 'Trouver le bon mot dans la bibliothèque secrète de la parole',
    metaphor: {
      title: 'Le mot de passe magique 🗝️',
      description:
        'La tête est remplie d’idées géniales, d’images et d’histoires, mais la porte de sortie de la voix demande un code secret qui prend un peu de temps à s’ouvrir.',
      icon: '💭',
    },
    whatIsIt: [
      'Trouble structurel de l’acquisition du langage oral (articulation, syntaxe, compréhension).',
      'Difficulté à trouver le mot juste au moment voulu (phénomène du "mot sur le bout de la langue").',
      'Difficulté à organiser les phrases dans le bon ordre chronologique.',
      'Compréhension parfois plus lente des phrases longues ou des doubles sens / métaphores.',
    ],
    superpowers: [
      'Sens prodigieux de l’observation et décodage fin des expressions du visage.',
      'Talents dans les arts visuels, la construction mécanique ou le dessin.',
      'Patience et écoute attentive envers les autres.',
    ],
    tipsForSchoolAndHome: [
      'S’appuyer sur des pictogrammes, photos et dessins pour accompagner la parole.',
      'Faire des phrases courtes avec un débit posé et régulier.',
      'Laisser du temps à l’enfant pour répondre sans lui couper la parole.',
      'Reformuler positivement sans faire répéter sans cesse.',
    ],
  },
  dysorthographie: {
    title: 'La Dysorthographie ✍️',
    subtitle: 'Naviguer dans les pièges de la langue française sans perdre le cap',
    metaphor: {
      title: 'Le puzzle des lettres silencieuses 🧩',
      description:
        'En français, beaucoup de lettres ne se prononcent pas (comme les "e", les "s" ou les "ent") ! Pour un cerveau dysorthographique, c’est comme chercher des pièces invisibles dans un puzzle.',
      icon: '🔍',
    },
    whatIsIt: [
      'Difficulté persistante à mémoriser l’orthographe lexicale des mots courants.',
      'Oubli fréquent des accords en genre et en nombre (singulier/pluriel, féminin/masculin).',
      'Confusion entre homophones (a / à, et / est, on / ont, son / sont).',
      'Découpage erroné des mots ("lavion" pour "l’avion").',
    ],
    superpowers: [
      'Grande richesse d’imagination et inventivité dans les récits.',
      'Capacité à inventer des mots nouveaux et métaphores percutantes.',
      'Esprit logique qui cherche à simplifier ce qui est inutilement compliqué.',
    ],
    tipsForSchoolAndHome: [
      'Utiliser des cartes mentales illustrées et des dessins mnémotechniques.',
      'Valoriser le fond et les idées plutôt que de compter uniquement les fautes.',
      'Recourir aux correcteurs orthographiques et à la synthèse vocale.',
      'Créer son propre répertoire de mots avec des codes couleur.',
    ],
  },
  dysgraphie: {
    title: 'La Dysgraphie ✏️',
    subtitle: 'Détendre la main et donner des ailes à l’écriture',
    metaphor: {
      title: 'Le pinceau qui pèse une tonne 🖌️',
      description:
        'Quand écrire une simple phrase demande autant d’efforts musculaires que de courir un sprint, la main se fatigue vite et a besoin de repos et d’outils adaptés.',
      icon: '💪',
    },
    whatIsIt: [
      'Lenteur excessive et crispation douloureuse lors de l’écriture manuelle.',
      'Tracé irrégulier, lettres mal formées ou de tailles très disparates.',
      'Difficulté à rester sur la ligne d’écriture et à doser la pression sur la feuille.',
      'La concentration est tellement absorbée par le geste graphique que l’enfant ne peut plus penser à l’orthographe.',
    ],
    superpowers: [
      'Facilité d’expression à l’oral quand la contrainte du stylo disparaît.',
      'Aisance rapide avec les outils numériques, claviers et tablettes.',
      'Créativité et intuition.',
    ],
    tipsForSchoolAndHome: [
      'Essayer des manchons en silicone ergonomiques sur les stylos pour détendre la pince.',
      'Fournir des photocopies des cours pour limiter la copie longue au tableau.',
      'Pratiquer des exercices d’échauffement des doigts (piano, pâte à modeler).',
      'Introduire l’ordinateur portable ou la dictée vocale.',
    ],
  },
  tdah: {
    title: 'Le TDAH ⚡',
    subtitle: 'Trouble du Déficit de l’Attention avec ou sans Hyperactivité',
    metaphor: {
      title: 'Le moteur de Formule 1 avec des freins de vélo 🏎️',
      description:
        'Le cerveau tourne à 1000 km/h, prêt à explorer le monde entier ! Le secret est simplement d’apprendre à piloter cette incroyable puissance motrice avec de bons amortisseurs.',
      icon: '💥',
    },
    whatIsIt: [
      'Attention volatile : difficulté à maintenir la concentration sur des tâches jugées monotones.',
      'Besoin irrésistible de bouger les jambes, les mains ou de changer de posture (hyperactivité motrice).',
      'Impulsivité : répondre avant la fin de la question, agir avant de peser les conséquences.',
      'L’Hyperfocus : une capacité extraordinaire à se concentrer pendant des heures sur un sujet passionnant !',
    ],
    superpowers: [
      'Énergie contagieuse, enthousiasme et spontanéité.',
      'Curiosité insatiable pour de multiples centres d’intérêt.',
      'Grande réactivité en situation d’urgence et esprit d’initiative.',
      'Capacité d’hyper-concentration sur les passions.',
    ],
    tipsForSchoolAndHome: [
      'Autoriser les assises dynamiques (galette d’air, élastique de chaise, coussin proprioceptif).',
      'Proposer des pauses motrices actives régulières ("va effacer le tableau").',
      'Utiliser des minuteurs visuels (Time Timer) et découper le travail en tranches de 15 minutes.',
      'Valoriser chaque réussite avec des feedbacks immédiats et chaleureux.',
    ],
  },
  professionnels: {
    title: 'Les Alliés des Super Cerveaux 🤝',
    subtitle: 'Qui sont les spécialistes bienveillants qui t’aident au quotidien ?',
    metaphor: {
      title: 'L’équipe des coachs de super-héros 🛡️',
      description:
        'Comme Batman a Alfred ou les Avengers ont Nick Fury, chaque enfant au profil DYS a une équipe d’experts passionnés pour lui donner les meilleurs gadgets et astuces !',
      icon: '⭐',
    },
    whatIsIt: [
      'L’Orthophoniste : le spécialiste du langage, de la lecture, de la parole et de la logique mathématique.',
      'L’Ergothérapeute : le magicien de l’autonomie, de la coordination motrice fine et de l’ordinateur en classe.',
      'Le Psychomotricien : l’expert du corps dans l’espace, de l’équilibre, du rythme et de la gestion des émotions.',
      'Le Neuropsychologue : le détective des fonctions cognitives (mémoire, attention, vitesse de traitement).',
      'L’AESH (Accompagnant des Élèves en Situation de Handicap) : le copilote bienveillant en classe.',
      'Les Enseignants et les Parents : les premiers supporters indispensables de chaque jour.',
    ],
    superpowers: [
      'Travailler en équipe crée une immense confiance en soi.',
      'Apprendre à connaître ses propres forces pour devenir autonome.',
      'Transformer chaque obstacle en une étape d’apprentissage.',
    ],
    tipsForSchoolAndHome: [
      'Communiquer régulièrement entre l’école, les spécialistes et la maison (cahier de liaison, réunions d’équipe).',
      'Mettre en place des aménagements officiels (PAP, PPRE ou PPS).',
      'Toujours expliquer à l’enfant pourquoi on fait les bilans et célébrer ses progrès !',
    ],
  },
  'super-pouvoirs': {
    title: 'Les Super-pouvoirs des Cerveaux Extraordinaires 🌟',
    subtitle: 'Célébrer la neurodiversité et déployer ses talents uniques',
    metaphor: {
      title: 'Le kaléidoscope des esprits créatifs 💎',
      description:
        'Si tous les arbres étaient identiques, la forêt serait monotone. La diversité des cerveaux est une richesse irremplaçable pour l’humanité !',
      icon: '✨',
    },
    whatIsIt: [
      'La pensée visuo-spatiale : imaginer des objets en 3 dimensions, construire, sculpter, inventer.',
      'L’intuition foudroyante : arriver à la bonne réponse sans savoir expliquer le calcul.',
      'La créativité narrative : imaginer des mondes fantastiques, des histoires palpitantes et des œuvres d’art.',
      'La résilience exemplaire : apprendre dès le plus jeune âge à persévérer et surmonter les difficultés.',
      'L’empathie chaleureuse : une sensibilité accrue aux émotions et aux besoins d’autrui.',
    ],
    superpowers: [
      'Léonard de Vinci, Albert Einstein, Walt Disney, Agatha Christie, Thomas Edison, Steven Spielberg... tous avaient un cerveau différent !',
      'Le monde de demain a besoin d’esprits qui pensent "hors du bocal" (out of the box).',
      'Ta différence est ta signature la plus précieuse.',
    ],
    tipsForSchoolAndHome: [
      'Garder un carnet de ses super-pouvoirs et de ses petites victoires quotidiennes.',
      'Pratiquer des activités où l’on excelle (dessin, théâtre, lego, cuisine, natation, musique).',
      'Se rappeler chaque jour : "Mon cerveau fonctionne différemment, et c’est ma force !"',
    ],
  },
};

export const ThematicPage: React.FC<ThematicPageProps> = ({ pageId, onNavigate }) => {
  if (pageId === 'accueil' || pageId === 'syllabodys') return null;

  const data = THEMATIC_DATA[pageId];

  return (
    <div className="bg-[#f7f9fc] text-[#111111] font-comicneue text-lg sm:text-xl leading-relaxed py-6 sm:py-8 px-4">
      <main className="max-w-[920px] mx-auto bg-white border-2 border-[#222222] rounded-xl shadow-md p-5 sm:p-8 space-y-8">
        {/* Top Navigation button back to Home */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
          <button
            type="button"
            onClick={() => onNavigate('accueil')}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#005a9c] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('syllabodys')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier SyllaboDys</span>
          </button>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#005a9c] m-0 tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-base sm:text-xl text-slate-700 font-bold mt-1">{data.subtitle}</p>
        </div>

        {/* Metaphor Box */}
        <section className="bg-[#eef5fc] border-l-6 border-[#005a9c] p-4 sm:p-6 rounded-r-xl space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-[#005a9c] flex items-center gap-2 m-0">
            <span>{data.metaphor.icon}</span>
            <span>{data.metaphor.title}</span>
          </h2>
          <p className="m-0 text-slate-800">{data.metaphor.description}</p>
        </section>

        {/* If this is the Dyslexia page, show an explicit launcher for SyllaboDys */}
        {data.showSyllaboDysCTA && (
          <section className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-3 border-[#005a9c] rounded-xl p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#005a9c] text-white mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Outil recommandé par les orthophonistes</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#005a9c] m-0">
                  L'Atelier de Lecture Syllabique SyllaboDys 📖
                </h3>
                <p className="text-sm sm:text-base text-slate-800 mt-1 m-0">
                  Colorer les syllabes en alternance (bleu/rouge, pastel, contrastes élevés) permet de
                  soulager immédiatement le décodage et de redonner le sourire à l'élève !
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('syllabodys')}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#005a9c] hover:bg-[#003d6b] text-white font-bold text-base transition-all shadow-md cursor-pointer focus:outline-none focus:ring-3 focus:ring-[#ffbf47]"
              >
                <span>Lancer l'Atelier SyllaboDys</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </section>
        )}

        {/* What is it section */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#222222] border-b-2 border-[#dddddd] pb-1 m-0 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#005a9c]" />
            <span>Mieux comprendre au quotidien</span>
          </h2>
          <ul className="space-y-2 m-0 p-0 list-none">
            {data.whatIsIt.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-[#005a9c] mt-2.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Superpowers */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1b5e20] border-b-2 border-emerald-200 pb-1 m-0 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span>Les super-forces associées ✨</span>
          </h2>
          <ul className="space-y-2 m-0 p-0 list-none">
            {data.superpowers.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-950"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tips for School and Home */}
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#b45309] border-b-2 border-amber-200 pb-1 m-0 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>Astuces pratiques pour l'école et la maison 💡</span>
          </h2>
          <ul className="space-y-2 m-0 p-0 list-none">
            {data.tipsForSchoolAndHome.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-950"
              >
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom Navigation */}
        <div className="pt-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigate('accueil')}
            className="px-4 py-2 rounded-lg border-2 border-[#222222] bg-white hover:bg-slate-100 font-bold text-sm sm:text-base cursor-pointer"
          >
            ← Retour à l'accueil
          </button>
          <button
            type="button"
            onClick={() => onNavigate('syllabodys')}
            className="px-4 py-2 rounded-lg bg-[#005a9c] hover:bg-[#003d6b] text-white font-bold text-sm sm:text-base cursor-pointer flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Tester l'Atelier SyllaboDys</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 bg-white border-t-2 border-[#dddddd] mt-8 text-sm sm:text-base text-slate-700">
        <p className="m-0 font-medium">
          Site éducatif et accessible — Conçu pour l'apprentissage et l'entraide à l'école primaire.
        </p>
      </footer>
    </div>
  );
};
