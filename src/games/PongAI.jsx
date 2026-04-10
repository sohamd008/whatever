import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bot, User } from 'lucide-react';

export default function PongAI() {
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(false);

  useEffect(() => { autoRef.current = autoPlay; }, [autoPlay]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const paddleH = 80, paddleW = 12, ballR = 8;
    let player = { y: H / 2 - paddleH / 2 };
    let ai = { y: H / 2 - paddleH / 2 };
    let ball = { x: W / 2, y: H / 2, vx: 5, vy: 3 };
    let pScore = 0, aScore = 0;
    let animId;

    const keys = {};
    const onKeyDown = (e) => { keys[e.code] = true; };
    const onKeyUp = (e) => { keys[e.code] = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Touch
    let touchY = null;
    const onTouchMove = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      touchY = ((e.touches[0].clientY - rect.top) / rect.height) * H;
    };
    const onTouchEnd = () => { touchY = null; };
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    function resetBall(dir) {
      ball.x = W / 2;
      ball.y = H / 2;
      const angle = (Math.random() - 0.5) * Math.PI / 3;
      const speed = 5;
      ball.vx = Math.cos(angle) * speed * dir;
      ball.vy = Math.sin(angle) * speed;
    }

    function loop() {
      // Player input
      const speed = 6;
      if (!autoRef.current) {
        if (keys['ArrowUp'] || keys['KeyW']) player.y -= speed;
        if (keys['ArrowDown'] || keys['KeyS']) player.y += speed;
        if (touchY !== null) {
          const target = touchY - paddleH / 2;
          player.y += (target - player.y) * 0.2;
        }
      } else {
        // Auto-player: track ball with slight imperfection
        const target = ball.y - paddleH / 2;
        player.y += (target - player.y) * 0.08;
      }
      player.y = Math.max(0, Math.min(H - paddleH, player.y));

      // AI opponent
      const aiTarget = ball.y - paddleH / 2;
      const aiSpeed = 0.06 + Math.min(0.04, (pScore + aScore) * 0.003); // gets harder
      ai.y += (aiTarget - ai.y) * aiSpeed;
      ai.y = Math.max(0, Math.min(H - paddleH, ai.y));

      // Ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Top/bottom bounce
      if (ball.y - ballR <= 0 || ball.y + ballR >= H) ball.vy *= -1;

      // Player paddle collision (left)
      if (ball.x - ballR <= paddleW + 10 && ball.y >= player.y && ball.y <= player.y + paddleH) {
        ball.vx = Math.abs(ball.vx) * 1.05;
        const hit = (ball.y - (player.y + paddleH / 2)) / (paddleH / 2);
        ball.vy = hit * 6;
      }

      // AI paddle collision (right)
      if (ball.x + ballR >= W - paddleW - 10 && ball.y >= ai.y && ball.y <= ai.y + paddleH) {
        ball.vx = -Math.abs(ball.vx) * 1.05;
        const hit = (ball.y - (ai.y + paddleH / 2)) / (paddleH / 2);
        ball.vy = hit * 6;
      }

      // Score
      if (ball.x < 0) { aScore++; setAiScore(aScore); resetBall(1); }
      if (ball.x > W) { pScore++; setPlayerScore(pScore); resetBall(-1); }

      // Clamp ball speed
      const maxV = 12;
      ball.vx = Math.max(-maxV, Math.min(maxV, ball.vx));
      ball.vy = Math.max(-maxV, Math.min(maxV, ball.vy));

      // --- Draw ---
      ctx.fillStyle = '#030304';
      ctx.fillRect(0, 0, W, H);

      // Dotted center line
      ctx.setLineDash([8, 12]);
      ctx.strokeStyle = '#ffffff10';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.shadowBlur = 15;
      // Player paddle
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.fillRect(10, player.y, paddleW, paddleH);
      // AI paddle
      ctx.fillStyle = '#F7931A';
      ctx.shadowColor = '#F7931A';
      ctx.fillRect(W - paddleW - 10, ai.y, paddleW, paddleH);
      ctx.shadowBlur = 0;

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballR, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 20; ctx.shadowColor = '#FFD600';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Score
      ctx.font = 'bold 48px monospace';
      ctx.fillStyle = '#ffffff15';
      ctx.textAlign = 'center';
      ctx.fillText(pScore, W / 4, 60);
      ctx.fillText(aScore, 3 * W / 4, 60);
      ctx.textAlign = 'start';

      animId = requestAnimationFrame(loop);
    }

    resetBall(1);
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative select-none">
      <div className="absolute top-6 left-6 z-50">
        <a href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-xs tracking-wider bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </a>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono uppercase text-xs tracking-wider transition-all backdrop-blur-md ${autoPlay ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'}`}
        >
          {autoPlay ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          {autoPlay ? 'AI MODE' : 'MANUAL'}
        </button>
      </div>

      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold font-heading text-white">Pong <span className="text-primary">vs AI</span></h1>
        <p className="text-white/30 text-xs font-mono mt-1">W/S or ↑/↓ to move · Touch drag on mobile</p>
      </div>

      <div className="flex items-center gap-6 mb-4 font-mono">
        <div className="text-center">
          <p className="text-[10px] text-cyan-400 tracking-widest uppercase">You</p>
          <p className="text-3xl font-bold text-cyan-400">{playerScore}</p>
        </div>
        <span className="text-white/20 text-2xl">vs</span>
        <div className="text-center">
          <p className="text-[10px] text-primary tracking-widest uppercase">AI</p>
          <p className="text-3xl font-bold text-primary">{aiScore}</p>
        </div>
      </div>

      <div className="border border-white/10 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} width={700} height={500} className="block w-full max-w-[700px] h-auto bg-[#030304]" />
      </div>
    </div>
  );
}
