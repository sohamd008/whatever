import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const BEEP_DATA = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT18=";

const Timer = () => {
  const [hh, setHh] = useState(0);
  const [mm, setMm] = useState(5);
  const [ss, setSs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(null); // 'hh', 'mm', 'ss'
  
  const totalSecondsRef = useRef(300);
  const initialSecondsRef = useRef(300);
  const audioRef = useRef(null);

  // Load state from local storage
  useEffect(() => {
    const saved = localStorage.getItem('void_timer_v2');
    if (saved) {
      const { h, m, s, total } = JSON.parse(saved);
      setHh(h); setMm(m); setSs(s);
      totalSecondsRef.current = total;
      initialSecondsRef.current = total;
    }
  }, []);

  // Save state to local storage
  useEffect(() => {
    localStorage.setItem('void_timer_v2', JSON.stringify({
      h: hh, m: mm, s: ss, total: initialSecondsRef.current
    }));
  }, [hh, mm, ss]);

  useEffect(() => {
    let interval = null;
    if (isActive && (hh > 0 || mm > 0 || ss > 0)) {
      interval = setInterval(() => {
        let nH = hh, nM = mm, nS = ss;
        
        if (nS > 0) nS--;
        else if (nM > 0) { nM--; nS = 59; }
        else if (nH > 0) { nH--; nM = 59; nS = 59; }

        setHh(nH); setMm(nM); setSs(nS);
        
        const remaining = nH * 3600 + nM * 60 + nS;
        setProgress((remaining / initialSecondsRef.current) * 100);
      }, 1000);
    } else if (hh === 0 && mm === 0 && ss === 0 && isActive) {
      setIsActive(false);
      clearInterval(interval);
      if (soundEnabled) audioRef.current.play().catch(e => console.log('Audio blocked'));
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, hh, mm, ss, soundEnabled]);

  const toggle = () => {
    if (!isActive && hh === 0 && mm === 0 && ss === 0) return;
    if (!isActive) {
        const total = hh * 3600 + mm * 60 + ss;
        initialSecondsRef.current = total;
    }
    setIsActive(!isActive);
    setIsEditing(null);
  };

  const reset = () => {
    setIsActive(false);
    const { h, m, s, total } = JSON.parse(localStorage.getItem('void_timer_v2') || '{"h":0,"m":5,"s":0,"total":300}');
    setHh(h); setMm(m); setSs(s);
    setProgress(100);
    initialSecondsRef.current = total;
  };

  const handleEdit = (type, val) => {
    if (isActive) return;
    const n = Math.max(0, Math.min(type === 'hh' ? 99 : 59, parseInt(val) || 0));
    if (type === 'hh') setHh(n);
    if (type === 'mm') setMm(n);
    if (type === 'ss') setSs(n);
    // Note: initialSecondsRef is updated on Start
  };

  const renderDigit = (type, val) => {
    const isThisEditing = isEditing === type;
    return (
      <div className="relative group">
        {isThisEditing ? (
          <input
            autoFocus
            type="number"
            className="w-12 bg-primary/20 text-primary border-b-2 border-primary outline-none text-center font-mono text-2xl"
            value={val}
            onBlur={() => setIsEditing(null)}
            onChange={(e) => handleEdit(type, e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(null)}
          />
        ) : (
          <button 
            onClick={() => !isActive && setIsEditing(type)}
            className={`font-mono text-3xl font-bold transition-all ${isActive ? 'text-white' : 'text-primary/60 hover:text-primary'}`}
          >
            {String(val).padStart(2, '0')}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-3xl border border-white/5 h-full flex flex-col items-center justify-center relative overflow-hidden group">
      <audio ref={audioRef} src={BEEP_DATA} />
      
      <div className="absolute top-4 right-4 z-10">
        <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1.5 text-muted hover:text-primary transition-colors bg-black/40 rounded-full border border-white/5">
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
          <circle cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={471} strokeDashoffset={471 - (471 * progress) / 100} className={`transition-all duration-1000 ${hh === 0 && mm === 0 && ss < 10 && isActive ? 'text-red-500' : 'text-primary'}`} />
        </svg>
        <div className="absolute flex items-center gap-1">
          {renderDigit('hh', hh)}
          <span className="text-white/20 font-mono -mt-1">:</span>
          {renderDigit('mm', mm)}
          <span className="text-white/20 font-mono -mt-1">:</span>
          {renderDigit('ss', ss)}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={toggle}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30' : 'bg-primary text-[#030304] hover:scale-105 shadow-gold-glow'}`}
        >
          {isActive ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 pl-1" />}
        </button>
      </div>

      <button onClick={reset} className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted/40 hover:text-primary transition-colors flex items-center gap-2">
        <RotateCcw className="w-3 h-3" /> System Reset
      </button>

      {!isActive && (
          <p className="mt-4 text-[8px] font-mono text-primary/30 uppercase tracking-tighter">Click digits to edit</p>
      )}
    </div>
  );
};

export default Timer;
