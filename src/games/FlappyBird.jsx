import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, Bot, User } from 'lucide-react';

export default function FlappyBird() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const stateRef = useRef({ aiMode: false });

  useEffect(() => { stateRef.current.aiMode = aiMode; }, [aiMode]);

  const startGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    let bird = { x: 80, y: H / 2, vy: 0, radius: 14 };
    let pipes = [];
    let frame = 0;
    let localScore = 0;
    let animId;
    const gravity = 0.45;
    const flapStrength = -7;
    const pipeGap = 150;
    const pipeWidth = 52;
    const pipeSpeed = 3;
    let dead = false;

    const flap = () => { if (!dead) bird.vy = flapStrength; };

    const onKey = (e) => { 
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') { 
        e.preventDefault(); flap(); 
      } 
    };
    const onTouch = (e) => { e.preventDefault(); flap(); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouch, { passive: false });
    window.addEventListener('mousedown', flap);

    function spawnPipe() {
      const minTop = 60;
      const maxTop = H - pipeGap - 60;
      const topH = Math.random() * (maxTop - minTop) + minTop;
      pipes.push({ x: W + 10, topH, scored: false });
    }

    function aiDecision() {
      // Find the next pipe ahead of the bird
      let targetPipe = null;
      for (const p of pipes) {
        if (p.x + pipeWidth > bird.x) { targetPipe = p; break; }
      }
      if (!targetPipe) return;
      const gapCenter = targetPipe.topH + pipeGap / 2;
      // Flap if bird is below center of gap (with some lookahead)
      if (bird.y > gapCenter - 10 || bird.vy > 4) {
        flap();
      }
    }

    function loop() {
      if (dead) return;
      frame++;

      // AI
      if (stateRef.current.aiMode && frame % 4 === 0) aiDecision();

      // Spawn pipes
      if (frame % 90 === 0) spawnPipe();

      // Physics
      bird.vy += gravity;
      bird.y += bird.vy;

      // Pipe movement & collision  
      for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= pipeSpeed;
        if (p.x + pipeWidth < 0) { pipes.splice(i, 1); continue; }

        // Score
        if (!p.scored && p.x + pipeWidth < bird.x) {
          p.scored = true;
          localScore++;
          setScore(localScore);
        }

        // Collision
        if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + pipeWidth) {
          if (bird.y - bird.radius < p.topH || bird.y + bird.radius > p.topH + pipeGap) {
            dead = true; setGameOver(true); return;
          }
        }
      }

      // Ceiling/floor
      if (bird.y + bird.radius >= H || bird.y - bird.radius <= 0) {
        dead = true; setGameOver(true); return;
      }

      // --- Draw ---
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#0a0a12');
      grad.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Ground line
      ctx.strokeStyle = '#F7931A33';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, H - 1); ctx.lineTo(W, H - 1); ctx.stroke();

      // Pipes
      pipes.forEach(p => {
        // Top pipe
        ctx.fillStyle = '#EA580C';
        ctx.shadowBlur = 12; ctx.shadowColor = '#F7931A';
        ctx.fillRect(p.x, 0, pipeWidth, p.topH);
        ctx.fillRect(p.x - 4, p.topH - 16, pipeWidth + 8, 16);
        // Bottom pipe
        const botY = p.topH + pipeGap;
        ctx.fillRect(p.x, botY, pipeWidth, H - botY);
        ctx.fillRect(p.x - 4, botY, pipeWidth + 8, 16);
        ctx.shadowBlur = 0;
      });

      // Bird
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD600';
      ctx.shadowBlur = 20; ctx.shadowColor = '#FFD600';
      ctx.fill();
      ctx.shadowBlur = 0;
      // Eye
      ctx.beginPath();
      ctx.arc(bird.x + 5, bird.y - 3, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#030304';
      ctx.fill();
      // Beak
      ctx.beginPath();
      ctx.moveTo(bird.x + bird.radius, bird.y);
      ctx.lineTo(bird.x + bird.radius + 8, bird.y + 3);
      ctx.lineTo(bird.x + bird.radius, bird.y + 6);
      ctx.fillStyle = '#F7931A';
      ctx.fill();

      // Score HUD
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(localScore, W / 2, 50);
      ctx.textAlign = 'start';

      animId = requestAnimationFrame(loop);
    }

    spawnPipe();
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('mousedown', flap);
    };
  }, [started, gameOver]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative select-none">
      <div className="absolute top-6 left-6 z-50">
        <a href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-xs tracking-wider bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </a>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setAiMode(!aiMode)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono uppercase text-xs tracking-wider transition-all backdrop-blur-md ${aiMode ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'}`}
        >
          {aiMode ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          {aiMode ? 'AI MODE' : 'MANUAL'}
        </button>
      </div>

      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold font-heading text-primary">Flappy Bird</h1>
        <p className="text-white/30 text-xs font-mono mt-1">SPACE / TAP to flap</p>
      </div>

      <div className="relative border border-white/10 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} width={400} height={600} className="block bg-[#0a0a12] w-full max-w-[400px] h-auto" />

        {!started && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
            <p className="text-white/60 font-mono mb-6 text-sm">Tap or press SPACE to flap</p>
            <button onClick={startGame} className="px-10 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow font-mono">
              START
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <h2 className="text-4xl font-heading font-bold text-red-500 mb-2">GAME OVER</h2>
            <p className="text-white/60 font-mono text-lg mb-6">Score: {score}</p>
            <button onClick={startGame} className="px-10 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow font-mono">
              RETRY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
