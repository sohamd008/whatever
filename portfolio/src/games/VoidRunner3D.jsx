import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// Removing OrbitControls entirely since this is now an active game
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as THREE from 'three';

// Global game state to decouple from React rendering ticks
const gameState = {
  player: new THREE.Vector3(0, 0, 0),
  speed: 1.0,
  gameOver: false,
  score: 0
};

const Tunnel = () => {
  const group = useRef();
  
  useFrame((state) => {
    if (gameState.gameOver) return;
    // Move tunnel towards camera
    group.current.position.z += gameState.speed * 0.5;
    if (group.current.position.z > 20) {
      group.current.position.z -= 20;
    }
    // Rotate slightly
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });

  return (
    <group ref={group}>
      {[...Array(30)].map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 2 - 10]} rotation={[0, 0, i * 0.1]}>
          <ringGeometry args={[4, 4.2, 8]} />
          <meshStandardMaterial 
            color="#EA580C" 
            emissive="#F7931A" 
            emissiveIntensity={2} 
            wireframe 
            transparent 
            opacity={1 - (i / 30)} 
          />
        </mesh>
      ))}
    </group>
  );
};

const Obstacles = ({ setGameOver }) => {
  const meshRef = useRef();
  const count = 15;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const obstacles = useMemo(() => {
    return new Array(count).fill().map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 8, 
        (Math.random() - 0.5) * 8, 
        -Math.random() * 100 - 30
      ),
      rotation: new THREE.Vector3(Math.random(), Math.random(), Math.random())
    }));
  }, [count]);

  useFrame(() => {
    if (gameState.gameOver || !meshRef.current) return;
    
    obstacles.forEach((obs, i) => {
      obs.position.z += gameState.speed * 1.2; // Incoming!
      
      // Reset passed obstacle and increase score bounds
      if (obs.position.z > 5) {
        obs.position.z = -100 - Math.random() * 50;
        obs.position.x = (Math.random() - 0.5) * 8;
        obs.position.y = (Math.random() - 0.5) * 8;
        gameState.score += 10;
      }

      // Check collision
      const dist = obs.position.distanceTo(gameState.player);
      if (dist < 1.0 && obs.position.z > -1 && obs.position.z < 1) { // 1.0 roughly bounds collision of box/cone
        gameState.gameOver = true;
        setGameOver(true);
      }

      dummy.position.copy(obs.position);
      obs.rotation.x += 0.05;
      obs.rotation.y += 0.05;
      dummy.rotation.set(obs.rotation.x, obs.rotation.y, obs.rotation.z);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={3} wireframe />
    </instancedMesh>
  );
}

const Ship = () => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (!meshRef.current) return;
    // Smooth interpolation towards logical position
    meshRef.current.position.lerp(gameState.player, 0.2);
    // Bank the ship visually based on position
    meshRef.current.rotation.z = -meshRef.current.position.x * 0.15;
    meshRef.current.rotation.x = meshRef.current.position.y * 0.15 + Math.PI / 2; // Flat cone forward
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <coneGeometry args={[0.5, 1.5, 4]} />
      <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={3} wireframe />
    </mesh>
  );
};

export default function VoidRunner3D() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const containerRef = useRef();

  useEffect(() => {
    gameState.gameOver = false;
    gameState.score = 0;
    gameState.speed = 1.0;
    gameState.player.set(0, -1, 0); // start slightly down

    const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false, W: false, A: false, S: false, D: false };
    
    const uiUpdate = setInterval(() => {
      if (!gameState.gameOver) {
        setScore(gameState.score);
        gameState.speed = Math.min(3.0, gameState.speed + 0.0005); // Speed increases slowly
      }
    }, 100);

    const onKeyDown = (e) => { if(keys[e.key] !== undefined) keys[e.key] = true; };
    const onKeyUp = (e) => { if(keys[e.key] !== undefined) keys[e.key] = false; };

    const gameLoop = setInterval(() => {
      if (gameState.gameOver) return;
      const moveSpeed = 0.25;
      if (keys.ArrowUp || keys.w || keys.W) gameState.player.y += moveSpeed;
      if (keys.ArrowDown || keys.s || keys.S) gameState.player.y -= moveSpeed;
      if (keys.ArrowLeft || keys.a || keys.A) gameState.player.x -= moveSpeed;
      if (keys.ArrowRight || keys.d || keys.D) gameState.player.x += moveSpeed;

      // Bound constraints
      gameState.player.x = Math.max(-4.5, Math.min(4.5, gameState.player.x));
      gameState.player.y = Math.max(-4.5, Math.min(4.5, gameState.player.y));
    }, 16); // 60fps physics simulation

    // Touch dragging mechanic for Mobile
    let startX = 0, startY = 0, pX = 0, pY = 0;
    const onTouchStart = (e) => {
      e.preventDefault();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      pX = gameState.player.x;
      pY = gameState.player.y;
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      const dx = (e.touches[0].clientX - startX) * 0.03;
      const dy = -(e.touches[0].clientY - startY) * 0.03; // inverted to match screen
      gameState.player.x = Math.max(-4.5, Math.min(4.5, pX + dx));
      gameState.player.y = Math.max(-4.5, Math.min(4.5, pY + dy));
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    
    const cont = containerRef.current;
    if (cont) {
      cont.addEventListener('touchstart', onTouchStart, { passive: false });
      cont.addEventListener('touchmove', onTouchMove, { passive: false });
    }

    return () => {
      clearInterval(uiUpdate);
      clearInterval(gameLoop);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (cont) {
        cont.removeEventListener('touchstart', onTouchStart);
        cont.removeEventListener('touchmove', onTouchMove);
      }
    };
  }, [gameOver]);

  const handleRestart = () => {
    setGameOver(false);
  };

  return (
    <div ref={containerRef} className="w-full h-screen bg-black relative touch-none select-none">
      <div className="absolute top-8 left-8 z-50">
        <Link to="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-sm tracking-wider bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Exit Simulation
        </Link>
      </div>
      
      <div className="absolute top-8 right-8 z-50 font-mono text-right pointer-events-none">
        <div className="text-tertiary">VOID RUNNER 2.0</div>
        <div className="text-white text-2xl font-bold mt-2 text-glow">{score}</div>
        <div className="text-white/50 text-xs mt-1">Use WASD or Drag to Dodge</div>
      </div>

      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <color attach="background" args={['#010101']} />
        <ambientLight intensity={0.5} />
        
        <Tunnel />
        <Ship />
        <Obstacles setGameOver={setGameOver} />
      </Canvas>

      {gameOver && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
          <h2 className="text-6xl font-heading mb-4 font-bold text-glow text-red-500">
            HULL BREACH DETECTED
          </h2>
          <p className="text-2xl text-white mb-8 font-mono">Final Distance: {score}</p>
          <button 
            onClick={handleRestart}
            className="px-8 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow pointer-events-auto"
          >
            Deploy New Ship
          </button>
        </div>
      )}
    </div>
  );
}
