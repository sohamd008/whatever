import React, { useState } from 'react';
import { Trophy } from 'lucide-react';

const loadScores = (gameKey) => {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(`leaderboard_${gameKey}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const Leaderboard = ({ gameKey, currentScore = 0 }) => {
  const [scores] = useState(() => loadScores(gameKey));
  const bestScore = Math.max(scores[0]?.score || 0, currentScore || 0);

  if (bestScore <= 0) return null;

  return (
    <div className="absolute top-6 right-6 z-50">
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[120px]">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-3 h-3 text-tertiary" />
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Best</span>
        </div>
        <p className="text-xl font-bold font-mono text-tertiary">{bestScore}</p>
      </div>
    </div>
  );
};

export default Leaderboard;
