'use strict';

const {
  COLORS,
  CODE_LENGTH,
  MAX_ATTEMPTS,
  generateSecretCode,
  isValidGuess,
  evaluateGuess,
  createGame,
} = require('./mastermind');

// ─────────────────────────────────────────────
// generateSecretCode
// ─────────────────────────────────────────────
describe('generateSecretCode', () => {
  test('returns an array of CODE_LENGTH elements', () => {
    const code = generateSecretCode();
    expect(code).toHaveLength(CODE_LENGTH);
  });

  test('every element is a valid color', () => {
    const code = generateSecretCode();
    code.forEach((color) => expect(COLORS).toContain(color));
  });

  test('produces different codes over multiple calls (randomness check)', () => {
    const results = new Set();
    for (let i = 0; i < 20; i++) {
      results.add(generateSecretCode().join('-'));
    }
    // It's statistically impossible that all 20 random codes are identical
    expect(results.size).toBeGreaterThan(1);
  });
});

// ─────────────────────────────────────────────
// isValidGuess
// ─────────────────────────────────────────────
describe('isValidGuess', () => {
  test('returns true for a valid guess of 4 known colors', () => {
    expect(isValidGuess(['rojo', 'azul', 'verde', 'amarillo'])).toBe(true);
  });

  test('returns false when fewer than 4 colors are provided', () => {
    expect(isValidGuess(['rojo', 'azul', 'verde'])).toBe(false);
  });

  test('returns false when more than 4 colors are provided', () => {
    expect(isValidGuess(['rojo', 'azul', 'verde', 'amarillo', 'morado'])).toBe(false);
  });

  test('returns false when an unknown color is present', () => {
    expect(isValidGuess(['rojo', 'azul', 'verde', 'blanco'])).toBe(false);
  });

  test('returns false for a non-array input', () => {
    expect(isValidGuess('rojo,azul,verde,amarillo')).toBe(false);
  });

  test('returns false for null', () => {
    expect(isValidGuess(null)).toBe(false);
  });

  test('allows repeated colors in a valid guess', () => {
    expect(isValidGuess(['rojo', 'rojo', 'rojo', 'rojo'])).toBe(true);
  });
});

// ─────────────────────────────────────────────
// evaluateGuess
// ─────────────────────────────────────────────
describe('evaluateGuess', () => {
  test('4 hits and 0 coincidences when guess equals secret', () => {
    const secret = ['rojo', 'azul', 'verde', 'amarillo'];
    const result = evaluateGuess(secret, ['rojo', 'azul', 'verde', 'amarillo']);
    expect(result).toEqual({ hits: 4, coincidences: 0 });
  });

  test('0 hits and 0 coincidences when no colors match', () => {
    const secret = ['rojo', 'azul', 'verde', 'amarillo'];
    const result = evaluateGuess(secret, ['morado', 'naranja', 'morado', 'naranja']);
    expect(result).toEqual({ hits: 0, coincidences: 0 });
  });

  test('0 hits and 4 coincidences when all colors correct but all positions wrong', () => {
    const secret = ['rojo', 'azul', 'verde', 'amarillo'];
    const result = evaluateGuess(secret, ['azul', 'verde', 'amarillo', 'rojo']);
    expect(result).toEqual({ hits: 0, coincidences: 4 });
  });

  test('2 hits and 0 coincidences example', () => {
    const secret = ['rojo', 'azul', 'verde', 'amarillo'];
    const result = evaluateGuess(secret, ['rojo', 'azul', 'morado', 'naranja']);
    expect(result).toEqual({ hits: 2, coincidences: 0 });
  });

  test('1 hit and 2 coincidences mixed example', () => {
    const secret = ['rojo', 'azul', 'verde', 'amarillo'];
    const result = evaluateGuess(secret, ['rojo', 'verde', 'amarillo', 'morado']);
    expect(result).toEqual({ hits: 1, coincidences: 2 });
  });

  test('does not double-count duplicate colors in guess', () => {
    // secret: rojo azul verde amarillo
    // guess:  rojo rojo rojo  rojo  -> only 1 hit for the first rojo
    const secret = ['rojo', 'azul', 'verde', 'amarillo'];
    const result = evaluateGuess(secret, ['rojo', 'rojo', 'rojo', 'rojo']);
    expect(result).toEqual({ hits: 1, coincidences: 0 });
  });

  test('coincidences capped by unmatched occurrences in secret (2 rojos in secret, 2 in guess → 2)', () => {
    // secret: rojo rojo verde amarillo
    // guess:  azul azul rojo  rojo
    // No hits; secret has 2 rojos and guess has 2 rojos all in wrong positions -> 2 coincidences
    const secret = ['rojo', 'rojo', 'verde', 'amarillo'];
    const result = evaluateGuess(secret, ['azul', 'azul', 'rojo', 'rojo']);
    expect(result).toEqual({ hits: 0, coincidences: 2 });
  });

  test('coincidences capped by unmatched occurrences in secret (1 rojo in secret, 2 in guess → 1)', () => {
    // secret: rojo verde verde amarillo
    // guess:  azul rojo  rojo  naranja
    // Only 1 rojo in unmatched secret -> only 1 coincidence despite 2 rojos in guess
    const secret = ['rojo', 'verde', 'verde', 'amarillo'];
    const result = evaluateGuess(secret, ['azul', 'rojo', 'rojo', 'naranja']);
    expect(result).toEqual({ hits: 0, coincidences: 1 });
  });
});

// ─────────────────────────────────────────────
// createGame
// ─────────────────────────────────────────────
describe('createGame', () => {
  test('starts with MAX_ATTEMPTS attempts left', () => {
    const game = createGame();
    expect(game.getAttemptsLeft()).toBe(MAX_ATTEMPTS);
  });

  test('starts with empty history', () => {
    const game = createGame();
    expect(game.getHistory()).toHaveLength(0);
  });

  test('starts not won and not over', () => {
    const game = createGame();
    expect(game.isWon()).toBe(false);
    expect(game.isOver()).toBe(false);
  });

  test('decrements attemptsLeft after each guess', () => {
    const game = createGame();
    game.guess(['rojo', 'azul', 'verde', 'amarillo']);
    expect(game.getAttemptsLeft()).toBe(MAX_ATTEMPTS - 1);
  });

  test('records each guess in history', () => {
    const game = createGame();
    game.guess(['rojo', 'azul', 'verde', 'amarillo']);
    game.guess(['morado', 'naranja', 'rojo', 'azul']);
    const history = game.getHistory();
    expect(history).toHaveLength(2);
    expect(history[0].guess).toEqual(['rojo', 'azul', 'verde', 'amarillo']);
    expect(history[0]).toHaveProperty('hits');
    expect(history[0]).toHaveProperty('coincidences');
  });

  test('throws when an invalid guess is submitted', () => {
    const game = createGame();
    expect(() => game.guess(['blanco', 'azul', 'verde', 'amarillo'])).toThrow();
    expect(() => game.guess(['rojo', 'azul', 'verde'])).toThrow();
  });

  test('game is over after MAX_ATTEMPTS guesses', () => {
    const game = createGame();
    const dummyGuess = ['morado', 'naranja', 'morado', 'naranja'];
    // Override secret with something the dummy guess will never hit
    // We'll just submit MAX_ATTEMPTS guesses
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      // Make sure we haven't won accidentally
      if (game.isOver()) break;
      game.guess(dummyGuess);
    }
    expect(game.isOver()).toBe(true);
  });

  test('throws when guessing after game is over', () => {
    const game = createGame();
    const dummyGuess = ['morado', 'naranja', 'morado', 'naranja'];
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      if (game.isOver()) break;
      game.guess(dummyGuess);
    }
    expect(() => game.guess(dummyGuess)).toThrow('El juego ha terminado.');
  });

  test('returns won=true when the correct code is guessed', () => {
    const game = createGame();
    const secret = game.revealSecretCode();
    const result = game.guess(secret);
    expect(result.won).toBe(true);
    expect(game.isWon()).toBe(true);
    expect(game.isOver()).toBe(true);
  });

  test('revealSecretCode returns a copy (immutable)', () => {
    const game = createGame();
    const code1 = game.revealSecretCode();
    const code2 = game.revealSecretCode();
    expect(code1).toEqual(code2);
    code1.push('extra');
    expect(game.revealSecretCode()).toHaveLength(CODE_LENGTH);
  });

  test('getHistory returns a copy (immutable)', () => {
    const game = createGame();
    game.guess(['rojo', 'azul', 'verde', 'amarillo']);
    const history = game.getHistory();
    history.push({ fake: true });
    expect(game.getHistory()).toHaveLength(1);
  });
});
