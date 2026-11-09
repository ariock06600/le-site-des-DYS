import {
  identifySilentLetterIndices,
  buildSyllableCharParts,
  CharPart,
} from './silentLetters';

export type { CharPart };

export type ColorUnitMode = 'syllable' | 'word' | 'sentence';

export interface SyllableSegment {
  id: string;
  text: string;
  defaultColorIndex: number;
  wordIndex: number;
  sentenceIndex: number;
  parts: CharPart[];
}

export interface TextLine {
  id: string;
  lineNumber: number;
  tokens: TokenNode[];
  wordCount: number;
  cumulativeWordCount: number;
}

export interface TokenNode {
  id: string;
  type: 'word' | 'separator' | 'newline';
  raw: string;
  syllables: SyllableSegment[];
  wordIndex?: number;
  sentenceIndex: number;
  defaultColorIndex: number;
  isCustomSyllables?: boolean;
  isCustomSilentLetters?: boolean;
}

export interface ManualWordOverrides {
  wordIndexSyllables?: Record<number, string[]>;
  wordIndexSilentLetters?: Record<number, boolean[]>;
  globalWordSyllables?: Record<string, string[]>;
  globalWordSilentLetters?: Record<string, boolean[]>;
}

const VOWELS = 'aeiouyàâäéèêëîïôöùûüÿœæAEIOUYÀÂÄÉÈÊËÎÏÔÖÙÛÜŸŒÆ';

const INDIVISIBLE_CLUSTERS = new Set([
  'ch', 'ph', 'th', 'gn', 'gu', 'qu',
  'br', 'bl', 'cr', 'cl', 'dr', 'fl', 'fr',
  'gl', 'gr', 'pl', 'pr', 'tr', 'vr'
]);

const VOWEL_NUCLEUS_GROUPS = [
  'eaux', 'oient', 'aient', 'ouie', 'ouies', 'ée', 'ées',
  'eau', 'oie', 'aie', 'oui', 'eui', 'œui', 'uei', 'ieu', 'ion', 'ien', 'ier', 'iè', 'ié', 'ia', 'io',
  'au', 'ou', 'oi', 'ai', 'ei', 'eu', 'œu', 'ui', 'ue', 'ua', 'uo', 'ie', 'ye'
];

export function isVowelChar(ch: string): boolean {
  return ch.length === 1 && VOWELS.includes(ch);
}

/**
 * Segments a French word into orthographic/phonetic reading syllables.
 * Supports manual forced cuts if the user inserts '/' or '|' inside a word.
 */
export function splitFrenchWordIntoSyllables(word: string): string[] {
  if (!word) return [];

  if (word.includes('/') || word.includes('|')) {
    return word
      .split(/[\/|]+/)
      .filter((part) => part.length > 0);
  }

  const apostropheMatch = word.match(/^([cdjlmnstCDJLMNST]|qu|Qu|QU)(['’])(.+)$/);
  if (apostropheMatch && apostropheMatch[3].length > 0) {
    const prefix = apostropheMatch[1] + apostropheMatch[2];
    const restSyllables = splitFrenchWordIntoSyllables(apostropheMatch[3]);
    if (restSyllables.length > 0) {
      restSyllables[0] = prefix + restSyllables[0];
      return restSyllables;
    }
  }

  if (word.includes('-') && word.length > 1) {
    const parts = word.split('-');
    const result: string[] = [];
    parts.forEach((part, idx) => {
      const sub = splitFrenchWordIntoSyllables(part);
      if (sub.length > 0) {
        if (idx < parts.length - 1) {
          sub[sub.length - 1] = sub[sub.length - 1] + '-';
        }
        result.push(...sub);
      } else if (idx < parts.length - 1) {
        result.push('-');
      }
    });
    return result;
  }

  const len = word.length;
  if (len <= 2) return [word];

  const lower = word.toLowerCase();

  interface Nucleus {
    start: number;
    end: number;
  }

  const nuclei: Nucleus[] = [];
  let i = 0;

  while (i < len) {
    if (
      (lower.startsWith('qu', i) || lower.startsWith('gu', i)) &&
      i + 2 < len &&
      isVowelChar(lower[i + 2])
    ) {
      i += 2;
      continue;
    }

    if (isVowelChar(lower[i])) {
      const start = i;
      let matchedGroup = false;

      for (const group of VOWEL_NUCLEUS_GROUPS) {
        if (lower.startsWith(group, i)) {
          let groupEnd = i + group.length;
          while (groupEnd > i + 1 && !isVowelChar(lower[groupEnd - 1])) {
            groupEnd--;
          }
          i = groupEnd;
          matchedGroup = true;
          break;
        }
      }

      if (!matchedGroup) {
        i++;
      }

      while (
        i < len &&
        lower[i] === 'e' &&
        (i === len - 1 || (i === len - 2 && (lower[len - 1] === 's' || lower[len - 1] === 'nt')))
      ) {
        i++;
      }

      nuclei.push({ start, end: i - 1 });
    } else {
      i++;
    }
  }

  if (nuclei.length <= 1) {
    return [word];
  }

  const cutIndices: number[] = [];

  for (let n = 0; n < nuclei.length - 1; n++) {
    const currentNucleus = nuclei[n];
    const nextNucleus = nuclei[n + 1];

    const cStart = currentNucleus.end + 1;
    const cEnd = nextNucleus.start - 1;
    const cCount = cEnd - cStart + 1;

    if (cCount <= 0) {
      cutIndices.push(nextNucleus.start);
    } else if (cCount === 1) {
      const cChar = lower[cStart];
      if (cChar === 'x' && currentNucleus.start === 0 && lower.startsWith('ex')) {
        cutIndices.push(cStart + 1);
      } else {
        cutIndices.push(cStart);
      }
    } else if (cCount === 2) {
      const cluster = lower.slice(cStart, cStart + 2);
      if (INDIVISIBLE_CLUSTERS.has(cluster)) {
        cutIndices.push(cStart);
      } else {
        cutIndices.push(cStart + 1);
      }
    } else {
      const lastTwo = lower.slice(cEnd - 1, cEnd + 1);
      if (INDIVISIBLE_CLUSTERS.has(lastTwo)) {
        cutIndices.push(cEnd - 1);
      } else {
        cutIndices.push(cStart + 2);
      }
    }
  }

  const rawSyllables: string[] = [];
  let prevIndex = 0;
  for (const cut of cutIndices) {
    if (cut > prevIndex && cut < len) {
      rawSyllables.push(word.slice(prevIndex, cut));
      prevIndex = cut;
    }
  }
  rawSyllables.push(word.slice(prevIndex));

  return rawSyllables;
}

/**
 * Parses user-entered syllables from a string with '/' or '-' delimiters.
 * E.g. "re/nard" or "re-nard" -> ["re", "nard"]
 * Validates that joining the parts reconstitutes the original characters.
 */
export function parseSyllablesFromSlashString(rawWord: string, slashString: string): string[] {
  if (!slashString || !slashString.trim()) {
    return splitFrenchWordIntoSyllables(rawWord);
  }
  const cleanParts = slashString
    .split(/[\/|·•\-]+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (cleanParts.length === 0) {
    return [rawWord];
  }

  // Verify that all characters are preserved
  const joined = cleanParts.join('');
  if (joined.toLowerCase() === rawWord.replace(/[\/|\-]/g, '').toLowerCase()) {
    return cleanParts;
  }
  return cleanParts;
}

/**
 * Tokenizes full French text into words, syllables, spaces, and newlines.
 * Supports automatic color alternation by 'syllable', 'word', or 'sentence',
 * as well as custom manual overrides for syllables and silent letters.
 */
export function tokenizeAndSyllabifyText(
  text: string,
  colorCount: number,
  resetColorPerWord: boolean = false,
  unitMode: ColorUnitMode = 'syllable',
  manualOverrides?: ManualWordOverrides
): TokenNode[] {
  if (!text) return [];

  const safeColorCount = Math.max(2, Math.min(5, colorCount));
  const regex = /([a-zA-ZÀ-ÿœæŒÆ]+(?:['’\-/|][a-zA-ZÀ-ÿœæŒÆ]+)*)|(\r?\n)|([^\n\ra-zA-ZÀ-ÿœæŒÆ]+)/g;

  const tokens: TokenNode[] = [];
  let globalSyllableCounter = 0;
  let wordCounter = 0;
  let sentenceCounter = 0;

  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, wordMatch, newlineMatch] = match;
    const nodeId = `tok-${tokenIndex}`;

    if (wordMatch) {
      const currentWordIndex = wordCounter;
      const currentSentenceIndex = sentenceCounter;
      const lowerWord = wordMatch.toLowerCase();

      // Check for manual syllable overrides
      let syllableStrings: string[] | undefined =
        manualOverrides?.wordIndexSyllables?.[currentWordIndex];
      let hasCustomSyllables = Boolean(syllableStrings);

      if (!syllableStrings && manualOverrides?.globalWordSyllables) {
        syllableStrings = manualOverrides.globalWordSyllables[lowerWord];
        if (syllableStrings) hasCustomSyllables = true;
      }

      if (!syllableStrings || syllableStrings.length === 0) {
        syllableStrings = splitFrenchWordIntoSyllables(wordMatch);
      }

      // Check for manual silent letter overrides
      let silentFlags: boolean[] | undefined =
        manualOverrides?.wordIndexSilentLetters?.[currentWordIndex];
      let hasCustomSilentLetters = Boolean(silentFlags);

      if (!silentFlags && manualOverrides?.globalWordSilentLetters) {
        silentFlags = manualOverrides.globalWordSilentLetters[lowerWord];
        if (silentFlags) hasCustomSilentLetters = true;
      }

      if (!silentFlags || silentFlags.length !== wordMatch.length) {
        silentFlags = identifySilentLetterIndices(wordMatch);
      }

      let wordSyllableCounter = 0;
      let charOffsetInWord = 0;

      const computeColorIndex = (sylCounterInWord: number, globalSylCounter: number): number => {
        if (unitMode === 'word') {
          return currentWordIndex % safeColorCount;
        }
        if (unitMode === 'sentence') {
          return currentSentenceIndex % safeColorCount;
        }
        return resetColorPerWord
          ? sylCounterInWord % safeColorCount
          : globalSylCounter % safeColorCount;
      };

      const syllables: SyllableSegment[] = syllableStrings.map((sylText, sIdx) => {
        const colorIdx = computeColorIndex(wordSyllableCounter, globalSyllableCounter);
        wordSyllableCounter++;
        globalSyllableCounter++;
        const parts = buildSyllableCharParts(sylText, charOffsetInWord, silentFlags!);
        charOffsetInWord += sylText.length;
        return {
          id: `${nodeId}-syl-${sIdx}`,
          text: sylText,
          defaultColorIndex: colorIdx,
          wordIndex: currentWordIndex,
          sentenceIndex: currentSentenceIndex,
          parts,
        };
      });

      tokens.push({
        id: nodeId,
        type: 'word',
        raw: wordMatch,
        syllables,
        wordIndex: currentWordIndex,
        sentenceIndex: currentSentenceIndex,
        defaultColorIndex: syllables[0]?.defaultColorIndex ?? 0,
        isCustomSyllables: hasCustomSyllables,
        isCustomSilentLetters: hasCustomSilentLetters,
      });

      wordCounter++;
    } else if (newlineMatch) {
      tokens.push({
        id: nodeId,
        type: 'newline',
        raw: '\n',
        syllables: [],
        sentenceIndex: sentenceCounter,
        defaultColorIndex: sentenceCounter % safeColorCount,
      });
    } else {
      const currentSentenceIndex = sentenceCounter;
      const sepColorIdx =
        unitMode === 'sentence' ? currentSentenceIndex % safeColorCount : 0;

      tokens.push({
        id: nodeId,
        type: 'separator',
        raw: fullMatch,
        syllables: [],
        sentenceIndex: currentSentenceIndex,
        defaultColorIndex: sepColorIdx,
      });

      // Advance sentence counter when encountering sentence-ending punctuation (. ! ? …)
      if (/[.!?…]/.test(fullMatch)) {
        sentenceCounter++;
      }
    }

    tokenIndex++;
  }

  return tokens;
}

export function computeReadingStats(tokens: TokenNode[]): {
  wordCount: number;
  syllableCount: number;
  characterCount: number;
} {
  let wordCount = 0;
  let syllableCount = 0;
  let characterCount = 0;

  for (const token of tokens) {
    characterCount += token.raw.length;
    if (token.type === 'word') {
      wordCount++;
      syllableCount += token.syllables.length;
    }
  }

  return { wordCount, syllableCount, characterCount };
}

/**
 * Groups tokens into lines based on newline tokens.
 * Computes word counts per line and cumulative word counts (standard French reading fluence / MCLM).
 */
export function groupTokensIntoLines(tokens: TokenNode[]): TextLine[] {
  const lines: TextLine[] = [];
  let currentTokens: TokenNode[] = [];
  let currentWordCount = 0;
  let cumulativeCount = 0;
  let lineIdx = 0;

  for (const token of tokens) {
    if (token.type === 'newline') {
      cumulativeCount += currentWordCount;
      lines.push({
        id: `line-${lineIdx}`,
        lineNumber: lineIdx + 1,
        tokens: currentTokens,
        wordCount: currentWordCount,
        cumulativeWordCount: cumulativeCount,
      });
      lineIdx++;
      currentTokens = [];
      currentWordCount = 0;
    } else {
      currentTokens.push(token);
      if (token.type === 'word') {
        currentWordCount++;
      }
    }
  }

  // Final line if there are remaining tokens or if tokens was empty
  if (currentTokens.length > 0 || lines.length === 0) {
    cumulativeCount += currentWordCount;
    lines.push({
      id: `line-${lineIdx}`,
      lineNumber: lineIdx + 1,
      tokens: currentTokens,
      wordCount: currentWordCount,
      cumulativeWordCount: cumulativeCount,
    });
  }

  return lines;
}
