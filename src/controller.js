(function (root) {
  const gameLogic = typeof require !== 'undefined' ? require('./game-logic') : root;
  const { COLORS, CODE_LENGTH, MAX_ATTEMPTS, generateSecretCode, validateGuess, calculateHints, isWin } = gameLogic;

  const ui = typeof require !== 'undefined' ? require('./ui') : root;

  class GameController {
    constructor() {
      this.secretCode = null;
      this.attempts = [];
      this.currentGuess = new Array(CODE_LENGTH).fill(null);
      this.selectedPosition = 0;
      this.gameOver = false;
    }

    startGame() {
      this.secretCode = generateSecretCode();
      this.attempts = [];
      this.currentGuess = new Array(CODE_LENGTH).fill(null);
      this.selectedPosition = 0;
      this.gameOver = false;

      ui.renderBoard(this.attempts);
      ui.renderCurrentGuess(this.currentGuess);
      ui.renderColorPicker(COLORS, (color) => this.selectColor(color), this.selectedPosition);
      ui.updateAttemptsCounter(MAX_ATTEMPTS);
      ui.hideMessage();
      ui.showActiveSlot(this.selectedPosition);
    }

    selectPosition(index) {
      if (this.gameOver) return;
      if (index < 0 || index >= CODE_LENGTH) return;
      this.selectedPosition = index;
      ui.highlightSelectedPosition(this.selectedPosition);
    }

    selectColor(color) {
      if (this.gameOver) return;
      if (!COLORS.includes(color)) return;
      this.currentGuess[this.selectedPosition] = color;
      ui.renderCurrentGuess(this.currentGuess);
      if (this.selectedPosition < CODE_LENGTH - 1) {
        this.selectedPosition++;
        ui.showActiveSlot(this.selectedPosition);
      }
    }

    clearSlot(index) {
      if (this.gameOver) return;
      if (index < 0 || index >= CODE_LENGTH) return;
      this.currentGuess[index] = null;
      ui.renderCurrentGuess(this.currentGuess);
    }

    clearGuess() {
      if (this.gameOver) return;
      this.currentGuess = new Array(CODE_LENGTH).fill(null);
      this.selectedPosition = 0;
      ui.renderCurrentGuess(this.currentGuess);
      ui.showActiveSlot(this.selectedPosition);
    }

    submitGuess() {
      if (this.gameOver) return { success: false, reason: 'game_over' };

      if (!validateGuess(this.currentGuess)) {
        ui.showMessage('Por favor selecciona 4 colores para continuar.', 'error');
        return { success: false, reason: 'invalid_guess' };
      }

      const hints = calculateHints(this.secretCode, this.currentGuess);
      const attempt = { guess: [...this.currentGuess], hints };
      this.attempts.push(attempt);

      ui.renderBoard(this.attempts);
      ui.updateAttemptsCounter(MAX_ATTEMPTS - this.attempts.length);

      if (isWin(hints)) {
        this.gameOver = true;
        ui.showMessage(`🎉 ¡Ganaste en ${this.attempts.length} intento${this.attempts.length !== 1 ? 's' : ''}!`, 'win');
        return { success: true, result: 'win', attempt };
      }

      if (this.attempts.length >= MAX_ATTEMPTS) {
        this.gameOver = true;
        ui.showMessage(
          `😞 ¡Perdiste! El código era: ${this.secretCode.join(', ')}.`,
          'lose'
        );
        return { success: true, result: 'lose', attempt };
      }

      this.currentGuess = new Array(CODE_LENGTH).fill(null);
      this.selectedPosition = 0;
      ui.renderCurrentGuess(this.currentGuess);
      ui.showActiveSlot(this.selectedPosition);

      return { success: true, result: 'continue', attempt };
    }

    getRemainingAttempts() {
      return MAX_ATTEMPTS - this.attempts.length;
    }

    getAttempts() {
      return [...this.attempts];
    }

    isGameOver() {
      return this.gameOver;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameController;
  } else {
    root.GameController = GameController;
  }
}(typeof window !== 'undefined' ? window : global));
