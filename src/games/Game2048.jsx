import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Bot, User } from 'lucide-react';

function createGrid() {
  return Array(4).fill(null).map(() => Array(4).fill(0));
}

function addRandom(grid) {
  const empty = [];
  grid.forEach((row, r) => row.forEach((val, c) => { if (val === 0) empty.push([r, c]); }));
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function clone(grid) { return grid.map(r => [...r]); }

function slide(row) {
  let arr = row.filter(v => v !== 0);
  let score = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) { arr[i] *= 2; score += arr[i]; arr.splice(i + 1, 1); }
  }
  while (arr.length < 4) arr.push(0);
  return { row: arr, score };
}

function moveGrid(grid, dir) {
  let g = clone(grid);
  let totalScore = 0;
  let moved = false;

  if (dir === 'left') {
    for (let r = 0; r < 4; r++) { const { row, score } = slide(g[r]); if (g[r].some((v, i) => v !== row[i])) moved = true; g[r] = row; totalScore += score; }
  } else if (dir === 'right') {
    for (let r = 0; r < 4; r++) { const { row, score } = slide([...g[r]].reverse()); row.reverse(); if (g[r].some((v, i) => v !== row[i])) moved = true; g[r] = row; totalScore += score; }
  } else if (dir === 'up') {
    for (let c = 0; c < 4; c++) {
      const col = [g[0][c], g[1][c], g[2][c], g[3][c]];
      const { row, score } = slide(col);
      if (col.some((v, i) => v !== row[i])) moved = true;
      for (let r = 0; r < 4; r++) g[r][c] = row[r];
      totalScore += score;
    }
  } else if (dir === 'down') {
    for (let c = 0; c < 4; c++) {
      const col = [g[3][c], g[2][c], g[1][c], g[0][c]];
      const { row, score } = slide(col);
      row.reverse();
      const orig = [g[0][c], g[1][c], g[2][c], g[3][c]];
      if (orig.some((v, i) => v !== row[i])) moved = true;
      for (let r = 0; r < 4; r++) g[r][c] = row[r];
      totalScore += score;
    }
  }

  return { grid: g, score: totalScore, moved };
}

function canMove(grid) {
  for (const dir of ['left', 'right', 'up', 'down']) {
    if (moveGrid(grid, dir).moved) return true;
  }
  return false;
}

// AI: Simple expectimax heuristic
function aiPickMove(grid) {
  const dirs = ['left', 'right', 'up', 'down'];
  let bestDir = 'left', bestScore = -1;
  for (const dir of dirs) {
    const { grid: g, score, moved } = moveGrid(grid, dir);
    if (!moved) continue;
    // Evaluate: score + monotonicity + empty tiles
    const empty = g.flat().filter(v => v === 0).length;
    const maxTile = Math.max(...g.flat());
    const cornerBonus = g[3][0] === maxTile ? 100 : 0;
    const eval_ = score + empty * 15 + cornerBonus;
    if (eval_ > bestScore) { bestScore = eval_; bestDir = dir; }
  }
  return bestDir;
}

const TILE_COLORS = {
  0: 'bg-white/5', 2: 'bg-white/10 text-white', 4: 'bg-white/15 text-white',
  8: 'bg-orange-900/60 text-white', 16: 'bg-orange-800/70 text-white',
  32: 'bg-orange-700/80 text-white', 64: 'bg-orange-600 text-white',
  128: 'bg-yellow-500/80 text-white text-2xl', 256: 'bg-yellow-400/80 text-[#030304] text-2xl',
  512: 'bg-yellow-300 text-[#030304] text-2xl', 1024: 'bg-primary text-[#030304] text-xl',
  2048: 'bg-tertiary text-[#030304] text-xl font-extrabold',
};

export default function Game2048() {
  const [grid, setGrid] = useState(() => { const g = createGrid(); addRandom(g); addRandom(g); return g; });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(false);
  const gridRef = useRef(grid);

  useEffect(() => { autoRef.current = autoPlay; }, [autoPlay]);
  useEffect(() => { gridRef.current = grid; }, [grid]);

  const doMove = useCallback((dir) => {
    setGrid(prev => {
      const { grid: newG, score: pts, moved } = moveGrid(prev, dir);
      if (!moved) return prev;
      addRandom(newG);
      setScore(s => s + pts);
      if (newG.flat().includes(2048) && !won) setWon(true);
      if (!canMove(newG)) setTimeout(() => setGameOver(true), 200);
      return newG;
    });
  }, [won]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (autoRef.current) return;
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', KeyA: 'left', KeyD: 'right', KeyW: 'up', KeyS: 'down' };
      if (map[e.code]) { e.preventDefault(); doMove(map[e.code]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doMove]);

  // Touch swipe
  useEffect(() => {
    let sx = 0, sy = 0;
    const onStart = (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onEnd = (e) => {
      if (autoRef.current) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > Math.abs(dy)) { if (Math.abs(dx) > 30) doMove(dx > 0 ? 'right' : 'left'); }
      else { if (Math.abs(dy) > 30) doMove(dy > 0 ? 'down' : 'up'); }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd);
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [doMove]);

  // AI auto-play
  useEffect(() => {
    if (!autoPlay || gameOver) return;
    const interval = setInterval(() => {
      const dir = aiPickMove(gridRef.current);
      doMove(dir);
    }, 120);
    return () => clearInterval(interval);
  }, [autoPlay, gameOver, doMove]);

  const restart = () => {
    const g = createGrid(); addRandom(g); addRandom(g);
    setGrid(g); setScore(0); setGameOver(false); setWon(false);
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center relative select-none p-4">
      <div className="absolute top-6 left-6 z-50">
        <a href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-xs tracking-wider bg-surface px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </a>
      </div>
      <div className="absolute top-6 right-6 z-50">
        <button onClick={() => setAutoPlay(!autoPlay)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono uppercase text-xs tracking-wider transition-all backdrop-blur-md ${autoPlay ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'}`}>
          {autoPlay ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          {autoPlay ? 'AI MODE' : 'MANUAL'}
        </button>
      </div>

      <h1 className="text-5xl font-heading font-extrabold text-white mb-2">
        <span className="text-primary">2048</span>
      </h1>
      <div className="flex gap-6 mb-6 font-mono">
        <div className="text-center"><p className="text-[10px] text-muted tracking-widest uppercase">Score</p><p className="text-2xl font-bold text-primary">{score}</p></div>
      </div>

      <div className="grid grid-cols-4 gap-2 bg-surface p-3 rounded-2xl border border-white/5 w-80 h-80">
        {grid.flat().map((val, i) => (
          <div key={i} className={`flex items-center justify-center rounded-xl font-bold font-heading text-lg transition-all duration-100 ${TILE_COLORS[val] || 'bg-primary text-[#030304] text-lg'}`}>
            {val > 0 ? val : ''}
          </div>
        ))}
      </div>

      <button onClick={restart} className="mt-6 px-8 py-2 font-mono text-sm text-muted border border-white/10 rounded-full hover:border-primary/50 hover:text-primary transition-all tracking-widest uppercase">
        New Game
      </button>

      {gameOver && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <h2 className="text-4xl font-heading font-bold text-red-500 mb-2">Game Over</h2>
          <p className="text-white font-mono text-lg mb-6">Final Score: {score}</p>
          <button onClick={restart} className="px-10 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow font-mono">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
