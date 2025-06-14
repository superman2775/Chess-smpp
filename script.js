document.addEventListener("DOMContentLoaded", () => {
  const boardEl = document.getElementById("chessboard");
  const menu = document.getElementById("menu");
  const pieces = {
    r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
    R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙"
  };
  let board = [];
  let selected = null;
  let turn = "w";
  let mode = "local";

  document.getElementById("botMode").onclick = () => startGame("bot");
  document.getElementById("localMode").onclick = () => startGame("local");

  function startGame(m) {
    mode = m;
    menu.classList.add("hidden");
    boardEl.classList.remove("hidden");
    initBoard();
    renderBoard();
  }

  function initBoard() {
    const layout = [
      "rnbqkbnr",
      "pppppppp",
      "........",
      "........",
      "........",
      "........",
      "PPPPPPPP",
      "RNBQKBNR"
    ];
    board = layout.map(row => row.split(""));
    turn = "w";
  }

  function renderBoard() {
    boardEl.innerHTML = "";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.className = "square " + ((row + col) % 2 === 0 ? "white" : "black");
        square.dataset.row = row;
        square.dataset.col = col;
        const piece = board[row][col];
        if (piece !== ".") square.textContent = pieces[piece];
        if (selected && selected.row == row && selected.col == col)
          square.classList.add("selected");

        square.onclick = () => handleClick(row, col);
        boardEl.appendChild(square);
      }
    }
  }

  function isWhite(piece) {
    return piece === piece.toUpperCase();
  }

  function isBlack(piece) {
    return piece === piece.toLowerCase();
  }

  function handleClick(row, col) {
    const clicked = board[row][col];

    if (selected) {
      const { row: sr, col: sc } = selected;
      const movingPiece = board[sr][sc];
      if ((turn === "w" && isWhite(movingPiece)) || (turn === "b" && isBlack(movingPiece))) {
        if (isLegalMove(movingPiece, sr, sc, row, col)) {
          board[row][col] = movingPiece;
          board[sr][sc] = ".";
          turn = turn === "w" ? "b" : "w";
          selected = null;
          renderBoard();
          if (mode === "bot" && turn === "b") setTimeout(botMove, 1000);
          return;
        }
      }
      selected = null;
      renderBoard();
    } else {
      if ((turn === "w" && isWhite(clicked)) || (turn === "b" && isBlack(clicked))) {
        selected = { row, col };
        renderBoard();
      }
    }
  }

  function isLegalMove(piece, r1, c1, r2, c2) {
    const dest = board[r2][c2];
    if (piece.toLowerCase() === "p") {
      const dir = isWhite(piece) ? -1 : 1;
      if (c1 === c2 && board[r2][c2] === "." && r2 === r1 + dir) return true;
      if (Math.abs(c1 - c2) === 1 && r2 === r1 + dir && dest !== "." && isWhite(piece) !== isWhite(dest)) return true;
      return false;
    }
    return dest === "." || isWhite(piece) !== isWhite(dest);
  }

  function botMove() {
    const moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece !== "." && isBlack(piece)) {
          for (let rr = 0; rr < 8; rr++) {
            for (let cc = 0; cc < 8; cc++) {
              if (isLegalMove(piece, r, c, rr, cc)) {
                moves.push({ from: [r, c], to: [rr, cc] });
              }
            }
          }
        }
      }
    }
    if (moves.length === 0) return;
    const move = moves[Math.floor(Math.random() * moves.length)];
    const [fr, fc] = move.from;
    const [tr, tc] = move.to;
    board[tr][tc] = board[fr][fc];
    board[fr][fc] = ".";
    turn = "w";
    renderBoard();
  }
});
