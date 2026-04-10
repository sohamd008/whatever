import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as THREE from 'three';

const Tunnel = () => {
  const group = useRef();
  
  useFrame((state) => {
    // Move tunnel towards camera
    group.current.position.z += 0.5;
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

const Particles = () => {
  const meshRef = useRef();
  const particleCount = 200;
  
  const particles = React.useMemo(() => {
    return new Array(particleCount).fill().map(() => ({
      position: [
        (Math.random() - 0.5) * 8, 
        (Math.random() - 0.5) * 8, 
        (Math.random() - 0.5) * 60 - 10
      ],
      speed: Math.random() * 0.5 + 0.1,
    }));
  }, []);

  const dummy = React.useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.position[2] += p.speed;
      if (p.position[2] > 5) {
        p.position[2] = -55;
      }
      dummy.position.set(...p.position);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, particleCount]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="#FFD600" emissive="#FFD600" emissiveIntensity={5} />
    </instancedMesh>
  );
};

export default function VoidRunner3D() {
  return (
    <div className="w-full h-screen bg-black relative">
      <div className="absolute top-8 left-8 z-50">
        <Link to="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-sm tracking-wider bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Exit Simulation
        </Link>
      </div>
      
      <div className="absolute top-8 right-8 z-50 font-mono text-tertiary">
        VOID RUNNER v1.0
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['#010101']} />
        <ambientLight intensity={0.5} />
        
        <Tunnel />
        <Particles />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}
