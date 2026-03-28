/**
 * app.js – Bootstrap: wires the GameController to DOM events.
 * Loaded last in index.html after game-logic.js, ui.js, and controller.js.
 */
(function () {
  'use strict';

  const controller = new GameController(); // eslint-disable-line no-undef

  document.addEventListener('DOMContentLoaded', () => {
    controller.startGame();
    wireEvents();
  });

  function wireEvents() {
    document.getElementById('new-game-btn').addEventListener('click', () => {
      controller.startGame();
    });

    document.getElementById('submit-btn').addEventListener('click', () => {
      controller.submitGuess();
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
      controller.clearGuess();
    });

    document.getElementById('current-guess').addEventListener('click', (e) => {
      const slot = e.target.closest('.guess-slot');
      if (!slot) return;
      const index = parseInt(slot.dataset.index, 10);
      if (!isNaN(index)) controller.selectPosition(index);
    });
  }
})();
