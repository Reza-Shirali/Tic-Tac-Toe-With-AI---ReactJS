import React, { useState } from "react";
import "./App.css";

const initialBoard = ["", "", "", "", "", "", "", "", ""];

const checkWinner = (board) => {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (board.every((cell) => cell !== "")) {
    return "Tie";
  }

  return null;
};

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (board[index] !== "" || winner) return;

    const newBoard = [...board];
    newBoard[index] = playerTurn ? "X" : "O";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setPlayerTurn(!playerTurn);
      if (playerTurn) {
        setTimeout(() => aiMove(newBoard), 500);
      }
    }
  };

  const aiMove = (currentBoard) => {
    const bestMove = findBestMove(currentBoard);
    const newBoard = [...currentBoard];
    newBoard[bestMove] = "O";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setPlayerTurn(true);
    }
  };

  const findBestMove = (board) => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (board, depth, isMaximizing) => {
    const scores = {
      X: -10,
      O: 10,
      Tie: 0,
    };

    let result = checkWinner(board);
    if (result) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = "O";
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = "X";
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="game">
      <h1 className="title">Tic-Tac-Toe (Player vs AI)</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell ? "filled" : ""}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div className="winner">
          {winner === "Tie" ? "It's a Tie!" : `Winner: ${winner}`}
          <button onClick={resetGame} className="btn_reseat">
            {" "}
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
