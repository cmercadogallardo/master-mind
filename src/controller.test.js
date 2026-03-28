/**
 * Integration tests for GameController.
 * These tests verify the coordination between game-logic.js and ui.js
 * by mounting a minimal DOM and running full game scenarios.
 */

const GameController = require('./controller');
const { CODE_LENGTH, MAX_ATTEMPTS } = require('./game-logic');

function buildDOM() {
  document.body.innerHTML = `
    <div id="board"></div>
    <div id="current-guess">
      <div class="guess-slot"></div>
      <div class="guess-slot"></div>
      <div class="guess-slot"></div>
      <div class="guess-slot"></div>
    </div>
    <div id="color-picker"></div>
    <div id="message" style="display:none"></div>
    <div id="attempts-counter"></div>
  `;
}

describe('GameController integration', () => {
  let controller;

  beforeEach(() => {
    buildDOM();
    controller = new GameController();
    controller.startGame();
  });

  test('startGame initialises state and renders the board', () => {
    expect(controller.isGameOver()).toBe(false);
    expect(controller.getAttempts()).toHaveLength(0);
    expect(controller.getRemainingAttempts()).toBe(MAX_ATTEMPTS);
    expect(document.getElementById('board').children).toHaveLength(0);
    expect(document.getElementById('attempts-counter').textContent).toContain(String(MAX_ATTEMPTS));
  });

  test('color picker renders one button per color', () => {
    const buttons = document.querySelectorAll('#color-picker .color-btn');
    expect(buttons.length).toBe(6);
  });

  test('selecting a color fills the current slot and advances position', () => {
    controller.selectColor('red');
    expect(controller.currentGuess[0]).toBe('red');
    expect(controller.selectedPosition).toBe(1);

    const slot = document.querySelector('#current-guess .guess-slot');
    expect(slot.classList.contains('peg-red')).toBe(true);
  });

  test('submitting an incomplete guess shows an error message', () => {
    const result = controller.submitGuess();
    expect(result.success).toBe(false);
    expect(result.reason).toBe('invalid_guess');
    const msg = document.getElementById('message');
    expect(msg.style.display).not.toBe('none');
    expect(msg.className).toContain('error');
  });

  test('a valid guess is recorded and board is updated', () => {
    ['red', 'blue', 'green', 'yellow'].forEach(c => controller.selectColor(c));
    const result = controller.submitGuess();
    expect(result.success).toBe(true);
    expect(controller.getAttempts()).toHaveLength(1);
    expect(document.getElementById('board').children).toHaveLength(1);
  });

  test('attempts counter decreases after each guess', () => {
    ['red', 'blue', 'green', 'yellow'].forEach(c => controller.selectColor(c));
    controller.submitGuess();
    expect(controller.getRemainingAttempts()).toBe(MAX_ATTEMPTS - 1);
    expect(document.getElementById('attempts-counter').textContent).toContain(String(MAX_ATTEMPTS - 1));
  });

  test('guessing correctly ends the game with a win', () => {
    const secret = controller.secretCode;
    secret.forEach(c => controller.selectColor(c));
    const result = controller.submitGuess();
    expect(result.result).toBe('win');
    expect(controller.isGameOver()).toBe(true);
    const msg = document.getElementById('message');
    expect(msg.className).toContain('win');
  });

  test('exhausting all attempts ends the game with a loss', () => {
    const wrongGuess = ['red', 'blue', 'green', 'yellow'];
    // Override secret so none of the wrong guesses accidentally win
    controller.secretCode = ['purple', 'purple', 'purple', 'purple'];

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      wrongGuess.forEach(c => controller.selectColor(c));
      controller.submitGuess();
    }

    expect(controller.isGameOver()).toBe(true);
    const msg = document.getElementById('message');
    expect(msg.className).toContain('lose');
  });

  test('actions after game over are ignored', () => {
    controller.secretCode = ['purple', 'purple', 'purple', 'purple'];
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      ['red', 'blue', 'green', 'yellow'].forEach(c => controller.selectColor(c));
      controller.submitGuess();
    }
    const attemptsBefore = controller.getAttempts().length;
    controller.selectColor('red');
    const result = controller.submitGuess();
    expect(result.success).toBe(false);
    expect(result.reason).toBe('game_over');
    expect(controller.getAttempts()).toHaveLength(attemptsBefore);
  });

  test('selectPosition changes the active slot', () => {
    controller.selectPosition(2);
    expect(controller.selectedPosition).toBe(2);
    const slots = document.querySelectorAll('#current-guess .guess-slot');
    expect(slots[2].classList.contains('active-slot')).toBe(true);
  });

  test('clearSlot removes colour from a slot', () => {
    controller.selectColor('red');
    controller.clearSlot(0);
    expect(controller.currentGuess[0]).toBeNull();
  });

  test('startGame resets a finished game', () => {
    controller.secretCode = ['purple', 'purple', 'purple', 'purple'];
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      ['red', 'blue', 'green', 'yellow'].forEach(c => controller.selectColor(c));
      controller.submitGuess();
    }
    expect(controller.isGameOver()).toBe(true);

    controller.startGame();
    expect(controller.isGameOver()).toBe(false);
    expect(controller.getAttempts()).toHaveLength(0);
    expect(controller.getRemainingAttempts()).toBe(MAX_ATTEMPTS);
  });
});
