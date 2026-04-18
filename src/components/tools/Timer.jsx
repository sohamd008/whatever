import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const BEEP_DATA = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT19vT18=";
const DEFAULT_TIMER = { h: 0, m: 5, s: 0, total: 300 };

const loadSavedTimer = () => {
  if (typeof window === 'undefined') return DEFAULT_TIMER;

  try {
    const raw = window.localStorage.getItem('void_timer_v2');
    if (!raw) return DEFAULT_TIMER;

    const saved = JSON.parse(raw);
    return {
      h: Number.isFinite(saved.h) ? saved.h : DEFAULT_TIMER.h,
      m: Number.isFinite(saved.m) ? saved.m : DEFAULT_TIMER.m,
      s: Number.isFinite(saved.s) ? saved.s : DEFAULT_TIMER.s,
      total: Number.isFinite(saved.total) ? saved.total : DEFAULT_TIMER.total,
    };
  } catch {
    return DEFAULT_TIMER;
  }
};

const splitSeconds = (totalSeconds) => {
  const clamped = Math.max(0, totalSeconds);
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;

  return { hours, minutes, seconds };
};

const Timer = () => {
  const savedTimer = loadSavedTimer();
  const initialRemaining = (savedTimer.h * 3600) + (savedTimer.m * 60) + savedTimer.s;

  const [remainingSeconds, setRemainingSeconds] = useState(initialRemaining);
  const [configuredSeconds, setConfiguredSeconds] = useState(savedTimer.total || initialRemaining || DEFAULT_TIMER.total);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const audioRef = useRef(null);

  const { hours: hh, minutes: mm, seconds: ss } = splitSeconds(remainingSeconds);
  const progress = configuredSeconds > 0 ? Math.max(0, (remainingSeconds / configuredSeconds) * 100) : 0;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem('void_timer_v2', JSON.stringify({
      h: hh,
      m: mm,
      s: ss,
      total: configuredSeconds,
    }));
  }, [hh, mm, ss, configuredSeconds]);

  useEffect(() => {
    if (!isActive || remainingSeconds === 0) return undefined;

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setIsActive(false);
          if (soundEnabled) {
            audioRef.current?.play().catch(() => {});
          }
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isActive, remainingSeconds, soundEnabled]);

  const toggle = () => {
    if (!isActive && remainingSeconds === 0) return;
    if (!isActive) setConfiguredSeconds(remainingSeconds);
    setIsActive((prev) => !prev);
    setIsEditing(null);
  };

  const reset = () => {
    const saved = loadSavedTimer();
    setIsActive(false);
    setRemainingSeconds((saved.h * 3600) + (saved.m * 60) + saved.s);
    setConfiguredSeconds(saved.total);
    setIsEditing(null);
  };

  const handleEdit = (type, val) => {
    if (isActive) return;

    const nextValue = Math.max(0, Math.min(type === 'hh' ? 99 : 59, parseInt(val, 10) || 0));
    const next = { hh, mm, ss };
    next[type] = nextValue;

    const nextTotal = (next.hh * 3600) + (next.mm * 60) + next.ss;
    setRemainingSeconds(nextTotal);
    setConfiguredSeconds(nextTotal);
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
    <div className="p-6 glass-card rounded-3xl h-full flex flex-col items-center justify-center relative overflow-hidden group">
      <audio ref={audioRef} src={BEEP_DATA} />

      <div className="absolute top-4 right-4 z-10">
        <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1.5 text-muted hover:text-primary transition-colors bg-black/40 rounded-full border border-white/5">
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r="75" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
          <circle
            cx="80"
            cy="80"
            r="75"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={471}
            strokeDashoffset={471 - (471 * progress) / 100}
            className={`transition-all duration-1000 ${hh === 0 && mm === 0 && ss < 10 && isActive ? 'text-red-500' : 'text-primary'}`}
          />
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
