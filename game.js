/**
 * game.js - Core Mastermind game logic
 * Handles secret code generation, attempt validation, and hint calculation.
 */

const COLORS = ['rojo', 'azul', 'verde', 'amarillo', 'morado', 'naranja'];
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;

/**
 * Generates a random secret code of CODE_LENGTH colors.
 * @returns {string[]} Array of color names
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
 * Calculates hints for a given guess against the secret code.
 * @param {string[]} secretCode - The secret code array
 * @param {string[]} guess - The player's guess array
 * @returns {{ exact: number, partial: number }} Hint object
 */
function calculateHints(secretCode, guess) {
  let exact = 0;
  let partial = 0;

  const secretRemaining = [];
  const guessRemaining = [];

  for (let i = 0; i < CODE_LENGTH; i++) {
    if (secretCode[i] === guess[i]) {
      exact++;
    } else {
      secretRemaining.push(secretCode[i]);
      guessRemaining.push(guess[i]);
    }
  }

  for (const color of guessRemaining) {
    const idx = secretRemaining.indexOf(color);
    if (idx !== -1) {
      partial++;
      secretRemaining.splice(idx, 1);
    }
  }

  return { exact, partial };
}

/**
 * Creates and manages a Mastermind game instance.
 * @returns {object} Game instance with methods to interact with the game
 */
function createGame() {
  let secretCode = generateSecretCode();
  let attemptsLeft = MAX_ATTEMPTS;
  let history = [];
  let gameOver = false;
  let won = false;

  return {
    getAttemptsLeft() {
      return attemptsLeft;
    },
    getHistory() {
      return history;
    },
    isGameOver() {
      return gameOver;
    },
    isWon() {
      return won;
    },
    getSecretCode() {
      return gameOver ? [...secretCode] : null;
    },
    /**
     * Submits a guess and returns hints, or null if the game is over.
     * @param {string[]} guess
     * @returns {{ guess: string[], hints: { exact: number, partial: number } } | null}
     */
    submitGuess(guess) {
      if (gameOver) return null;
      if (guess.length !== CODE_LENGTH) return null;

      const hints = calculateHints(secretCode, guess);
      attemptsLeft--;
      const entry = { guess: [...guess], hints };
      history.push(entry);

      if (hints.exact === CODE_LENGTH) {
        gameOver = true;
        won = true;
      } else if (attemptsLeft === 0) {
        gameOver = true;
      }

      return entry;
    },
    /**
     * Resets the game with a new secret code.
     */
    reset() {
      secretCode = generateSecretCode();
      attemptsLeft = MAX_ATTEMPTS;
      history = [];
      gameOver = false;
      won = false;
    },
  };
}
