import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bot, User } from 'lucide-react';

const winLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function checkWinner(board) {
  for (const [a, b, c] of winLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }

  if (board.every(Boolean)) return { winner: 'draw', line: null };
  return null;
}

// Minimax AI - unbeatable.
function minimax(board, isMax, depth = 0) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === 'O') return 10 - depth;
    if (result.winner === 'X') return depth - 10;
    return 0;
  }

  const scores = [];
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    board[i] = isMax ? 'O' : 'X';
    scores.push({ i, score: minimax(board, !isMax, depth + 1) });
    board[i] = null;
  }

  return isMax
    ? Math.max(...scores.map((entry) => entry.score))
    : Math.min(...scores.map((entry) => entry.score));
}

function bestMove(board) {
  let best = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    board[i] = 'O';
    const score = minimax(board, false, 0);
    board[i] = null;

    if (score > best) {
      best = score;
      move = i;
    }
  }

  return move;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const [result, setResult] = useState(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(false);

  useEffect(() => {
    autoRef.current = autoPlay;
  }, [autoPlay]);

  const reset = useCallback(() => {
    setBoard(Array(9).fill(null));
    setXTurn(true);
    setResult(null);
  }, []);

  useEffect(() => {
    if (xTurn || result) return undefined;

    const timer = window.setTimeout(() => {
      setBoard((prev) => {
        const nextBoard = [...prev];
        const move = bestMove(nextBoard);
        if (move === -1) return nextBoard;

        nextBoard[move] = 'O';
        const nextResult = checkWinner(nextBoard);
        if (nextResult) {
          window.setTimeout(() => setResult(nextResult), 50);
        } else {
          window.setTimeout(() => setXTurn(true), 50);
        }

        return nextBoard;
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [xTurn, result]);

  useEffect(() => {
    if (!autoPlay || !xTurn || result) return undefined;

    const timer = window.setTimeout(() => {
      setBoard((prev) => {
        const nextBoard = [...prev];
        const emptyCells = nextBoard.map((value, index) => (value === null ? index : -1)).filter((index) => index >= 0);
        if (emptyCells.length === 0) return nextBoard;

        const preferred = [4, 0, 2, 6, 8].filter((index) => nextBoard[index] === null);
        const source = preferred.length > 0 ? preferred : emptyCells;
        const pick = source[Math.floor(Math.random() * source.length)];
        nextBoard[pick] = 'X';

        const nextResult = checkWinner(nextBoard);
        if (nextResult) {
          window.setTimeout(() => setResult(nextResult), 50);
        } else {
          window.setTimeout(() => setXTurn(false), 50);
        }

        return nextBoard;
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [autoPlay, xTurn, result]);

  useEffect(() => {
    if (!autoPlay || !result) return undefined;
    const timer = window.setTimeout(reset, 1500);
    return () => window.clearTimeout(timer);
  }, [autoPlay, result, reset]);

  const handleClick = (index) => {
    if (board[index] || !xTurn || result || autoPlay) return;

    const nextBoard = [...board];
    nextBoard[index] = 'X';
    setBoard(nextBoard);

    const nextResult = checkWinner(nextBoard);
    if (nextResult) {
      setResult(nextResult);
    } else {
      setXTurn(false);
    }
  };

  const statusText = result
    ? result.winner === 'draw' ? "It's a draw!" : `${result.winner} wins!`
    : xTurn ? 'Your turn (X)' : 'AI thinking...';

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center relative select-none p-4">
      <div className="absolute top-6 left-6 z-50">
        <a href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-xs tracking-wider bg-surface px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </a>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => {
            setAutoPlay((prev) => !prev);
            reset();
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono uppercase text-xs tracking-wider transition-all backdrop-blur-md ${autoPlay ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'}`}
        >
          {autoPlay ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          {autoPlay ? 'AI MODE' : 'MANUAL'}
        </button>
      </div>

      <h1 className="text-4xl font-heading font-extrabold text-white mb-2">
        Tic Tac <span className="text-primary">Toe</span>
      </h1>
      <p className="text-muted font-mono text-sm mb-8">{statusText}</p>

      <div className="grid grid-cols-3 gap-3 w-72 h-72">
        {board.map((cell, index) => {
          const inWinLine = result?.line?.includes(index);

          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={`
                w-full h-full rounded-xl text-4xl font-bold font-heading transition-all duration-200 border
                ${inWinLine ? 'bg-primary/20 border-primary scale-105 shadow-[0_0_20px_rgba(247,147,26,0.4)]' : 'bg-surface border-white/5 hover:border-white/20 hover:bg-surface/80 active:scale-95'}
                ${cell === 'X' ? 'text-tertiary' : cell === 'O' ? 'text-primary' : 'text-transparent'}
              `}
            >
              {cell || '.'}
            </button>
          );
        })}
      </div>

      <button onClick={reset} className="mt-8 px-8 py-2 font-mono text-sm text-muted border border-white/10 rounded-full hover:border-primary/50 hover:text-primary transition-all tracking-widest uppercase">
        Reset
      </button>
    </div>
  );
}
