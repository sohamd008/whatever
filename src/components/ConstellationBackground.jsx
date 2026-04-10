import React, { useEffect, useRef } from 'react';

const ConstellationBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    let W, H;
    let mouse = { x: -9999, y: -9999 };
    let animationFrameId;
    let isVisible = true;
    
    // Detect performance tier
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    // MUCH lower counts for smooth scrolling
    const NODE_COUNT = isMobile ? 60 : 180;
    const ATTRACT_RADIUS = 100;
    const CONNECT_DIST = 70;
    const ATTRACT_SQ = ATTRACT_RADIUS * ATTRACT_RADIUS;
    const CONNECT_SQ = CONNECT_DIST * CONNECT_DIST;

    // Throttle animation to ~30fps instead of 60fps
    let lastFrame = 0;
    const FRAME_MS = isMobile ? 50 : 33; // 20fps mobile, 30fps desktop

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let nodes = [];
    let shootingStars = [];

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          homeX: Math.random() * W,
          homeY: Math.random() * H,
          x: 0, y: 0,
          size: Math.random() * 1.5 + 0.3,
          brightness: Math.random() * 0.3 + 0.15,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          twinklePhase: Math.random() * 6.28,
        });
        nodes[i].x = nodes[i].homeX;
        nodes[i].y = nodes[i].homeY;
      }
      shootingStars = [];
      const starCount = isMobile ? 1 : 2;
      for (let i = 0; i < starCount; i++) {
        shootingStars.push({
          x: Math.random() * W,
          y: -Math.random() * H,
          length: Math.random() * 60 + 30,
          speed: Math.random() * 8 + 12,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          opacity: 0,
          active: false,
          delay: Math.random() * 300 + 100,
        });
      }
    }

    let time = 0;
    function animate(now) {
      animationFrameId = requestAnimationFrame(animate);

      // Frame throttle
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;

      // Don't render if tab is hidden
      if (!isVisible) return;

      time++;
      ctx.clearRect(0, 0, W, H);

      const mx = mouse.x, my = mouse.y;

      // Shooting stars
      for (let i = 0; i < shootingStars.length; i++) {
        const s = shootingStars[i];
        if (!s.active) {
          s.delay--;
          if (s.delay <= 0) s.active = true;
          continue;
        }
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity = s.y < H / 2 ? Math.min(1, s.opacity + 0.08) : Math.max(0, s.opacity - 0.04);
        if (s.x > W + 100 || s.y > H + 100 || s.opacity <= 0) {
          s.x = Math.random() * W; s.y = -Math.random() * H;
          s.opacity = 0; s.active = false; s.delay = Math.random() * 300 + 100;
          continue;
        }
        if (s.opacity > 0) {
          const ex = s.x - Math.cos(s.angle) * s.length;
          const ey = s.y - Math.sin(s.angle) * s.length;
          const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
          grad.addColorStop(0, `rgba(255,214,0,${s.opacity})`);
          grad.addColorStop(1, 'rgba(247,147,26,0)');
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(ex, ey);
          ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.stroke();
        }
      }

      // Batch all node draws in one pass — no per-node beginPath overhead for distant nodes
      // First pass: update positions + collect nearby nodes
      const nearNodes = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = mx - n.homeX;
        const dy = my - n.homeY;
        const distSq = dx * dx + dy * dy;

        if (distSq < ATTRACT_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const factor = (1 - dist / ATTRACT_RADIUS);
          const pull = factor * factor * 30;
          n.x += (n.homeX + (dx / dist) * pull - n.x) * 0.08;
          n.y += (n.homeY + (dy / dist) * pull - n.y) * 0.08;
          nearNodes.push(i);
        } else {
          n.x += (n.homeX - n.x) * 0.05;
          n.y += (n.homeY - n.y) * 0.05;
        }

        // Twinkle
        n.brightness = 0.15 + Math.sin(time * n.twinkleSpeed + n.twinklePhase) * 0.2 + 0.1;

        // Draw node — simple dot, no glow
        const ndx = mx - n.x, ndy = my - n.y;
        const ndSq = ndx * ndx + ndy * ndy;
        const proximity = ndSq < ATTRACT_SQ ? 1 - Math.sqrt(ndSq) / ATTRACT_RADIUS : 0;
        
        const alpha = n.brightness + proximity * 0.5;
        const r = proximity > 0.1 ? 247 : 200;
        const g = proximity > 0.1 ? 147 + proximity * 69 : 200;
        const b = proximity > 0.1 ? 26 : 220;
        const sz = n.size + proximity * 2;

        ctx.beginPath();
        ctx.arc(n.x, n.y, sz, 0, 6.28);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      // Connections — only among nearby nodes (much cheaper)
      if (nearNodes.length > 0 && nearNodes.length < 40) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nearNodes.length; i++) {
          const a = nodes[nearNodes[i]];
          // Line to mouse
          const dmx = mx - a.x, dmy = my - a.y;
          const dmSq = dmx * dmx + dmy * dmy;
          if (dmSq < ATTRACT_SQ) {
            const alpha = (1 - Math.sqrt(dmSq) / ATTRACT_RADIUS) * 0.15;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(255,214,0,${alpha})`; ctx.stroke();
          }
          // Lines to other nearby nodes
          for (let j = i + 1; j < nearNodes.length; j++) {
            const b = nodes[nearNodes[j]];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < CONNECT_SQ) {
              const alpha = (1 - Math.sqrt(dSq) / CONNECT_DIST) * 0.2;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(247,147,26,${alpha})`; ctx.stroke();
            }
          }
        }
      }
    }

    // Visibility API — pause when tab hidden
    const onVisibility = () => { isVisible = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    initNodes();
    window.addEventListener('resize', resize);
    
    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };
    const handleLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleLeave);
    
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  );
};

export default ConstellationBackground;
