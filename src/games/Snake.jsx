import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Bot, User } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_COUNT = 20;

export default function Snake() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(false);

  useEffect(() => { autoRef.current = autoPlay; }, [autoPlay]);

  const restart = useCallback(() => {
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 1, dy = 0;
    let nextDx = 1, nextDy = 0;
    let localScore = 0;
    let animId;
    let lastTime = 0;
    const speed = 100; // ms

    function spawnFood() {
      food = {
        x: Math.floor(Math.random() * CELL_COUNT),
        y: Math.floor(Math.random() * CELL_COUNT)
      };
      // Don't spawn on snake
      if (snake.some(s => s.x === food.x && s.y === food.y)) spawnFood();
    }

    const onKey = (e) => {
      if (autoRef.current) return;
      if (e.code === 'ArrowUp' && dy === 0) { nextDx = 0; nextDy = -1; }
      if (e.code === 'ArrowDown' && dy === 0) { nextDx = 0; nextDy = 1; }
      if (e.code === 'ArrowLeft' && dx === 0) { nextDx = -1; nextDy = 0; }
      if (e.code === 'ArrowRight' && dx === 0) { nextDx = 1; nextDy = 0; }
    };
    window.addEventListener('keydown', onKey);

    function aiMove() {
      const head = snake[0];
      const targetDx = Math.sign(food.x - head.x);
      const targetDy = Math.sign(food.y - head.y);

      // Try to move towards food
      const options = [
        { x: targetDx, y: 0 },
        { x: 0, y: targetDy },
        { x: -targetDx, y: 0 },
        { x: 0, y: -targetDy }
      ].filter(opt => {
        // Basic wall/body collision check
        const nx = head.x + opt.x;
        const ny = head.y + opt.y;
        if (nx < 0 || nx >= CELL_COUNT || ny < 0 || ny >= CELL_COUNT) return false;
        if (snake.some(s => s.x === nx && s.y === ny)) return false;
        // Don't reverse
        if (opt.x === -dx && opt.y === -dy) return false;
        return true;
      });

      if (options.length > 0) {
        // Prefer move towards food
        const best = options.find(opt => (opt.x === targetDx && targetDx !== 0) || (opt.y === targetDy && targetDy !== 0)) || options[0];
        nextDx = best.x;
        nextDy = best.y;
      }
    }

    function loop(time) {
      if (time - lastTime < speed) {
        animId = requestAnimationFrame(loop);
        return;
      }
      lastTime = time;

      if (autoRef.current) aiMove();
      dx = nextDx; dy = nextDy;

      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall collision
      if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
        setGameOver(true);
        return;
      }

      // Body collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        localScore += 10;
        setScore(localScore);
        spawnFood();
      } else {
        snake.pop();
      }

      // Draw
      ctx.fillStyle = '#030304';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#ffffff05';
      for (let i = 0; i <= CELL_COUNT; i++) {
        ctx.beginPath(); ctx.moveTo(i * GRID_SIZE, 0); ctx.lineTo(i * GRID_SIZE, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * GRID_SIZE); ctx.lineTo(canvas.width, i * GRID_SIZE); ctx.stroke();
      }

      // Food
      ctx.fillStyle = '#F7931A';
      ctx.shadowBlur = 10; ctx.shadowColor = '#F7931A';
      ctx.fillRect(food.x * GRID_SIZE + 2, food.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);

      // Snake
      ctx.shadowBlur = 0;
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#06b6d4' : '#06b6d488';
        ctx.fillRect(s.x * GRID_SIZE + 1, s.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
      });

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('keydown', onKey);
      cancelAnimationFrame(animId);
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
        <h1 className="text-3xl font-bold font-heading text-white">Sna<span className="text-primary">ke</span></h1>
        <p className="text-white/30 text-xs font-mono mt-1">Arrow keys to move · Watch the AI chase the code</p>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold font-mono text-primary">{score}</p>
      </div>

      <div className="relative border border-white/10 rounded-xl overflow-hidden shadow-elevation">
        <canvas ref={canvasRef} width={400} height={400} className="block bg-[#030304]" />

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <h2 className="text-4xl font-heading font-bold text-red-500 mb-2">CRASHED</h2>
            <p className="text-white/60 font-mono text-lg mb-6">Score: {score}</p>
            <button onClick={restart} className="px-10 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow font-mono">
              RETRY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
