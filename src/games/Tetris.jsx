import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Bot, User } from 'lucide-react';

const COLS = 10, ROWS = 20, SZ = 28;
const SHAPES = [
  { shape: [[1,1,1,1]], color: '#06b6d4' },           // I
  { shape: [[1,1],[1,1]], color: '#FFD600' },          // O
  { shape: [[0,1,0],[1,1,1]], color: '#a855f7' },      // T
  { shape: [[1,0,0],[1,1,1]], color: '#F7931A' },      // L
  { shape: [[0,0,1],[1,1,1]], color: '#3b82f6' },      // J
  { shape: [[0,1,1],[1,1,0]], color: '#22c55e' },      // S
  { shape: [[1,1,0],[0,1,1]], color: '#ef4444' },      // Z
];

function createBoard() { return Array.from({ length: ROWS }, () => Array(COLS).fill(null)); }

function rotate(shape) {
  const rows = shape.length, cols = shape[0].length;
  return Array.from({ length: cols }, (_, c) => Array.from({ length: rows }, (_, r) => shape[rows - 1 - r][c]));
}

function fits(board, shape, ox, oy) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const x = ox + c, y = oy + r;
      if (x < 0 || x >= COLS || y >= ROWS) return false;
      if (y >= 0 && board[y][x]) return false;
    }
  }
  return true;
}

function place(board, shape, ox, oy, color) {
  const b = board.map(r => [...r]);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] && oy + r >= 0) b[oy + r][ox + c] = color;
    }
  }
  return b;
}

function clearLines(board) {
  let cleared = 0;
  const b = board.filter(row => { if (row.every(c => c)) { cleared++; return false; } return true; });
  while (b.length < ROWS) b.unshift(Array(COLS).fill(null));
  return { board: b, cleared };
}

// AI: evaluate board state
function evaluate(board) {
  let score = 0;
  // Penalize height
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (board[r][c]) { score -= (ROWS - r) * 2; break; }
    }
  }
  // Penalize holes
  for (let c = 0; c < COLS; c++) {
    let found = false;
    for (let r = 0; r < ROWS; r++) {
      if (board[r][c]) found = true;
      else if (found) score -= 8;
    }
  }
  // Reward complete lines
  for (const row of board) {
    if (row.every(c => c)) score += 30;
  }
  // Smooth surface
  for (let c = 0; c < COLS - 1; c++) {
    let h1 = ROWS, h2 = ROWS;
    for (let r = 0; r < ROWS; r++) { if (board[r][c]) { h1 = r; break; } }
    for (let r = 0; r < ROWS; r++) { if (board[r][c + 1]) { h2 = r; break; } }
    score -= Math.abs(h1 - h2) * 1.5;
  }
  return score;
}

function aiBest(board, piece) {
  let bestScore = -Infinity, bestX = 0, bestRot = piece.shape;
  let shape = piece.shape;
  for (let rot = 0; rot < 4; rot++) {
    for (let x = -2; x < COLS; x++) {
      // Drop
      let y = -2;
      while (fits(board, shape, x, y + 1)) y++;
      if (!fits(board, shape, x, y)) continue;
      const b = place(board, shape, x, y, piece.color);
      const { board: cleared } = clearLines(b);
      const s = evaluate(cleared);
      if (s > bestScore) { bestScore = s; bestX = x; bestRot = shape; }
    }
    shape = rotate(shape);
  }
  return { x: bestX, shape: bestRot };
}

export default function Tetris() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(false);

  useEffect(() => { autoRef.current = autoPlay; }, [autoPlay]);

  const restart = useCallback(() => { setScore(0); setLines(0); setGameOver(false); }, []);

  useEffect(() => {
    if (gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let board = createBoard();
    let piece = null;
    let px = 0, py = 0;
    let localScore = 0, localLines = 0;
    let dropTimer = 0;
    let animId;
    let dead = false;
    let aiTarget = null;

    function newPiece() {
      const p = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      piece = { shape: [...p.shape.map(r => [...r])], color: p.color };
      px = Math.floor((COLS - piece.shape[0].length) / 2);
      py = -1;
      aiTarget = null;
      if (!fits(board, piece.shape, px, py)) { dead = true; setGameOver(true); }
    }

    function lock() {
      board = place(board, piece.shape, px, py, piece.color);
      const { board: b, cleared } = clearLines(board);
      board = b;
      localLines += cleared;
      localScore += [0, 100, 300, 500, 800][cleared] || 0;
      setScore(localScore);
      setLines(localLines);
      newPiece();
    }

    newPiece();

    const keys = {};
    const onKeyDown = (e) => {
      if (autoRef.current) return;
      keys[e.code] = true;
      if ((e.code === 'ArrowUp' || e.code === 'KeyW') && piece) {
        const rotated = rotate(piece.shape);
        if (fits(board, rotated, px, py)) piece.shape = rotated;
      }
      if (e.code === 'Space' && piece) {
        while (fits(board, piece.shape, px, py + 1)) py++;
        lock();
      }
    };
    const onKeyUp = (e) => { keys[e.code] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Touch
    let touchX = 0;
    const onTouchStart = (e) => { touchX = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
      if (autoRef.current || !piece) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) < 20) {
        // Tap = rotate
        const rotated = rotate(piece.shape);
        if (fits(board, rotated, px, py)) piece.shape = rotated;
      } else if (dx > 0 && fits(board, piece.shape, px + 1, py)) {
        px++;
      } else if (dx < 0 && fits(board, piece.shape, px - 1, py)) {
        px--;
      }
    };
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    let lastTime = 0;
    const dropInterval = () => Math.max(80, 500 - localLines * 15);

    function loop(time) {
      if (dead) return;
      const dt = time - lastTime;
      lastTime = time;
      dropTimer += dt;

      // Manual movement
      if (!autoRef.current && piece) {
        if (keys['ArrowLeft'] || keys['KeyA']) { if (fits(board, piece.shape, px - 1, py)) px--; keys['ArrowLeft'] = false; keys['KeyA'] = false; }
        if (keys['ArrowRight'] || keys['KeyD']) { if (fits(board, piece.shape, px + 1, py)) px++; keys['ArrowRight'] = false; keys['KeyD'] = false; }
        if (keys['ArrowDown'] || keys['KeyS']) { if (fits(board, piece.shape, px, py + 1)) py++; }
      }

      // AI control
      if (autoRef.current && piece) {
        if (!aiTarget) aiTarget = aiBest(board, piece);
        // Rotate towards target
        if (JSON.stringify(piece.shape) !== JSON.stringify(aiTarget.shape)) {
          const rotated = rotate(piece.shape);
          if (fits(board, rotated, px, py)) piece.shape = rotated;
        }
        // Move horizontally
        if (px < aiTarget.x && fits(board, piece.shape, px + 1, py)) px++;
        else if (px > aiTarget.x && fits(board, piece.shape, px - 1, py)) px--;
      }

      // Drop
      if (dropTimer >= (autoRef.current ? Math.max(30, dropInterval() / 3) : dropInterval())) {
        dropTimer = 0;
        if (fits(board, piece.shape, px, py + 1)) {
          py++;
        } else {
          lock();
        }
      }

      // --- Draw ---
      const cw = COLS * SZ, ch = ROWS * SZ;
      ctx.fillStyle = '#030304';
      ctx.fillRect(0, 0, cw, ch);

      // Grid lines
      ctx.strokeStyle = '#ffffff06';
      ctx.lineWidth = 1;
      for (let r = 0; r <= ROWS; r++) { ctx.beginPath(); ctx.moveTo(0, r * SZ); ctx.lineTo(cw, r * SZ); ctx.stroke(); }
      for (let c = 0; c <= COLS; c++) { ctx.beginPath(); ctx.moveTo(c * SZ, 0); ctx.lineTo(c * SZ, ch); ctx.stroke(); }

      // Board
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (board[r][c]) {
            ctx.fillStyle = board[r][c];
            ctx.fillRect(c * SZ + 1, r * SZ + 1, SZ - 2, SZ - 2);
          }
        }
      }

      // Ghost piece
      if (piece) {
        let gy = py;
        while (fits(board, piece.shape, px, gy + 1)) gy++;
        for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c] && gy + r >= 0) {
              ctx.fillStyle = piece.color + '22';
              ctx.fillRect((px + c) * SZ + 1, (gy + r) * SZ + 1, SZ - 2, SZ - 2);
            }
          }
        }
      }

      // Current piece
      if (piece) {
        for (let r = 0; r < piece.shape.length; r++) {
          for (let c = 0; c < piece.shape[r].length; c++) {
            if (piece.shape[r][c] && py + r >= 0) {
              ctx.fillStyle = piece.color;
              ctx.shadowBlur = 8; ctx.shadowColor = piece.color;
              ctx.fillRect((px + c) * SZ + 1, (py + r) * SZ + 1, SZ - 2, SZ - 2);
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [gameOver]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative select-none">
      <div className="absolute top-6 left-6 z-50">
        <a href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-xs tracking-wider bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
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

      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold font-heading text-white">Tet<span className="text-primary">ris</span></h1>
        <p className="text-white/30 text-xs font-mono mt-1">← → move · ↑ rotate · SPACE hard drop · Swipe on mobile</p>
      </div>

      <div className="flex gap-4 mb-4 font-mono text-center">
        <div><p className="text-[10px] text-muted tracking-widest">SCORE</p><p className="text-2xl font-bold text-primary">{score}</p></div>
        <div><p className="text-[10px] text-muted tracking-widest">LINES</p><p className="text-2xl font-bold text-tertiary">{lines}</p></div>
      </div>

      <div className="relative border border-white/10 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} width={COLS * SZ} height={ROWS * SZ} className="block bg-[#030304]" style={{ imageRendering: 'pixelated' }} />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <h2 className="text-4xl font-heading font-bold text-red-500 mb-2">GAME OVER</h2>
            <p className="text-white/60 font-mono text-lg mb-2">Score: {score}</p>
            <p className="text-white/40 font-mono text-sm mb-6">Lines: {lines}</p>
            <button onClick={restart} className="px-10 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow font-mono">
              RETRY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
