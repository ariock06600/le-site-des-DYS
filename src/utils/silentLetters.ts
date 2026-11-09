/**
 * French silent letters (lettres muettes) detection module.
 * Used in French reading pedagogy, orthophony, and dyslexia support tools.
 */

export interface SilentLetterAnalysis {
  word: string;
  isSilent: boolean[]; // true if character at index is silent
}

// Words where the final 't' IS pronounced
const EXCEPTION_SOUNDED_FINAL_T = new Set([
  'sept', 'huit', 'net', 'brut', 'dot', 'chut', 'est', 'ouest', 'test',
  'contact', 'exact', 'correct', 'direct', 'strict', 'concept', 'compact',
  'transit', 'déficit', 'zénith', 'granit', 'yacht', 'toast', 'pschitt',
  'soft', 'smart', 'basket', 'ticket', 'cricket', 'pocket', 'sweat',
  'foot', 'shoot', 'boot', 'reset', 'kit', 'jet', 'set', 'hot', 'hit'
]);

// Words where final 's' IS pronounced
const EXCEPTION_SOUNDED_FINAL_S = new Set([
  'bus', 'ours', 'cactus', 'virus', 'mars', 'sens', 'fils', 'as', 'os',
  'iris', 'oasis', 'ananas', 'maïs', 'tennis', 'tournesol', 'vis', 'plus',
  'tous', 'couscous', 'campus', 'hibiscus', 'terminus', 'processus', 'bonus',
  'tonus', 'blocus', 'fœtus', 'radius', 'pelvis', 'lapis', 'pastis', 'cannabis',
  'chorus', 'status', 'stratus', 'cumulus', 'laps', 'suspens', 'consensus'
]);

// Words where final 'c' IS silent
const SILENT_FINAL_C_WORDS = new Set([
  'blanc', 'blancs', 'franc', 'francs', 'banc', 'bancs', 'flanc', 'flancs',
  'porc', 'porcs', 'estomac', 'estomacs', 'tabac', 'tabacs', 'caoutchouc',
  'caoutchoucs', 'tronc', 'troncs', 'jonc', 'joncs', 'escroc', 'escrocs', 'clerc', 'clercs'
]);

// Non-verbs ending in 'ent' where 'en' is a nasal vowel [ɑ̃] and ONLY the final 't' is silent (not the entire 'ent')
const NON_VERB_ENT_WORDS = new Set([
  'vent', 'vents', 'dent', 'dents', 'lent', 'lents', 'cent', 'cents',
  'argent', 'moment', 'moments', 'content', 'contents', 'souvent', 'comment',
  'serpent', 'serpents', 'présent', 'présents', 'continent', 'continents',
  'accident', 'accidents', 'élément', 'éléments', 'bâtiment', 'bâtiments',
  'document', 'documents', 'sentiment', 'sentiments', 'instrument', 'instruments',
  'appartement', 'appartements', 'mouvement', 'mouvements', 'talent', 'talents',
  'patient', 'patients', 'client', 'clients', 'parent', 'parents', 'torrent', 'torrents',
  'couvent', 'couvents', 'occident', 'orient', 'agent', 'agents', 'urgent', 'urgents',
  'récent', 'récents', 'fréquent', 'fréquents', 'évident', 'évidents',
  'excellent', 'excellents', 'différent', 'différents', 'intelligent', 'intelligents',
  'polyvalent', 'polyvalents', 'sergent', 'sergents', 'adhérent', 'adhérents',
  'incident', 'incidents', 'précédent', 'précédents', 'vêtement', 'vêtements',
  'événement', 'événements', 'changement', 'changements', 'développement', 'développements',
  'gouvernement', 'gouvernements', 'compliment', 'compliments', 'rudiment', 'rudiments'
]);

/**
 * Identifies indices of silent letters in a French word.
 */
export function identifySilentLetterIndices(rawWord: string): boolean[] {
  const len = rawWord.length;
  const isSilent: boolean[] = new Array(len).fill(false);
  if (len === 0) return isSilent;

  const lower = rawWord.toLowerCase();

  // 1. Initial silent 'h' (e.g. homme, heure, hiver, hirondelle, histoire, herbe, etc.)
  if (lower.startsWith('h') && len > 1) {
    // In French, all initial 'h' are mute in terms of pronunciation
    isSilent[0] = true;
  }

  // 2. Internal silent 'h' in 'th', 'rh', or mute positions (e.g. thé, rhume, souhaiter, cahier)
  for (let i = 1; i < len; i++) {
    if (lower[i] === 'h') {
      const prev = lower[i - 1];
      // In 'th' and 'rh', the 'h' is silent (only t or r is pronounced)
      if (prev === 't' || prev === 'r') {
        isSilent[i] = true;
      } else if (prev !== 'c' && prev !== 'p' && prev !== 's') {
        // 'ch', 'ph', 'sh' are digraphs where h participates; otherwise h is mute (e.g. cahier, souhaiter, trahir, bonheur)
        isSilent[i] = true;
      }
    }
  }

  // 3. Internal silent 'p' in specific words: sept, compter, sculpter, dompter, baptême, corps, temps
  if (lower.includes('sept') || lower.includes('comp') || lower.includes('sculp') || lower.includes('domp') || lower.includes('bapt')) {
    for (let i = 0; i < len; i++) {
      if (lower[i] === 'p') {
        if (
          lower.startsWith('sept', i - 2) ||
          lower.startsWith('comp', i - 3) ||
          lower.startsWith('sculp', i - 4) ||
          lower.startsWith('domp', i - 3) ||
          lower.startsWith('bapt', i - 2)
        ) {
          isSilent[i] = true;
        }
      }
    }
  }

  // 4. Special internal silent consonants: 'p' in corps, temps, printemps
  if (lower === 'corps' || lower === 'temps' || lower === 'printemps') {
    const pIdx = lower.lastIndexOf('p');
    if (pIdx >= 0) isSilent[pIdx] = true;
  }

  // 5. Special internal silent 'g' in doigt, doigts, vingt, vingts
  if (lower.startsWith('doigt') || lower.startsWith('vingt')) {
    const gIdx = lower.indexOf('g');
    if (gIdx >= 0) isSilent[gIdx] = true;
  }

  // 6. Special internal silent 'd' in poids
  if (lower === 'poids') {
    const dIdx = lower.indexOf('d');
    if (dIdx >= 0) isSilent[dIdx] = true;
  }

  // 7. Verbal ending '-ent' (3rd person plural) vs Non-verb ending '-ent'
  // e.g. volent, tournent, regardent, possèdent, annoncent, mangent, chantent, etc.
  if (lower.endsWith('ent') && len > 3) {
    // If it's a known non-verb ending in 'ent' or ends with '-ment' (adverbs)
    if (NON_VERB_ENT_WORDS.has(lower) || lower.endsWith('ment')) {
      // Only the final 't' is silent! 'en' is pronounced as nasal vowel [ɑ̃]
      isSilent[len - 1] = true;
    } else {
      // 3rd person plural verb ending: 'e', 'n', 't' are ALL silent!
      isSilent[len - 3] = true;
      isSilent[len - 2] = true;
      isSilent[len - 1] = true;
      return isSilent;
    }
  } else if (lower.endsWith('ents') && len > 4) {
    if (NON_VERB_ENT_WORDS.has(lower) || lower.endsWith('ments')) {
      // 'ts' are silent
      isSilent[len - 2] = true;
      isSilent[len - 1] = true;
    } else {
      // Verb ending with s
      isSilent[len - 4] = true;
      isSilent[len - 3] = true;
      isSilent[len - 2] = true;
      isSilent[len - 1] = true;
      return isSilent;
    }
  }

  // 8. Ending '-es' in polysyllabic words (e.g. petites, branches, baguettes, chaudes, planètes)
  if (lower.endsWith('es') && len > 3) {
    // Monosyllables like 'les', 'des', 'mes', 'tes', 'ses', 'ces' have pronounced [e], with silent 's'
    const monosyllables = new Set(['les', 'des', 'mes', 'tes', 'ses', 'ces']);
    if (monosyllables.has(lower)) {
      isSilent[len - 1] = true;
    } else {
      // Polysyllabic plural: both 'e' and 's' are silent
      isSilent[len - 2] = true;
      isSilent[len - 1] = true;
      return isSilent;
    }
  }

  // 9. Final silent 'e' in words of length > 2
  // Monosyllables where 'e' is sounded: le, de, me, te, se, ce, ne, que
  const soundedSingleEWords = new Set(['le', 'de', 'me', 'te', 'se', 'ce', 'ne', 'que', 'je']);
  if (lower.endsWith('e') && !soundedSingleEWords.has(lower)) {
    // If word ends with an unaccented 'e':
    // E.g. petite, chêne, mousse, promenade, agile, solide, dorée, pluie, vue, etc.
    // In French, unaccented final 'e' after a consonant or vowel is mute.
    if (len > 2 && !lower.endsWith('ée') && !lower.endsWith('ie') && !lower.endsWith('ue') && !lower.endsWith('oe')) {
      isSilent[len - 1] = true;
    } else if (lower.endsWith('ée') || lower.endsWith('ie') || lower.endsWith('ue')) {
      // In dorée, pluie, continue, the last 'e' is silent
      isSilent[len - 1] = true;
    }
  }

  // 10. Final silent consonants: s, x, t, d, p, g, z, c
  const lastChar = lower[len - 1];
  const secondLastChar = len > 1 ? lower[len - 2] : '';

  // Final 's'
  if (lastChar === 's' && !isSilent[len - 1]) {
    if (!EXCEPTION_SOUNDED_FINAL_S.has(lower)) {
      isSilent[len - 1] = true;
      // If preceded by silent 'd', 't', 'p', 'g', 'c' (e.g. grands, petits, loups, rangs, bancs)
      if (secondLastChar === 'd' || secondLastChar === 't' || secondLastChar === 'p' || secondLastChar === 'g' || secondLastChar === 'c') {
        isSilent[len - 2] = true;
      }
    }
  }

  // Final 'x' (roux, deux, yeux, mieux, oiseaux, prix, etc.)
  if (lastChar === 'x' && !isSilent[len - 1]) {
    const soundedX = new Set(['six', 'dix', 'index', 'box', 'lynx', 'fix', 'larynx', 'thorax']);
    if (!soundedX.has(lower)) {
      isSilent[len - 1] = true;
    }
  }

  // Final 't' (petit, sort, forêt, sourit, vent, etc.)
  if (lastChar === 't' && !isSilent[len - 1]) {
    if (!EXCEPTION_SOUNDED_FINAL_T.has(lower)) {
      isSilent[len - 1] = true;
      // Preceded by 'g' in doigt, vingt
      if (secondLastChar === 'g') {
        isSilent[len - 2] = true;
      }
      // Preceded by 'p' in prompt, sept
      if (secondLastChar === 'p') {
        isSilent[len - 2] = true;
      }
    }
  }

  // Final 'd' (renard, grand, pied, froid, chaud, etc.)
  if (lastChar === 'd' && !isSilent[len - 1]) {
    const soundedD = new Set(['sud', 'david', 'week-end', 'djihad', 'ciel-bleu']);
    if (!soundedD.has(lower)) {
      isSilent[len - 1] = true;
    }
  }

  // Final 'p' (trop, beaucoup, loup, drap, sirop, galop, champ, camp, coup)
  if (lastChar === 'p' && !isSilent[len - 1]) {
    const soundedP = new Set(['cap', 'slip', 'bip', 'cep', 'clip', 'stop', 'pop']);
    if (!soundedP.has(lower)) {
      isSilent[len - 1] = true;
    }
  }

  // Final 'g' (long, sang, poing, rang, bourg)
  if (lastChar === 'g' && !isSilent[len - 1]) {
    const soundedG = new Set(['grog', 'zigzag', 'iceberg', 'tag', 'gag']);
    if (!soundedG.has(lower)) {
      isSilent[len - 1] = true;
    }
  }

  // Final 'z' in '-ez' endings (mangez, allez, nez, chez, assez)
  if (lastChar === 'z' && !isSilent[len - 1]) {
    const soundedZ = new Set(['gaz', 'jazz', 'quartz', 'merguez', 'albatros']);
    if (secondLastChar === 'e' && !soundedZ.has(lower)) {
      isSilent[len - 1] = true;
    }
  }

  // Final 'c' in specific silent words (blanc, franc, banc, porc, estomac, tabac, tronc)
  if (lastChar === 'c' && !isSilent[len - 1]) {
    if (SILENT_FINAL_C_WORDS.has(lower)) {
      isSilent[len - 1] = true;
    }
  }

  return isSilent;
}

export interface CharPart {
  text: string;
  isSilent: boolean;
}

/**
 * Splits a syllable string into sub-parts where silent letters are isolated.
 * Uses the global character positions of the syllable inside its word.
 */
export function buildSyllableCharParts(
  sylText: string,
  startCharIndexInWord: number,
  silentFlagsForWord: boolean[]
): CharPart[] {
  if (!sylText) return [];

  const parts: CharPart[] = [];
  let currentText = '';
  let currentIsSilent: boolean | null = null;

  for (let i = 0; i < sylText.length; i++) {
    const char = sylText[i];
    const charIndexInWord = startCharIndexInWord + i;
    const isCharSilent = Boolean(silentFlagsForWord[charIndexInWord]);

    if (currentIsSilent === null) {
      currentText = char;
      currentIsSilent = isCharSilent;
    } else if (currentIsSilent === isCharSilent) {
      currentText += char;
    } else {
      parts.push({ text: currentText, isSilent: currentIsSilent });
      currentText = char;
      currentIsSilent = isCharSilent;
    }
  }

  if (currentText.length > 0 && currentIsSilent !== null) {
    parts.push({ text: currentText, isSilent: currentIsSilent });
  }

  return parts;
}
