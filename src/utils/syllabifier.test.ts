import test from 'node:test';
import assert from 'node:assert/strict';
import {
  splitFrenchWordIntoSyllables,
  tokenizeAndSyllabifyText,
  computeReadingStats,
  groupTokensIntoLines,
} from './syllabifier.ts';
import { extractExactVisualLinesFromDOM } from './pdfExport.ts';

test('French syllabifier splits basic V-CV words accurately', () => {
  assert.deepEqual(splitFrenchWordIntoSyllables('camarade'), ['ca', 'ma', 'ra', 'de']);
  assert.deepEqual(splitFrenchWordIntoSyllables('école'), ['é', 'co', 'le']);
  assert.deepEqual(splitFrenchWordIntoSyllables('matin'), ['ma', 'tin']);
  assert.deepEqual(splitFrenchWordIntoSyllables('lapin'), ['la', 'pin']);
});

test('French syllabifier splits double consonants and VC-CV clusters', () => {
  assert.deepEqual(splitFrenchWordIntoSyllables('bonjour'), ['bon', 'jour']);
  assert.deepEqual(splitFrenchWordIntoSyllables('belle'), ['bel', 'le']);
  assert.deepEqual(splitFrenchWordIntoSyllables('pomme'), ['pom', 'me']);
  assert.deepEqual(splitFrenchWordIntoSyllables('partir'), ['par', 'tir']);
  assert.deepEqual(splitFrenchWordIntoSyllables('escargot'), ['es', 'car', 'got']);
  assert.deepEqual(splitFrenchWordIntoSyllables('noisette'), ['noi', 'set', 'te']);
  assert.deepEqual(splitFrenchWordIntoSyllables('terrier'), ['ter', 'rier']);
});

test('French syllabifier preserves indivisible consonant clusters and vowel endings', () => {
  assert.deepEqual(splitFrenchWordIntoSyllables('tableau'), ['ta', 'bleau']);
  assert.deepEqual(splitFrenchWordIntoSyllables('abricot'), ['a', 'bri', 'cot']);
  assert.deepEqual(splitFrenchWordIntoSyllables('éléphant'), ['é', 'lé', 'phant']);
  assert.deepEqual(splitFrenchWordIntoSyllables('apprendre'), ['ap', 'pren', 'dre']);
  assert.deepEqual(splitFrenchWordIntoSyllables('montagne'), ['mon', 'ta', 'gne']);
  assert.deepEqual(splitFrenchWordIntoSyllables('dorée'), ['do', 'rée']);
  assert.deepEqual(splitFrenchWordIntoSyllables('continue'), ['con', 'ti', 'nue']);
});

test('tokenizeAndSyllabifyText supports syllable, word, and sentence modes', () => {
  const text = 'Le chat dort. Il rêve\nSous l’arbre.';
  const bySyllable = tokenizeAndSyllabifyText(text, 3, false, 'syllable');
  const stats = computeReadingStats(bySyllable);
  assert.equal(stats.wordCount, 7);

  // Word mode: each word gets a single consistent color index cycling 0, 1
  const byWord = tokenizeAndSyllabifyText('Petit renard agile', 2, false, 'word');
  const wordTokens = byWord.filter((t) => t.type === 'word');
  assert.deepEqual(
    wordTokens[0].syllables.map((s) => s.defaultColorIndex),
    [0, 0]
  );
  assert.deepEqual(
    wordTokens[1].syllables.map((s) => s.defaultColorIndex),
    [1, 1]
  );

  // Sentence mode: first sentence words get index 0, second sentence words get index 1
  const bySentence = tokenizeAndSyllabifyText('Bonjour matin. Bonsoir nuit.', 2, false, 'sentence');
  const sentenceWords = bySentence.filter((t) => t.type === 'word');
  assert.equal(sentenceWords[0].syllables[0].defaultColorIndex, 0);
  assert.equal(sentenceWords[1].syllables[0].defaultColorIndex, 0);
  assert.equal(sentenceWords[2].syllables[0].defaultColorIndex, 1);
  assert.equal(sentenceWords[3].syllables[0].defaultColorIndex, 1);
});

test('groupTokensIntoLines counts words per line and cumulative counts correctly', () => {
  const text = 'Le petit chat dort.\nIl rêve de souris.\nAu réveil il saute.';
  const tokens = tokenizeAndSyllabifyText(text, 2, false, 'syllable');
  const lines = groupTokensIntoLines(tokens);

  assert.equal(lines.length, 3);
  assert.equal(lines[0].wordCount, 4); // Le petit chat dort
  assert.equal(lines[0].cumulativeWordCount, 4);

  assert.equal(lines[1].wordCount, 4); // Il rêve de souris
  assert.equal(lines[1].cumulativeWordCount, 8);

  assert.equal(lines[2].wordCount, 4); // Au réveil il saute
  assert.equal(lines[2].cumulativeWordCount, 12);
});

test('silent letters are detected in syllables', () => {
  const tokens = tokenizeAndSyllabifyText('petit renard volent', 2, false, 'syllable');
  const petit = tokens[0].syllables; // pe - tit
  // 't' at the end of petit is silent
  const lastSylPetit = petit[petit.length - 1];
  const silentPartPetit = lastSylPetit.parts.find((p) => p.isSilent);
  assert.ok(silentPartPetit);
  assert.equal(silentPartPetit.text, 't');

  // 'd' at the end of renard is silent
  const renard = tokens[2].syllables; // re - nard
  const lastSylRenard = renard[renard.length - 1];
  const silentPartRenard = lastSylRenard.parts.find((p) => p.isSilent);
  assert.ok(silentPartRenard);
  assert.equal(silentPartRenard.text, 'd');

  // 3rd person plural verb ending '-ent' in volent is silent
  const volent = tokens[4].syllables; // vo - lent
  const lastSylVolent = volent[volent.length - 1];
  const silentPartVolent = lastSylVolent.parts.find((p) => p.isSilent);
  assert.ok(silentPartVolent);
  assert.equal(silentPartVolent.text, 'ent');
});

test('tokenizeAndSyllabifyText respects manual syllable and silent letter overrides', () => {
  const text = 'Ce petit renard.';
  // Override syllables of renard (wordIndex 2) to 3 syllables ['re', 'nar', 'd']
  // Override silent letter of petit (wordIndex 1) so no letters are silent
  const overrides = {
    wordIndexSyllables: {
      2: ['re', 'nar', 'd'],
    },
    wordIndexSilentLetters: {
      1: [false, false, false, false, false], // 'petit' with NO silent letter
    },
  };

  const tokens = tokenizeAndSyllabifyText(text, 2, false, 'syllable', overrides);
  const petitToken = tokens.find((t) => t.raw === 'petit')!;
  assert.equal(petitToken.isCustomSilentLetters, true);
  // In petit, 't' should now NOT be silent
  const petitParts = petitToken.syllables.flatMap((s) => s.parts);
  assert.equal(petitParts.some((p) => p.isSilent), false);

  const renardToken = tokens.find((t) => t.raw === 'renard')!;
  assert.equal(renardToken.isCustomSyllables, true);
  assert.deepEqual(
    renardToken.syllables.map((s) => s.text),
    ['re', 'nar', 'd']
  );
});

test('extractExactVisualLinesFromDOM partitions tokens according to visual line positions', () => {
  const text = 'Ce matin, le petit renard roux sort doucement de son terrier.';
  const tokens = tokenizeAndSyllabifyText(text, 2, false, 'syllable');

  // Words 0..7 on line 0 (top: 10px)
  // Words 8..10 on line 1 (top: 58px)
  const mockNodes: any[] = [];
  tokens.filter((t) => t.type === 'word').forEach((tok) => {
    const isLine1 = (tok.wordIndex ?? 0) >= 8;
    mockNodes.push({
      getAttribute: (attr: string) => (attr === 'data-word-index' ? String(tok.wordIndex) : null),
      getBoundingClientRect: () => ({ top: isLine1 ? 58 : 10, bottom: isLine1 ? 98 : 50, width: 40, height: 40 }),
    });
  });

  const mockContainer: any = {
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 800, height: 400 }),
    querySelectorAll: () => mockNodes,
  };

  const origWindow = globalThis.window;
  (globalThis as any).window = {
    getComputedStyle: () => ({ fontSize: '24px' }),
  };

  const exactLines = extractExactVisualLinesFromDOM(mockContainer, tokens);

  assert.equal(exactLines.length, 2);
  assert.equal(exactLines[0].wordCount, 8); // Ce matin, le petit renard roux sort doucement
  assert.equal(exactLines[0].cumulativeWordCount, 8);
  assert.equal(exactLines[1].wordCount, 3); // de son terrier.
  assert.equal(exactLines[1].cumulativeWordCount, 11);

  (globalThis as any).window = origWindow;
});

