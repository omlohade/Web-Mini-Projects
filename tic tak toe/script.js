const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const startButton = document.getElementById("start");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const gameMode = document.querySelectorAll('input[name="mode"]');

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let scores = { X: 0, O: 0 };
let isAIMode = false;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  checkForWinner();

  if (isAIMode && gameActive && currentPlayer === "X") {
    // Switch to AI's turn
    currentPlayer = "O";
    setTimeout(makeAIMove, 500); // AI makes a move after 500ms
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }

  updateStatus();
}

function makeAIMove() {
  let bestMove = findBestMove();
  if (bestMove !== -1) {
    gameState[bestMove] = "O";
    cells[bestMove].textContent = "O";
    checkForWinner();
    currentPlayer = "X"; // Switch back to Player X's turn
    updateStatus();
  }
}

function findBestMove() {
  // Check for a winning move for AI
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "")
      return c;
    if (gameState[a] === "O" && gameState[c] === "O" && gameState[b] === "")
      return b;
    if (gameState[b] === "O" && gameState[c] === "O" && gameState[a] === "")
      return a;
  }

  // Block the player's winning move
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] === "X" && gameState[b] === "X" && gameState[c] === "")
      return c;
    if (gameState[a] === "X" && gameState[c] === "X" && gameState[b] === "")
      return b;
    if (gameState[b] === "X" && gameState[c] === "X" && gameState[a] === "")
      return a;
  }

  // Take the center if available
  if (gameState[4] === "") return 4;

  // Take a corner if available
  const corners = [0, 2, 6, 8];
  for (let corner of corners) {
    if (gameState[corner] === "") return corner;
  }

  // Take any available cell
  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === "") return i;
  }

  return -1; // No move available
}

function checkForWinner() {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "")
      continue;
    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${
      currentPlayer === "X"
        ? playerXInput.value || "Player X"
        : playerOInput.value || "Player O"
    } wins!`;
    scores[currentPlayer]++;
    updateScoreboard();
    gameActive = false;
    return;
  }

  const roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusText.textContent = "Draw!";
    gameActive = false;
    return;
  }
}

function updateStatus() {
  if (gameActive) {
    statusText.textContent = `It's ${
      currentPlayer === "X"
        ? playerXInput.value || "Player X"
        : playerOInput.value || "Player O"
    }'s turn`;
  }
}

function updateScoreboard() {
  scoreX.textContent = `${playerXInput.value || "Player X"}: ${scores.X}`;
  scoreO.textContent = `${playerOInput.value || "Player O"}: ${scores.O}`;
}

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  cells.forEach((cell) => (cell.textContent = ""));
  updateStatus();
}

function startGame() {
  isAIMode =
    document.querySelector('input[name="mode"]:checked').value === "ai";
  resetGame();
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
startButton.addEventListener("click", startGame);

updateScoreboard();
