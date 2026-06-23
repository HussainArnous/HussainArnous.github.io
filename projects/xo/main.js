// عناصر المودال
const modal = document.getElementById('startmodal');
const startBtn = document.getElementById('startbtn');
const inputX = document.getElementById('playerX');
const inputO = document.getElementById('playerO');

// عناصر الصفحة

const statusEl = document.getElementById('status');
const playersEl = document.getElementById('players');
const cells = document.querySelectorAll('.cell');
const drawEl = document.querySelector('.draw');
const restartBtn = document.getElementById('restartBtn');
// متغيرات اللعبة
let playerXName = 'Player 1';
let playerOName = 'Player 2';
let currentPlayer = 'X';
let gameStarted = false;
let gameOver = false;
let scoreX = 0;
let scoreO = 0;
let drawScore = 0;

const scoreXEl = document.querySelector('.sp1');
const scoreOEl = document.querySelector('.sp2');

// طرق الفوز

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// دالة فحص الفوز

function checkWinner() {
  for (let i = 0; i < winCombos.length; i++) {
    const a = winCombos[i][0];
    const b = winCombos[i][1];
    const c = winCombos[i][2];

    const A = cells[a].textContent;
    const B = cells[b].textContent;
    const C = cells[c].textContent;

    if (A !== '' && A === B && B === C) {
      return A; // X أو O
    }
  }
  return null;
}


function checkDraw() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent === '') {
      return false; // لسه في خانة فاضية
    }
  }
  return true; // كل الخانات مليانة
}

// زر Start

startBtn.addEventListener('click', function () {
  playerXName = inputX.value;
  playerOName = inputO.value;

  if (playerXName === '') {
    playerXName = 'Player 1';
  }
  if (playerOName === '') {
    playerOName = 'Player 2';
  }

  playersEl.textContent = playerXName + ' vs ' + playerOName;

  scoreXEl.textContent = playerXName + ': ' + scoreX;
  scoreOEl.textContent = playerOName + ': ' + scoreO;
  drawEl.textContent = 'Draw: ' + drawScore;


  currentPlayer = 'X';
  statusEl.textContent = playerXName;
  statusEl.style.color = '#000';
  statusEl.style.fontSize = '20px';
  statusEl.style.fontWeight = '600';

  gameStarted = true;
  gameOver = false;

  modal.style.display = 'none';
});


// الضغط على الخانات

for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener('click', function () {

    if (!gameStarted) return;
    if (gameOver) return;
    if (cells[i].textContent !== '') return; //als het cell al gevuld

    cells[i].textContent = currentPlayer;

    // فحص الفوز
const winner = checkWinner(); //const // winner verandert niet in dit blok
if (winner !== null) {
  gameOver = true; // niemand kan klikken 

  if (winner === 'X') {
    scoreX++;
    scoreXEl.textContent = playerXName + ': ' + scoreX;
    statusEl.textContent = '🎉 ' + playerXName + ' winner';
  } else {
    scoreO++;
    scoreOEl.textContent = playerOName + ': ' + scoreO;
    statusEl.textContent = '🎉 ' + playerOName + ' winner';
  }

  statusEl.style.color = '#1b5e20';
  statusEl.style.fontSize = '26px';
  statusEl.style.fontWeight = '700';

  return; //  مهم جداً
}

// فحص التعادل لازم يكون بعد الفوز وليس داخله
if (checkDraw()) {
  gameOver = true;

  drawScore++;
  drawEl.textContent = 'Draw: ' + drawScore;

  statusEl.textContent = '🤝 Draw';
  statusEl.style.color = '#6a1b9a';
  statusEl.style.fontSize = '26px';
  statusEl.style.fontWeight = '700';

  return;
}

    // تبديل الدور
    if (currentPlayer === 'X') {
      currentPlayer = 'O';
      statusEl.textContent = playerOName;
    } else {
      currentPlayer = 'X';
      statusEl.textContent = playerXName;
    }
  });
}


restartBtn.addEventListener('click', function () {
  // 1) فضّي كل الخانات
  for (let i = 0; i < cells.length; i++) {
    cells[i].textContent = '';
  }

  // 2) تصفير السكور
  scoreX = 0;
  scoreO = 0;
  drawScore = 0;

  // 3) رجّع النصوص تحت (سكور) للوضع الافتراضي
  scoreXEl.textContent = 'Player 1: 0';
  drawEl.textContent = 'Draw: 0';
  scoreOEl.textContent = 'Player 2: 0';

  // 4) رجّع أعلى يمين + الشريط الأحمر للوضع الافتراضي
  playersEl.textContent = 'Player 1 vs Player 2';
  statusEl.textContent = 'Player';
  statusEl.style.color = '#000';
  statusEl.style.fontSize = '20px';
  statusEl.style.fontWeight = '600';

  // 5) تصفير أسماء اللاعبين + تفريغ حقول الإدخال
  playerXName = 'Player 1';
  playerOName = 'Player 2';
  inputX.value = '';
  inputO.value = '';

  // 6) رجّع حالة اللعبة
  currentPlayer = 'X';
  gameOver = false;
  gameStarted = false;

  // 7) افتح المودال من جديد
  modal.style.display = 'flex'; 
});
