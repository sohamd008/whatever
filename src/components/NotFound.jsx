import React, { useState } from 'react';
import Button from '../components/ui/Button';

const NotFound = () => {
  const [debris] = useState(() => Array.from({ length: 8 }).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    speed: Math.random() * 10 + 10,
    text: ['404', 'null', 'undefined', 'NaN', 'Object Promise'][Math.floor(Math.random() * 5)]
  })));

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden z-10 min-h-[70vh]">
      
      {/* Glitch 404 Text */}
      <div className="relative inline-block mb-2 group">
        <h1 className="text-[8rem] md:text-[12rem] font-bold font-heading text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none drop-shadow-2xl transition-transform duration-500 group-hover:scale-110">
          404
        </h1>
        {/* Animated offset layer for glitch effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-70 mix-blend-screen text-primary blur-[2px] animate-pulse transition-opacity select-none" style={{ marginLeft: '4px', marginTop: '4px' }}>
          <span className="text-[8rem] md:text-[12rem] font-bold font-heading">404</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-70 mix-blend-screen text-teal-400 blur-[2px] animate-pulse transition-opacity select-none" style={{ marginLeft: '-4px', marginTop: '-4px', animationDelay: '0.2s' }}>
          <span className="text-[8rem] md:text-[12rem] font-bold font-heading">404</span>
        </div>
      </div>

      <h2 className="text-2xl md:text-4xl font-bold font-heading text-white mb-4 animate-bounce">
        Houston, we have a problem.
      </h2>
      <p className="text-muted font-mono max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed">
        The coordinates you entered lead to an empty sector of the void. 
        The data has either been lost, or it was eaten by a black hole.
      </p>

      {/* Button with funny hover effect */}
      <div className="relative inline-block">
        <Button href="/" variant="primary" className="mx-auto flex relative z-20">
          RETURN TO BASE
        </Button>
      </div>

      {/* CSS Animation for Debris */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-300px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      {/* Floating Data Debris */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
         {debris.map((item, i) => (
           <div 
             key={i}
             className="absolute text-white/10 font-mono font-bold whitespace-nowrap"
             style={{
               left: `${item.x}%`,
               bottom: `-20%`,
               fontSize: `${item.size}px`,
               animation: `floatUp ${item.speed}s linear infinite`,
               animationDelay: `${item.delay}s`
             }}
           >
             {item.text}
           </div>
         ))}
      </div>
    </div>
  );
};

export default NotFound;
