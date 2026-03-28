(function (root) {
  const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const CODE_LENGTH = 4;
  const MAX_ATTEMPTS = 10;

  function generateSecretCode() {
    return Array.from({ length: CODE_LENGTH }, () =>
      COLORS[Math.floor(Math.random() * COLORS.length)]
    );
  }

  function validateGuess(guess) {
    if (!Array.isArray(guess) || guess.length !== CODE_LENGTH) {
      return false;
    }
    return guess.every(color => COLORS.includes(color));
  }

  function calculateHints(secret, guess) {
    let hits = 0;
    let coincidences = 0;
    const secretCopy = [...secret];
    const guessCopy = [...guess];

    for (let i = 0; i < CODE_LENGTH; i++) {
      if (secretCopy[i] === guessCopy[i]) {
        hits++;
        secretCopy[i] = null;
        guessCopy[i] = null;
      }
    }

    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessCopy[i] !== null) {
        const idx = secretCopy.indexOf(guessCopy[i]);
        if (idx !== -1) {
          coincidences++;
          secretCopy[idx] = null;
        }
      }
    }

    return { hits, coincidences };
  }

  function isWin(hints) {
    return hints.hits === CODE_LENGTH;
  }

  const api = { COLORS, CODE_LENGTH, MAX_ATTEMPTS, generateSecretCode, validateGuess, calculateHints, isWin };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    Object.assign(root, api);
  }
}(typeof window !== 'undefined' ? window : global));
