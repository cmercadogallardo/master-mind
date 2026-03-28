const { COLORS, CODE_LENGTH, MAX_ATTEMPTS, generateSecretCode, validateGuess, calculateHints, isWin } = require('./game-logic');

describe('game-logic constants', () => {
  test('COLORS has 6 entries', () => {
    expect(COLORS).toHaveLength(6);
  });

  test('CODE_LENGTH is 4', () => {
    expect(CODE_LENGTH).toBe(4);
  });

  test('MAX_ATTEMPTS is 10', () => {
    expect(MAX_ATTEMPTS).toBe(10);
  });
});

describe('generateSecretCode', () => {
  test('returns an array of length CODE_LENGTH', () => {
    const code = generateSecretCode();
    expect(code).toHaveLength(CODE_LENGTH);
  });

  test('all elements are valid colors', () => {
    const code = generateSecretCode();
    code.forEach(color => expect(COLORS).toContain(color));
  });

  test('generates different codes on multiple calls (probabilistic)', () => {
    const codes = new Set(Array.from({ length: 20 }, () => generateSecretCode().join(',')));
    expect(codes.size).toBeGreaterThan(1);
  });
});

describe('validateGuess', () => {
  test('accepts a valid guess with 4 known colors', () => {
    expect(validateGuess(['red', 'blue', 'green', 'yellow'])).toBe(true);
  });

  test('rejects a guess with fewer than 4 colors', () => {
    expect(validateGuess(['red', 'blue', 'green'])).toBe(false);
  });

  test('rejects a guess with more than 4 colors', () => {
    expect(validateGuess(['red', 'blue', 'green', 'yellow', 'purple'])).toBe(false);
  });

  test('rejects a guess with an unknown color', () => {
    expect(validateGuess(['red', 'blue', 'green', 'pink'])).toBe(false);
  });

  test('rejects null inputs', () => {
    expect(validateGuess(null)).toBe(false);
  });

  test('rejects non-array inputs', () => {
    expect(validateGuess('redbluegreenyellow')).toBe(false);
  });

  test('rejects guesses containing null slots', () => {
    expect(validateGuess(['red', 'blue', null, 'yellow'])).toBe(false);
  });
});

describe('calculateHints', () => {
  test('all correct returns 4 hits, 0 coincidences', () => {
    const code = ['red', 'blue', 'green', 'yellow'];
    expect(calculateHints(code, code)).toEqual({ hits: 4, coincidences: 0 });
  });

  test('all wrong color returns 0 hits, 0 coincidences', () => {
    expect(calculateHints(
      ['red', 'red', 'red', 'red'],
      ['blue', 'blue', 'blue', 'blue']
    )).toEqual({ hits: 0, coincidences: 0 });
  });

  test('correct colors in wrong positions returns 0 hits, correct coincidences', () => {
    expect(calculateHints(
      ['red', 'blue', 'green', 'yellow'],
      ['blue', 'red', 'yellow', 'green']
    )).toEqual({ hits: 0, coincidences: 4 });
  });

  test('mixed hits and coincidences', () => {
    expect(calculateHints(
      ['red', 'blue', 'green', 'yellow'],
      ['red', 'green', 'blue', 'purple']
    )).toEqual({ hits: 1, coincidences: 2 });
  });

  test('duplicate colors counted correctly', () => {
    expect(calculateHints(
      ['red', 'red', 'blue', 'blue'],
      ['red', 'blue', 'red', 'green']
    )).toEqual({ hits: 1, coincidences: 2 });
  });

  test('no matches at all', () => {
    expect(calculateHints(
      ['red', 'blue', 'green', 'yellow'],
      ['purple', 'orange', 'purple', 'orange']
    )).toEqual({ hits: 0, coincidences: 0 });
  });
});

describe('isWin', () => {
  test('returns true when all 4 are hits', () => {
    expect(isWin({ hits: 4, coincidences: 0 })).toBe(true);
  });

  test('returns false when fewer than 4 hits', () => {
    expect(isWin({ hits: 3, coincidences: 1 })).toBe(false);
  });

  test('returns false for 0 hits', () => {
    expect(isWin({ hits: 0, coincidences: 4 })).toBe(false);
  });
});
