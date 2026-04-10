import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function CryptoSnake() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    let dx = 1;
    let dy = 0;
    let food = { x: 15, y: 10 };
    let gameLoop;
    let particles = [];

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (dy === 0) { dx = 0; dy = -1; } break;
        case 'ArrowDown': case 's': case 'S': if (dy === 0) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': case 'a': case 'A': if (dx === 0) { dx = -1; dy = 0; } break;
        case 'ArrowRight': case 'd': case 'D': if (dx === 0) { dx = 1; dy = 0; } break;
        default: break;
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      if (e.target === canvas) e.preventDefault();
    };
    
    const handleTouchEnd = (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      
      // Swipe threshold
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > 30) {
          if (diffX > 0 && dx === 0) { dx = -1; dy = 0; } // left
          else if (diffX < 0 && dx === 0) { dx = 1; dy = 0; } // right
        }
      } else {
        if (Math.abs(diffY) > 30) {
          if (diffY > 0 && dy === 0) { dx = 0; dy = -1; } // up
          else if (diffY < 0 && dy === 0) { dx = 0; dy = 1; } // down
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    const spawnFood = () => {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
      // Create particles when food spawns
      for(let i=0; i<10; i++){
        particles.push({
          x: food.x * gridSize + gridSize/2,
          y: food.y * gridSize + gridSize/2,
          vx: (Math.random()-0.5)*5,
          vy: (Math.random()-0.5)*5,
          life: 1
        });
      }
    };

    const draw = () => {
      ctx.fillStyle = '#030304';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
      for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
      }

      // Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if(p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = `rgba(255, 214, 0, ${p.life})`;
          ctx.fillRect(p.x, p.y, Math.random()*3+1, Math.random()*3+1);
        }
      });

      // Update Snake
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      
      // Wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }
      
      // Self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      snake.unshift(head);

      // Food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        spawnFood();
      } else {
        snake.pop();
      }

      // Draw Snake
      snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#F7931A' : '#EA580C';
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#F7931A';
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        ctx.shadowBlur = 0;
      });

      // Draw Food
      ctx.fillStyle = '#FFD600';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFD600';
      ctx.fillRect(food.x * gridSize + 4, food.y * gridSize + 4, gridSize - 8, gridSize - 8);
      ctx.shadowBlur = 0;
    };

    gameLoop = setInterval(draw, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
      clearInterval(gameLoop);
    };
  }, [gameOver]);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center relative">
      <div className="absolute top-8 left-8 z-50">
        <a href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-sm tracking-wider bg-surface px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </a>
      </div>

      <div className="mb-8 text-center text-white font-mono">
        <h1 className="text-4xl text-primary font-bold mb-2 text-glow">Crypto Snake</h1>
        <p className="text-lg">Nodes Collected: {score}</p>
        <p className="text-muted text-sm mt-2">Use Arrow Keys</p>
      </div>

      <div className="p-4 bg-surface border border-white/10 rounded-xl shadow-elevation">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={600} 
          className="bg-[#0f1115] rounded-lg border border-white/5 w-full max-w-full h-auto aspect-square touch-none"
        />
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <h2 className="text-5xl font-heading text-red-500 mb-4 font-bold text-glow">NODE DISCONNECTED</h2>
          <p className="text-xl text-white mb-8 font-mono">Final Score: {score}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow"
          >
            Restart Sequence
          </button>
        </div>
      )}
    </div>
  );
}
