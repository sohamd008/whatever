import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full min-h-[200px]">
      <div className="text-5xl md:text-6xl font-mono font-bold text-primary tracking-tighter drop-shadow-[0_0_15px_rgba(247,147,26,0.5)]">
        {timeStr}
      </div>
      <div className="mt-4 text-muted font-heading uppercase tracking-widest text-xs font-semibold">
        {dateStr}
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4 w-full text-center">
        <div className="bg-black/40 rounded-lg p-2 border border-white/5">
          <div className="text-white font-bold">{time.getHours()}</div>
          <div className="text-[10px] text-muted uppercase">Hrs</div>
        </div>
        <div className="bg-black/40 rounded-lg p-2 border border-white/5">
          <div className="text-white font-bold">{time.getMinutes()}</div>
          <div className="text-[10px] text-muted uppercase">Min</div>
        </div>
        <div className="bg-black/40 rounded-lg p-2 border border-white/5">
          <div className="text-white font-bold">{time.getSeconds()}</div>
          <div className="text-[10px] text-muted uppercase">Sec</div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
