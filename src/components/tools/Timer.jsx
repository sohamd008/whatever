import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

// Short digital beep sound
const BEEP_DATA = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT18=";

const Timer = () => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const totalSecondsRef = useRef(300);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          setMinutes(m => m - 1);
          setSeconds(59);
        } else {
          setSeconds(s => s - 1);
        }
        const remaining = (minutes * 60 + seconds) - 1;
        setProgress((remaining / totalSecondsRef.current) * 100);
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      setIsActive(false);
      clearInterval(interval);
      if (soundEnabled) {
        audioRef.current.play().catch(e => console.log('Audio playback blocked'));
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, soundEnabled]);

  const toggle = () => {
    if (!isActive && minutes === 0 && seconds === 0) return;
    if (!isActive && totalSecondsRef.current !== (minutes * 60 + seconds)) {
        totalSecondsRef.current = minutes * 60 + seconds;
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setMinutes(5);
    setSeconds(0);
    setProgress(100);
    totalSecondsRef.current = 300;
  };

  const adjustTime = (m) => {
    if (isActive) return;
    const newM = Math.max(0, Math.min(99, minutes + m));
    setMinutes(newM);
    totalSecondsRef.current = newM * 60 + seconds;
  };

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full flex flex-col items-center justify-center relative overflow-hidden group">
      <audio ref={audioRef} src={BEEP_DATA} />
      
      <div className="absolute top-4 right-4">
        <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1 text-muted hover:text-primary transition-colors">
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64" cy="64" r="60"
            stroke="currentColor" strokeWidth="4" fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="64" cy="64" r="60"
            stroke="currentColor" strokeWidth="4" fill="transparent"
            strokeDasharray={377}
            strokeDashoffset={377 - (377 * progress) / 100}
            className={`transition-all duration-1000 ${minutes === 0 && seconds < 10 && isActive ? 'text-red-500' : 'text-primary'}`}
          />
        </svg>
        <div className="absolute text-3xl font-mono font-bold text-white tracking-widest">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => adjustTime(-1)} 
          disabled={isActive}
          className="w-10 h-10 rounded-full bg-black/40 border border-white/5 text-muted hover:text-white hover:border-white/20 disabled:opacity-30 transition-all"
        >
          -
        </button>
        <button 
          onClick={toggle}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30' : 'bg-primary text-[#030304] hover:scale-105 shadow-gold-glow'}`}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 pl-1" />}
        </button>
        <button 
          onClick={() => adjustTime(1)} 
          disabled={isActive}
          className="w-10 h-10 rounded-full bg-black/40 border border-white/5 text-muted hover:text-white hover:border-white/20 disabled:opacity-30 transition-all"
        >
          +
        </button>
      </div>

      <button onClick={reset} className="text-[10px] font-mono uppercase tracking-widest text-muted hover:text-primary transition-colors flex items-center gap-2">
        <RotateCcw className="w-3 h-3" /> Reset
      </button>
    </div>
  );
};

export default Timer;
