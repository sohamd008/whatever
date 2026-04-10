import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function PixelAsteroids() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // --- State ---
    let animId;
    let ship = { x: canvas.width / 2, y: canvas.height / 2, angle: -Math.PI / 2, vx: 0, vy: 0, radius: 14, invincible: 0 };
    let bullets = [];
    let asteroids = [];
    let particles = [];
    let localScore = 0;
    let localLives = 3;
    let lastShot = 0;
    const keys = {};

    function spawnAsteroid(x, y, size) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 1 + 0.5) * (4 - size * 0.5);
      asteroids.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, size, radius: size * 16, angle: 0, spin: (Math.random() - 0.5) * 0.05 });
    }

    function spawnWave() {
      const count = 4 + Math.floor(localScore / 200);
      for (let i = 0; i < count; i++) {
        let x, y;
        do {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
        } while (Math.hypot(x - ship.x, y - ship.y) < 150);
        spawnAsteroid(x, y, 3);
      }
    }

    function explode(x, y, color = '#F7931A') {
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 5 + 1;
        particles.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, life: 1, color });
      }
    }

    spawnWave();

    // Controls
    const onKeyDown = (e) => {
      keys[e.code] = true;
      if ((e.code === 'Space' || e.code === 'KeyX') && !gameOver) {
        const now = Date.now();
        if (now - lastShot > 220) {
          lastShot = now;
          bullets.push({
            x: ship.x + Math.cos(ship.angle) * ship.radius,
            y: ship.y + Math.sin(ship.angle) * ship.radius,
            vx: Math.cos(ship.angle) * 10 + ship.vx,
            vy: Math.sin(ship.angle) * 10 + ship.vy,
            life: 55
          });
        }
      }
    };
    const onKeyUp = (e) => { keys[e.code] = false; };

    // Touch controls
    let touchJoystickX = 0;
    let touchShooting = false;
    let touchStartId = null;
    const onTouchStart = (e) => {
      for (const t of e.changedTouches) {
        if (t.clientX > canvas.getBoundingClientRect().width / 2) {
          touchShooting = true;
        } else {
          touchStartId = t.identifier;
          touchJoystickX = t.clientX;
        }
      }
    };
    const onTouchMove = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === touchStartId) {
          const delta = t.clientX - touchJoystickX;
          if (delta > 20) { keys['ArrowRight'] = true; keys['ArrowLeft'] = false; }
          else if (delta < -20) { keys['ArrowLeft'] = true; keys['ArrowRight'] = false; }
          else { keys['ArrowLeft'] = false; keys['ArrowRight'] = false; }
          keys['ArrowUp'] = t.clientY < canvas.getBoundingClientRect().height / 2;
        }
      }
    };
    const onTouchEnd = () => { keys['ArrowLeft'] = false; keys['ArrowRight'] = false; keys['ArrowUp'] = false; touchShooting = false; };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    function wrap(obj) {
      if (obj.x < -50) obj.x = canvas.width + 50;
      if (obj.x > canvas.width + 50) obj.x = -50;
      if (obj.y < -50) obj.y = canvas.height + 50;
      if (obj.y > canvas.height + 50) obj.y = -50;
    }

    function drawShip() {
      if (ship.invincible > 0 && Math.floor(ship.invincible * 10) % 2 === 0) return;
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle + Math.PI / 2);
      ctx.strokeStyle = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 6);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.stroke();
      if (keys['ArrowUp'] || keys['KeyW']) {
        ctx.strokeStyle = '#F7931A';
        ctx.shadowColor = '#F7931A';
        ctx.beginPath();
        ctx.moveTo(-5, 8);
        ctx.lineTo(0, 14 + Math.random() * 6);
        ctx.lineTo(5, 8);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawAsteroid(a) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.angle);
      ctx.strokeStyle = '#94a3b8';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#F7931A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const pts = 7 + a.size;
      for (let i = 0; i <= pts; i++) {
        const ang = (i / pts) * Math.PI * 2;
        const noise = 0.8 + 0.4 * Math.sin(ang * 3.7 + a.radius);
        const r = a.radius * noise;
        if (i === 0) ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r);
        else ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    let gameEnded = false;

    function loop() {
      if (gameEnded) return;

      // Input
      if (keys['ArrowLeft'] || keys['KeyA']) ship.angle -= 0.06;
      if (keys['ArrowRight'] || keys['KeyD']) ship.angle += 0.06;
      if (keys['ArrowUp'] || keys['KeyW']) {
        ship.vx += Math.cos(ship.angle) * 0.3;
        ship.vy += Math.sin(ship.angle) * 0.3;
      }
      if (touchShooting) {
        const now = Date.now();
        if (now - lastShot > 220) {
          lastShot = now;
          bullets.push({ x: ship.x + Math.cos(ship.angle) * ship.radius, y: ship.y + Math.sin(ship.angle) * ship.radius, vx: Math.cos(ship.angle) * 10 + ship.vx, vy: Math.sin(ship.angle) * 10 + ship.vy, life: 55 });
        }
      }

      // Physics - drag
      ship.vx *= 0.98;
      ship.vy *= 0.98;
      ship.x += ship.vx;
      ship.y += ship.vy;
      wrap(ship);
      if (ship.invincible > 0) ship.invincible -= 0.016;

      // Bullets
      bullets = bullets.filter(b => b.life > 0);
      bullets.forEach(b => { b.x += b.vx; b.y += b.vy; b.life--; wrap(b); });

      // Asteroids
      asteroids.forEach(a => { a.x += a.vx; a.y += a.vy; a.angle += a.spin; wrap(a); });

      // Bullet-asteroid collisions
      bullets.forEach((b, bi) => {
        asteroids.forEach((a, ai) => {
          if (Math.hypot(b.x - a.x, b.y - a.y) < a.radius) {
            explode(a.x, a.y);
            bullets.splice(bi, 1);
            asteroids.splice(ai, 1);
            if (a.size > 1) {
              spawnAsteroid(a.x, a.y, a.size - 1);
              spawnAsteroid(a.x, a.y, a.size - 1);
            }
            localScore += (4 - a.size) * 20;
            setScore(localScore);
          }
        });
      });

      // Ship-asteroid collision
      if (ship.invincible <= 0) {
        for (const a of asteroids) {
          if (Math.hypot(ship.x - a.x, ship.y - a.y) < a.radius + ship.radius - 4) {
            explode(ship.x, ship.y, '#06b6d4');
            ship.x = canvas.width / 2;
            ship.y = canvas.height / 2;
            ship.vx = 0; ship.vy = 0;
            ship.invincible = 2.5;
            localLives--;
            setLives(localLives);
            if (localLives <= 0) {
              gameEnded = true;
              setGameOver(true);
              return;
            }
            break;
          }
        }
      }

      // Respawn wave
      if (asteroids.length === 0) spawnWave();

      // Particles
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vx *= 0.95; p.vy *= 0.95; p.life -= 0.025; });

      // --- Draw ---
      ctx.fillStyle = 'rgba(3, 3, 4, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw bullets
      bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD600';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFD600';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      asteroids.forEach(drawAsteroid);
      drawShip();

      // HUD
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#F7931A';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`SCORE: ${localScore}`, 16, 24);
      ctx.fillStyle = '#06b6d4';
      ctx.fillText(`LIVES: ${'♥ '.repeat(Math.max(0, localLives))}`, 16, 44);

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      gameEnded = true;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [gameOver]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center relative select-none touch-none">
      <div className="absolute top-8 left-8 z-50">
        <a href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-sm tracking-wider bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </a>
      </div>

      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold font-heading text-primary text-glow">Pixel Asteroids</h1>
        <p className="text-white/40 text-xs font-mono mt-1">ARROWS / WASD to move · SPACE to fire · Touch: left side = move, right side = fire</p>
      </div>

      <div className="relative border border-white/10 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(247,147,26,0.15)]">
        <canvas
          ref={canvasRef}
          width={800}
          height={560}
          className="block w-full max-w-[800px] h-auto bg-[#030304]"
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center">
            <h2 className="text-5xl font-heading font-bold text-red-500 mb-2">SHIP DESTROYED</h2>
            <p className="text-white/60 font-mono text-xl mb-8">Final Score: {score}</p>
            <button
              onClick={() => { setScore(0); setLives(3); setGameOver(false); }}
              className="px-10 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow font-mono"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
