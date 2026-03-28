/**
 * app.js – Controller: connects game logic with the UI
 */

/* ── DOM references ── */
const boardEl       = document.getElementById('board');
const activeRowEl   = document.getElementById('active-row');
const paletteEl     = document.getElementById('palette');
const submitBtn     = document.getElementById('submit-btn');
const clearBtn      = document.getElementById('clear-btn');
const newGameBtn    = document.getElementById('new-game-btn');
const attemptsLabel = document.getElementById('attempts-count');
const messageEl     = document.getElementById('message');
const secretReveal  = document.getElementById('secret-reveal');

/* ── Game state ── */
let game;
let currentGuess = [];   // up to CODE_LENGTH entries
let selectedSlot = 0;    // index of the next slot to fill

const SLOT_COUNT = 4;

/* ══════════════════════════════════════════════
   INITIALISATION
══════════════════════════════════════════════ */
function init() {
  game = createGame();
  currentGuess = [];
  selectedSlot = 0;
  boardEl.innerHTML = '';
  secretReveal.innerHTML = '';
  setMessage('', '');
  renderActiveRow();
  updateAttemptsLabel();
  submitBtn.disabled = true;
  submitBtn.style.display  = '';
  clearBtn.style.display   = '';
  paletteEl.style.opacity  = '1';
  paletteEl.style.pointerEvents = '';
  activeRowEl.style.opacity = '1';
  activeRowEl.style.pointerEvents = '';
}

/* ══════════════════════════════════════════════
   RENDER HELPERS
══════════════════════════════════════════════ */

/** Updates the active (input) row based on currentGuess */
function renderActiveRow() {
  activeRowEl.innerHTML = '';
  for (let i = 0; i < SLOT_COUNT; i++) {
    const slot = document.createElement('div');
    slot.className = 'active-slot';
    slot.dataset.index = i;

    if (currentGuess[i]) {
      slot.classList.add('filled', currentGuess[i]);
    }

    /* clicking a filled slot removes that color */
    slot.addEventListener('click', () => {
      if (game.isGameOver()) return;
      if (currentGuess[i]) {
        currentGuess.splice(i, 1);
        selectedSlot = currentGuess.length;
        renderActiveRow();
        submitBtn.disabled = currentGuess.length < SLOT_COUNT;
      }
    });

    activeRowEl.appendChild(slot);
  }
}

/** Appends a completed attempt row to the board */
function renderAttemptRow({ guess, hints }) {
  const row = document.createElement('div');
  row.className = 'attempt-row';

  guess.forEach(color => {
    const peg = document.createElement('div');
    peg.className = `peg ${color}`;
    row.appendChild(peg);
  });

  row.appendChild(buildHintDisplay(hints));
  boardEl.prepend(row);   // newest attempt on top
}

/** Builds the 2×2 hint grid element */
function buildHintDisplay({ exact, partial }) {
  const container = document.createElement('div');
  container.className = 'hints';
  container.setAttribute('aria-label', `${exact} aciertos, ${partial} coincidencias`);

  const total = SLOT_COUNT;
  const pins = [
    ...Array(exact).fill('exact'),
    ...Array(partial).fill('partial'),
    ...Array(total - exact - partial).fill('none'),
  ];

  pins.forEach(type => {
    const pin = document.createElement('div');
    pin.className = `hint-peg ${type}`;
    container.appendChild(pin);
  });

  return container;
}

/** Updates the attempts counter label */
function updateAttemptsLabel() {
  attemptsLabel.textContent = game.getAttemptsLeft();
}

/** Sets the message bar text and style */
function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = type ? `${type}` : '';
}

/** Renders the revealed secret code pegs */
function revealSecretCode(code) {
  secretReveal.innerHTML = '';
  const label = document.createElement('span');
  label.style.marginRight = '0.4rem';
  label.style.fontWeight  = '600';
  label.style.color       = '#aaa';
  label.textContent       = 'Código:';
  secretReveal.appendChild(label);

  code.forEach(color => {
    const peg = document.createElement('div');
    peg.className = `peg ${color}`;
    peg.style.width  = '32px';
    peg.style.height = '32px';
    secretReveal.appendChild(peg);
  });
}

/* ══════════════════════════════════════════════
   PALETTE – color selection
══════════════════════════════════════════════ */
function buildPalette() {
  COLORS.forEach(color => {
    const btn = document.createElement('button');
    btn.className = `color-btn ${color}`;
    btn.setAttribute('aria-label', color);
    btn.title = color.charAt(0).toUpperCase() + color.slice(1);
    btn.addEventListener('click', () => handleColorPick(color));
    paletteEl.appendChild(btn);
  });
}

/** Called when the user clicks a color button */
function handleColorPick(color) {
  if (game.isGameOver()) return;
  if (currentGuess.length >= SLOT_COUNT) return;

  currentGuess.push(color);
  selectedSlot = currentGuess.length;
  renderActiveRow();
  submitBtn.disabled = currentGuess.length < SLOT_COUNT;
}

/* ══════════════════════════════════════════════
   SUBMIT GUESS
══════════════════════════════════════════════ */
function handleSubmit() {
  if (currentGuess.length < SLOT_COUNT) return;

  try {
    const result = game.guess([...currentGuess]);
    renderAttemptRow({
      guess: currentGuess,
      hits: result.hits,
      coincidences: result.coincidences
    });
    updateAttemptsLabel();

    currentGuess = [];
    renderActiveRow();
    submitBtn.disabled = true;

    if (game.isWon()) {
      setMessage('🎉 ¡Felicidades! ¡Adivinaste el código!', 'win');
      lockInput();
    } else if (game.isOver()) {
      setMessage('😢 ¡Sin intentos! El código era:', 'lose');
      revealSecretCode(game.revealSecretCode());
      lockInput();
    } else {
      const left = game.getAttemptsLeft();
      if (left <= 3) {
        setMessage(`⚠️ ¡Solo ${left === 1 ? 'queda' : 'quedan'} ${left} intento${left === 1 ? '' : 's'}!`, 'info');
      }
    }
  } catch (error) {
    setMessage(error.message, 'error');
  }
}

/** Disables palette and active row after game ends */
function lockInput() {
  submitBtn.disabled = true;
  submitBtn.style.display = 'none';
  clearBtn.style.display  = 'none';
  paletteEl.style.opacity = '0.35';
  paletteEl.style.pointerEvents = 'none';
  activeRowEl.style.opacity = '0.35';
  activeRowEl.style.pointerEvents = 'none';
}

/* ══════════════════════════════════════════════
   CLEAR GUESS
══════════════════════════════════════════════ */
function handleClear() {
  currentGuess = [];
  selectedSlot = 0;
  renderActiveRow();
  submitBtn.disabled = true;
}

/* ══════════════════════════════════════════════
   BOOTSTRAP
══════════════════════════════════════════════ */
buildPalette();
init();

submitBtn.addEventListener('click', handleSubmit);
clearBtn.addEventListener('click', handleClear);
newGameBtn.addEventListener('click', init);
