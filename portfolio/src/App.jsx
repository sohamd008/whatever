import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ConstellationBackground from './components/ConstellationBackground';
import Home from './pages/Home';
import Games from './pages/Games';
import VoidRunner3D from './games/VoidRunner3D';
import NeonBreakout from './games/NeonBreakout';
import CryptoSnake from './games/CryptoSnake';
import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen selection:bg-primary/30 selection:text-white">
      <ConstellationBackground />
      
      {/* Content wrapper to ensure it sits above the canvas */}
      <div className="relative z-10 antialiased font-body flex flex-col min-h-screen">
        
        {/* Navigation */}
        <header className="container mx-auto max-w-7xl px-6 py-8 flex justify-between items-center bg-transparent relative z-50">
          <Link to="/" className="font-heading font-bold text-2xl tracking-tighter text-white hover:opacity-80 transition-opacity">
            SD<span className="text-primary">.</span>
          </Link>
          <nav className="flex gap-6 md:gap-8 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
            {location.pathname === "/" ? (
              <>
                <a href="#projects" className="text-xs md:text-sm font-mono tracking-wider text-muted hover:text-primary transition-colors">PROJECTS</a>
                <a href="#contact" className="text-xs md:text-sm font-mono tracking-wider text-muted hover:text-primary transition-colors">CONTACT</a>
              </>
            ) : null}
            <Link to="/games" className="text-xs md:text-sm font-mono tracking-wider text-primary font-bold hover:text-tertiary transition-colors flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              ARCADE
            </Link>
          </nav>
        </header>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/void-runner" element={<VoidRunner3D />} />
          <Route path="/games/neon-breakout" element={<NeonBreakout />} />
          <Route path="/games/snake" element={<CryptoSnake />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Footer (hidden inside game engines) */}
        {!location.pathname.startsWith('/games/') && (
          <footer className="mt-auto border-t border-white/10 bg-[#030304]/80 backdrop-blur-md py-8 relative z-50">
            <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center text-sm font-mono text-muted">
              <p> &copy; {new Date().getFullYear()} Soham Dandekar. All rights reserved.</p>
              <p className="mt-2 md:mt-0">Engineered with precision.</p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
