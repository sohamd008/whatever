import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';

const COLS = 8, ROWS = 6, CELL = 28;
const BALL_R = 6, PADDLE_W = 80, PADDLE_H = 12;
const COLORS = ['#F7931A', '#06b6d4', '#a855f7', '#22c55e', '#FFD600', '#ef4444'];

export default function Breakout() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const restart = useCallback(() => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => {
    if (gameOver || won) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W = 320, H = 400;
    let ball = { x: W / 2, y: H - 40, dx: 3, dy: -3 };
    let paddle = { x: W / 2 - PADDLE_W / 2, y: H - 30, w: PADDLE_W };
    let bricks = [];
    let pressed = {};

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (r < 3 + level) {
          bricks.push({ x: c * CELL + 8, y: r * CELL + 60, w: CELL - 4, h: CELL - 4, color: COLORS[(r + c) % COLORS.length], active: true });
        }
      }
    }

    const onKey = (e) => { pressed[e.code] = e.type === 'keydown'; };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    let lastTime = 0;
    function loop(time) {
      if (gameOver || won) return;
      if (time - lastTime < 16) { requestAnimationFrame(loop); return; }
      lastTime = time;

      if (pressed['ArrowLeft'] || pressed['KeyA']) paddle.x = Math.max(0, paddle.x - 8);
      if (pressed['ArrowRight'] || pressed['KeyD']) paddle.x = Math.min(W - paddle.w, paddle.x + 8);

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x <= BALL_R || ball.x >= W - BALL_R) ball.dx *= -1;
      if (ball.y <= BALL_R) ball.dy *= -1;
      if (ball.y >= H - BALL_R) {
        setGameOver(true);
        return;
      }

      if (ball.y + BALL_R >= paddle.y && ball.y - BALL_R <= paddle.y + PADDLE_H && ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
        ball.dy = -Math.abs(ball.dy);
        const hitPos = (ball.x - paddle.x) / paddle.w;
        ball.dx = (hitPos - 0.5) * 8;
      }

      bricks.forEach((b) => {
        if (!b.active) return;
        if (ball.x + BALL_R > b.x && ball.x - BALL_R < b.x + b.w && ball.y + BALL_R > b.y && ball.y - BALL_R < b.y + b.h) {
          b.active = false;
          setScore(s => s + 10);
          ball.dy *= -1;
        }
      });

      if (bricks.filter(b => b.active).length === 0) {
        if (level < 3) {
          setLevel(l => l + 1);
          ball.x = W / 2;
          ball.y = H - 40;
          ball.dy = -3;
          bricks.forEach(b => {
            if (b.y < 120) b.active = true;
          });
        } else {
          setWon(true);
          return;
        }
      }

      ctx.fillStyle = '#030304';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#ffffff08';
      for (let c = 0; c <= COLS; c++) {
        ctx.fillRect(c * CELL + 4, 40, 1, H - 60);
      }

      bricks.forEach(b => {
        if (!b.active) return;
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
      });
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(paddle.x, paddle.y, paddle.w, PADDLE_H);

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, [gameOver, won, level]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative select-none">
      <div className="absolute top-6 left-6 z-50">
        <a href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-xs tracking-wider bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </a>
      </div>

      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold font-heading text-white">Brea<span className="text-primary">kout</span></h1>
        <p className="text-white/30 text-xs font-mono mt-1">A/D or Arrows to move · Break all bricks</p>
      </div>

      <div className="mb-4 flex gap-8">
        <div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Score</p>
          <p className="text-2xl font-bold font-mono text-primary">{score}</p>
        </div>
        <div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Level</p>
          <p className="text-2xl font-bold font-mono text-tertiary">{level}</p>
        </div>
      </div>

      <div className="relative border border-white/10 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} width={320} height={400} className="block bg-[#030304]" />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <h2 className="text-4xl font-heading font-bold text-red-500 mb-2">GAME OVER</h2>
            <p className="text-white/60 font-mono text-lg mb-6">Score: {score}</p>
            <button onClick={restart} className="px-10 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow font-mono">
              RETRY
            </button>
          </div>
        )}

        {won && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <h2 className="text-4xl font-heading font-bold text-tertiary mb-2">VICTORY</h2>
            <p className="text-white/60 font-mono text-lg mb-6">Score: {score}</p>
            <button onClick={restart} className="px-10 py-3 bg-gradient-to-r from-tertiary to-primary text-black font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-gold-glow font-mono">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}