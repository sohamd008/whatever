import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NeonBreakout() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Game state
    let ballRadius = 8;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    let dy = -4;
    
    // Paddle state
    let paddleHeight = 12;
    let paddleWidth = 100;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    
    // Blocks
    let blockRowCount = 5;
    let blockColumnCount = 9;
    let blockWidth = 75;
    let blockHeight = 20;
    let blockPadding = 10;
    let blockOffsetTop = 50;
    let blockOffsetLeft = 25;
    let blocks = [];
    
    for (let c = 0; c < blockColumnCount; c++) {
      blocks[c] = [];
      for (let r = 0; r < blockRowCount; r++) {
        blocks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    
    let particles = [];
    let animationFrameId;

    const keyDownHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = true;
    };
    
    const keyUpHandler = (e) => {
      if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = false;
    };
    
    const mouseMoveHandler = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const relativeX = (e.clientX - rect.left) * scaleX;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };
    
    const touchMoveHandler = (e) => {
      e.preventDefault(); // prevent scroll
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const relativeX = (e.touches[0].clientX - rect.left) * scaleX;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);
    canvas.addEventListener("mousemove", mouseMoveHandler, false);
    canvas.addEventListener("touchmove", touchMoveHandler, { passive: false });

    const createExplosion = (ex, ey) => {
      for(let i=0; i<15; i++) {
        particles.push({
          x: ex,
          y: ey,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 1,
          color: Math.random() > 0.5 ? '#F7931A' : '#FFD600'
        });
      }
    };

    const collisionDetection = () => {
      for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
          let b = blocks[c][r];
          if (b.status === 1) {
            if (x > b.x && x < b.x + blockWidth && y > b.y && y < b.y + blockHeight) {
              dy = -dy;
              b.status = 0;
              setScore(s => s + 10);
              createExplosion(b.x + blockWidth/2, b.y + blockHeight/2);
              
              // Win condition
              let activeBlocks = 0;
              for(let i=0; i<blockColumnCount; i++) {
                for(let j=0; j<blockRowCount; j++) {
                   if(blocks[i][j].status === 1) activeBlocks++;
                }
              }
              if(activeBlocks === 0) {
                 setWin(true);
                 cancelAnimationFrame(animationFrameId);
                 return true;
              }
            }
          }
        }
      }
      return false;
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#FFD600";
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#F7931A";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#EA580C";
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.closePath();
    };

    const drawBlocks = () => {
      for (let c = 0; c < blockColumnCount; c++) {
        for (let r = 0; r < blockRowCount; r++) {
          if (blocks[c][r].status === 1) {
            const blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
            const blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
            blocks[c][r].x = blockX;
            blocks[c][r].y = blockY;
            
            ctx.beginPath();
            ctx.rect(blockX, blockY, blockWidth, blockHeight);
            ctx.fillStyle = r % 2 === 0 ? "#FFD600" : "#EA580C";
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.closePath();
          }
        }
      }
    };

    const drawParticles = () => {
       particles.forEach((p, index) => {
         p.x += p.vx;
         p.y += p.vy;
         p.life -= 0.03;
         if(p.life <= 0) {
            particles.splice(index, 1);
         } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();
            ctx.globalAlpha = 1.0;
            ctx.closePath();
         }
       });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawBlocks();
      drawBall();
      drawPaddle();
      drawParticles();
      
      if(collisionDetection()) return;

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
          // Add spin
          dx = dx + ((x - (paddleX + paddleWidth/2)) * 0.1); 
        } else {
          setGameOver(true);
          cancelAnimationFrame(animationFrameId);
          return;
        }
      }

      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      x += dx;
      y += dy;
      
      animationFrameId = requestAnimationFrame(draw);
    };

    if(!gameOver && !win) {
       draw();
    }

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
      canvas.removeEventListener("mousemove", mouseMoveHandler);
      canvas.removeEventListener("touchmove", touchMoveHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, win]);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface to-background">
      <div className="absolute top-8 left-8 z-50">
        <Link to="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-sm tracking-wider bg-surface px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </Link>
      </div>

      <div className="mb-8 text-center text-white font-mono">
        <h1 className="text-4xl text-primary font-bold mb-2 text-glow">Neon Breakout</h1>
        <p className="text-lg">Score: {score}</p>
        <p className="text-muted text-sm mt-2">Use Mouse or Left/Right Arrows</p>
      </div>

      <div className="p-2 bg-surface/50 border border-white/10 rounded-2xl shadow-elevation backdrop-blur-md">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="bg-black rounded-xl border border-white/5 cursor-none w-full max-w-[800px] h-auto aspect-[4/3] touch-none"
        />
      </div>

      {(gameOver || win) && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
          <h2 className={`text-6xl font-heading mb-4 font-bold text-glow ${win ? 'text-primary' : 'text-red-500'}`}>
            {win ? 'SYSTEM COMPROMISED' : 'CONNECTION LOST'}
          </h2>
          <p className="text-2xl text-white mb-8 font-mono">Final Score: {score}</p>
          <button 
            onClick={() => { setGameOver(false); setWin(false); setScore(0); }}
            className="px-8 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow"
          >
            Restart Sequence
          </button>
        </div>
      )}
    </div>
  );
}
