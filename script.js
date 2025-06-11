let board = null;
let game = new Chess();
let mode = null;

document.getElementById("botMode").onclick = () => startGame("bot");
document.getElementById("localMode").onclick = () => startGame("local");

function startGame(selectedMode) {
  mode = selectedMode;
  document.getElementById("menu").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop
  });
}

function onDrop(source, target) {
  const move = game.move({ from: source, to: target, promotion: "q" });
  if (move === null) return "snapback";

  board.position(game.fen());
  updateStatus();

  if (mode === "bot" && !game.game_over() && game.turn() === 'b') {
    setTimeout(botMove, 1000);
  }
}

function botMove() {
  const moves = game.moves();
  const move = moves[Math.floor(Math.random() * moves.length)];
  game.move(move);
  board.position(game.fen());
  updateStatus();
}

function updateStatus() {
  const statusEl = document.getElementById("status");
  if (game.in_checkmate()) statusEl.innerText = "Checkmate!";
  else if (game.in_draw()) statusEl.innerText = "Draw!";
  else statusEl.innerText = "Turn: " + (game.turn() === "w" ? "White" : "Black");
}
