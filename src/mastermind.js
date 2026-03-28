'use strict';

const COLORS = ['rojo', 'azul', 'verde', 'amarillo', 'morado', 'naranja'];
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;

/**
 * Generates a random secret code of CODE_LENGTH colors.
 * @returns {string[]} Array of color strings.
 */
function generateSecretCode() {
  const code = [];
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    code.push(COLORS[randomIndex]);
  }
  return code;
}

/**
 * Validates that a guess is a valid array of CODE_LENGTH known colors.
 * @param {string[]} guess - The player's guess.
 * @returns {boolean} True if valid.
 */
function isValidGuess(guess) {
  if (!Array.isArray(guess) || guess.length !== CODE_LENGTH) {
    return false;
  }
  return guess.every((color) => COLORS.includes(color));
}

/**
 * Evaluates a guess against the secret code.
 * @param {string[]} secretCode - The secret code.
 * @param {string[]} guess - The player's guess.
 * @returns {{ hits: number, coincidences: number }} Result with hits and coincidences.
 *   - hits: colors in the exact correct position.
 *   - coincidences: correct colors in the wrong position.
 */
function evaluateGuess(secretCode, guess) {
  let hits = 0;
  let coincidences = 0;

  const unmatchedSecret = [];
  const unmatchedGuess = [];

  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guess[i] === secretCode[i]) {
      hits++;
    } else {
      unmatchedSecret.push(secretCode[i]);
      unmatchedGuess.push(guess[i]);
    }
  }

  for (const color of unmatchedGuess) {
    const idx = unmatchedSecret.indexOf(color);
    if (idx !== -1) {
      coincidences++;
      unmatchedSecret.splice(idx, 1);
    }
  }

  return { hits, coincidences };
}

/**
 * Creates a new Mastermind game instance.
 * @returns {object} Game object with state and methods.
 */
function createGame() {
  const secretCode = generateSecretCode();
  let attemptsLeft = MAX_ATTEMPTS;
  const history = [];
  let won = false;

  return {
    /**
     * Returns the number of remaining attempts.
     */
    getAttemptsLeft() {
      return attemptsLeft;
    },

    /**
     * Returns the attempt history as a read-only copy.
     */
    getHistory() {
      return history.slice();
    },

    /**
     * Returns whether the game has been won.
     */
    isWon() {
      return won;
    },

    /**
     * Returns whether the game is over (won or no attempts left).
     */
    isOver() {
      return won || attemptsLeft === 0;
    },

    /**
     * Submits a guess. Throws if the game is over or the guess is invalid.
     * @param {string[]} guess - Array of COLOR_LENGTH color strings.
     * @returns {{ hits: number, coincidences: number, attemptsLeft: number, won: boolean }}
     */
    guess(guessInput) {
      if (this.isOver()) {
        throw new Error('El juego ha terminado.');
      }
      if (!isValidGuess(guessInput)) {
        throw new Error(
          `Intento inválido. Debes ingresar ${CODE_LENGTH} colores válidos: ${COLORS.join(', ')}.`
        );
      }

      const result = evaluateGuess(secretCode, guessInput);
      attemptsLeft--;

      if (result.hits === CODE_LENGTH) {
        won = true;
      }

      const entry = {
        guess: guessInput.slice(),
        hits: result.hits,
        coincidences: result.coincidences,
      };
      history.push(entry);

      return {
        hits: result.hits,
        coincidences: result.coincidences,
        attemptsLeft,
        won,
      };
    },

    /**
     * Reveals the secret code (useful at end of game).
     * @returns {string[]}
     */
    revealSecretCode() {
      return secretCode.slice();
    },
  };
}

if (typeof window !== 'undefined') {
  window.createGame = createGame;
  window.COLORS = COLORS;
}

module.exports = {
  COLORS,
  CODE_LENGTH,
  MAX_ATTEMPTS,
  generateSecretCode,
  isValidGuess,
  evaluateGuess,
  createGame,
};
