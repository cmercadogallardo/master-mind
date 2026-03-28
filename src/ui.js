(function (root) {
  const COLOR_LABELS = {
    red: 'Rojo',
    blue: 'Azul',
    green: 'Verde',
    yellow: 'Amarillo',
    purple: 'Morado',
    orange: 'Naranja'
  };

  function renderBoard(attempts, containerId = 'board') {
    const board = document.getElementById(containerId);
    if (!board) return;
    board.innerHTML = '';
    attempts.forEach(({ guess, hints }) => {
      const row = document.createElement('div');
      row.className = 'board-row';

      const guessSection = document.createElement('div');
      guessSection.className = 'guess-pegs';
      guess.forEach(color => {
        const peg = document.createElement('div');
        peg.className = `peg peg-${color}`;
        peg.setAttribute('aria-label', COLOR_LABELS[color] || color);
        guessSection.appendChild(peg);
      });

      const hintSection = document.createElement('div');
      hintSection.className = 'hint-pegs';
      for (let i = 0; i < hints.hits; i++) {
        const dot = document.createElement('span');
        dot.className = 'hint-dot hint-hit';
        dot.textContent = '✅';
        hintSection.appendChild(dot);
      }
      for (let i = 0; i < hints.coincidences; i++) {
        const dot = document.createElement('span');
        dot.className = 'hint-dot hint-coincidence';
        dot.textContent = '🔴';
        hintSection.appendChild(dot);
      }

      row.appendChild(guessSection);
      row.appendChild(hintSection);
      board.appendChild(row);
    });
  }

  function renderCurrentGuess(currentGuess, containerId = 'current-guess') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const slots = container.querySelectorAll('.guess-slot');
    slots.forEach((slot, i) => {
      const isActive = slot.classList.contains('active-slot');
      slot.className = 'guess-slot';
      if (isActive) slot.classList.add('active-slot');
      if (currentGuess[i]) {
        slot.classList.add(`peg-${currentGuess[i]}`);
        slot.setAttribute('aria-label', COLOR_LABELS[currentGuess[i]] || currentGuess[i]);
      } else {
        slot.setAttribute('aria-label', 'Vacío');
      }
    });
  }

  function renderColorPicker(colors, onColorSelect, selectedIndex, containerId = 'color-picker') {
    const picker = document.getElementById(containerId);
    if (!picker) return;
    picker.innerHTML = '';
    colors.forEach(color => {
      const btn = document.createElement('button');
      btn.className = `color-btn peg-${color}`;
      btn.setAttribute('aria-label', COLOR_LABELS[color] || color);
      btn.dataset.color = color;
      btn.addEventListener('click', () => onColorSelect(color));
      picker.appendChild(btn);
    });
  }

  function showMessage(message, type = 'info', containerId = 'message') {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.textContent = message;
    el.className = `message message-${type}`;
    el.style.display = 'block';
  }

  function hideMessage(containerId = 'message') {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.style.display = 'none';
    el.textContent = '';
  }

  function updateAttemptsCounter(remaining, containerId = 'attempts-counter') {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.textContent = `Intentos restantes: ${remaining}`;
  }

  function showActiveSlot(index, containerId = 'current-guess') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const slots = container.querySelectorAll('.guess-slot');
    slots.forEach((slot, i) => {
      slot.classList.toggle('active-slot', i === index);
    });
  }

  function highlightSelectedPosition(index, containerId = 'current-guess') {
    showActiveSlot(index, containerId);
  }

  const api = {
    COLOR_LABELS,
    renderBoard,
    renderCurrentGuess,
    renderColorPicker,
    showMessage,
    hideMessage,
    updateAttemptsCounter,
    showActiveSlot,
    highlightSelectedPosition
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    Object.assign(root, api);
  }
}(typeof window !== 'undefined' ? window : global));
