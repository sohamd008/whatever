import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

const Leaderboard = ({ gameKey, currentScore = 0 }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    loadScores();
  }, [gameKey]);

  const loadScores = () => {
    try {
      const data = localStorage.getItem(`leaderboard_${gameKey}`);
      setScores(data ? JSON.parse(data) : []);
    } catch { setScores([]); }
  };

  const saveScore = (score) => {
    if (!score) return;
    const newScores = [...scores, { score, date: Date.now() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    localStorage.setItem(`leaderboard_${gameKey}`, JSON.stringify(newScores));
    setScores(newScores);
  };

  useEffect(() => {
    if (currentScore > 0 && (!scores[0] || currentScore > scores[0].score)) {
      saveScore(currentScore);
    }
  }, [currentScore]);

  if (scores.length === 0) return null;

  return (
    <div className="absolute top-6 right-6 z-50">
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[120px]">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-3 h-3 text-tertiary" />
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Best</span>
        </div>
        <p className="text-xl font-bold font-mono text-tertiary">{scores[0]?.score || 0}</p>
      </div>
    </div>
  );
};

export default Leaderboard;