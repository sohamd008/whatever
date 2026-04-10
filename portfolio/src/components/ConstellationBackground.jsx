import React, { useEffect, useRef } from 'react';

const ConstellationBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let W, H;
    let mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
    let lastMouse = { x: -9999, y: -9999 };
    let animationFrameId;
    
    // ENHANCED PARAMETERS
    const NODE_COUNT = 600; // Doubled density with new optimizations
    const ATTRACT_RADIUS = 150; 
    const CONNECT_DIST = 110;    

    function resize() {
      const oldW = W || window.innerWidth;
      const oldH = H || window.innerHeight;
      
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);

      if (nodes.length === 0) {
        initNodes();
      } else {
        nodes.forEach(n => {
          n.homeX = (n.homeX / oldW) * W;
          n.homeY = (n.homeY / oldH) * H;
          n.x = (n.x / oldW) * W;
          n.y = (n.y / oldH) * H;
        });
      }
    }

    let nodes = [];
    let shootingStars = [];

    class Node {
      constructor() {
        this.homeX = Math.random() * W;
        this.homeY = Math.random() * H;
        this.x = this.homeX;
        this.y = this.homeY;
        // Adding depth logic for parallax
        this.z = Math.random() * 2 + 0.1; 
        this.size = (Math.random() * 1.5 + 0.3) / this.z;
        this.brightness = Math.random() * 0.4 + 0.1;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinklePhase = Math.random() * Math.PI * 2;
      }
      
      update(t) {
        // Core attraction logic
        const dx = mouse.x - this.homeX;
        const dy = mouse.y - this.homeY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Mouse velocity parallax (mouse pulls background slightly opposite)
        const parallaxX = -mouse.vx * (1 / this.z) * 0.5;
        const parallaxY = -mouse.vy * (1 / this.z) * 0.5;

        if (dist < ATTRACT_RADIUS && dist > 0) {
          const factor = Math.pow(1 - dist / ATTRACT_RADIUS, 1.5);
          const pull = factor * 40; 
          this.x += (this.homeX + (dx / dist) * pull - this.x + parallaxX) * 0.08;
          this.y += (this.homeY + (dy / dist) * pull - this.y + parallaxY) * 0.08;
        } else {
          this.x += (this.homeX - this.x + parallaxX) * 0.05;
          this.y += (this.homeY - this.y + parallaxY) * 0.05;
        }

        this.brightness = 0.15 + Math.sin(t * this.twinkleSpeed + this.twinklePhase) * 0.25 + 0.15;
      }
      
      draw() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / ATTRACT_RADIUS);
        
        // Color shifts to warmer gold when near mouse
        const alpha = this.brightness + proximity * 0.7;
        const r = proximity > 0.1 ? 247 : 200;
        const g = proximity > 0.1 ? 147 + proximity * 69 : 200;
        const b = proximity > 0.1 ? 26 : 220;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + proximity * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // Glow
        if (proximity > 0.2) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size + proximity * 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 214, 0, ${proximity * 0.15})`;
          ctx.fill();
        }
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * -H; // Start above screen
        this.length = Math.random() * 80 + 30;
        this.speed = Math.random() * 10 + 15;
        this.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // Roughly diagonal down-right
        this.opacity = 0;
        this.active = false;
        this.delay = Math.random() * 200 + 50; // frames before starting
      }

      update(time) {
        if (!this.active) {
          this.delay--;
          if (this.delay <= 0) this.active = true;
          return;
        }
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Fade in/out
        if (this.y < H / 2) {
            this.opacity = Math.min(1, this.opacity + 0.1);
        } else {
            this.opacity = Math.max(0, this.opacity - 0.05);
        }

        if (this.x > W + 100 || this.y > H + 100 || this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        if (!this.active || this.opacity <= 0) return;
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
        
        const grad = ctx.createLinearGradient(
          this.x, this.y, 
          this.x - Math.cos(this.angle) * this.length, 
          this.y - Math.sin(this.angle) * this.length
        );
        grad.addColorStop(0, `rgba(255, 214, 0, ${this.opacity})`);
        grad.addColorStop(1, `rgba(247, 147, 26, 0)`);
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    function initNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => new Node());
      shootingStars = Array.from({ length: 4 }, () => new ShootingStar());
    }

    function drawConnections() {
      // Optimization: No Math.sqrt for filter check
      const attractSquared = (ATTRACT_RADIUS * 1.5) * (ATTRACT_RADIUS * 1.5);
      const activeNodes = nodes.filter(n => {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        return (dx * dx + dy * dy) < attractSquared;
      });

      for (let i = 0; i < activeNodes.length; i++) {
        const nodeA = activeNodes[i];
        
        // Connect to mouse
        const dmx = mouse.x - nodeA.x;
        const dmy = mouse.y - nodeA.y;
        const distM = Math.sqrt(dmx * dmx + dmy * dmy); // Need actual distance for alpha
        if (distM < ATTRACT_RADIUS) {
          const alpha = (1 - distM / ATTRACT_RADIUS) * 0.2;
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 214, 0, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }

        // Connect to each other
        for (let j = i + 1; j < activeNodes.length; j++) {
          const nodeB = activeNodes[j];
          
          // Fast bounding box check before expensive square root
          const dx = nodeA.x - nodeB.x;
          if (Math.abs(dx) > CONNECT_DIST) continue;
          
          const dy = nodeA.y - nodeB.y;
          if (Math.abs(dy) > CONNECT_DIST) continue;
          
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(247, 147, 26, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
    }

    let time = 0;
    function animate() {
      time++;
      ctx.clearRect(0, 0, W, H);
      
      // Decay mouse velocity
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      shootingStars.forEach(s => { s.update(time); s.draw(); });
      nodes.forEach(n => { n.update(time); n.draw(); });
      drawConnections();
      
      animationFrameId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    
    const handleMouseMove = (e) => {
      if (lastMouse.x !== -9999) {
        mouse.vx = e.clientX - lastMouse.x;
        mouse.vy = e.clientY - lastMouse.y;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      lastMouse.x = -9999;
      lastMouse.y = -9999;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

export default ConstellationBackground;
