import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';

const SYMBOLS = ['₿', 'Ξ', '◎', '⬡', '⬢', '◈', '✦', '⚡'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck() {
  return shuffle([...SYMBOLS, ...SYMBOLS].map((sym, i) => ({
    id: i,
    symbol: sym,
    flipped: false,
    matched: false,
  })));
}

export default function MemoryMatch() {
  const [cards, setCards] = useState(createDeck);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (cards.every(c => c.matched)) {
      setWon(true);
      setRunning(false);
    }
  }, [cards]);

  useEffect(() => {
    if (selected.length !== 2) return;
    setLocked(true);
    const [a, b] = selected;
    if (cards[a].symbol === cards[b].symbol) {
      setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
      setSelected([]);
      setLocked(false);
    } else {
      setTimeout(() => {
        setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c));
        setSelected([]);
        setLocked(false);
      }, 900);
    }
    setMoves(m => m + 1);
  }, [selected]);

  const flip = useCallback((idx) => {
    if (locked || cards[idx].flipped || cards[idx].matched || selected.length >= 2) return;
    if (!running && !won) setRunning(true);
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
    setSelected(prev => [...prev, idx]);
  }, [locked, cards, selected, running, won]);

  const restart = () => {
    setCards(createDeck());
    setSelected([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
    setTimer(0);
    setRunning(false);
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center relative select-none p-4">
      <div className="absolute top-8 left-8 z-50">
        <a href="/games" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-mono uppercase text-sm tracking-wider bg-surface px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ArrowLeft className="w-4 h-4" /> Arcade
        </a>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-2">
          Crypto <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">Match</span>
        </h1>
        <p className="text-muted font-mono text-sm">Flip and match all the crypto symbols</p>
      </div>

      {/* HUD */}
      <div className="flex gap-8 mb-8 font-mono">
        <div className="text-center">
          <p className="text-xs text-muted tracking-widest uppercase">Moves</p>
          <p className="text-3xl font-bold text-primary">{moves}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted tracking-widest uppercase">Time</p>
          <p className="text-3xl font-bold text-tertiary">{fmtTime(timer)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted tracking-widest uppercase">Pairs</p>
          <p className="text-3xl font-bold text-white">{cards.filter(c => c.matched).length / 2}/{SYMBOLS.length}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-sm md:max-w-md w-full">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => flip(idx)}
            className={`
              aspect-square rounded-xl text-3xl md:text-4xl font-bold transition-all duration-300 border
              ${card.matched
                ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(247,147,26,0.3)] scale-95 cursor-default'
                : card.flipped
                  ? 'bg-surface border-white/20 text-white scale-100'
                  : 'bg-surface/50 border-white/5 hover:border-white/20 hover:bg-surface text-transparent hover:scale-105 active:scale-95'
              }
            `}
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.3s, background 0.2s, border 0.2s' }}
            aria-label={card.flipped || card.matched ? card.symbol : 'Hidden card'}
          >
            {card.flipped || card.matched ? card.symbol : '?'}
          </button>
        ))}
      </div>

      <button
        onClick={restart}
        className="mt-8 px-8 py-2 font-mono text-sm text-muted border border-white/10 rounded-full hover:border-primary/50 hover:text-primary transition-all tracking-widest uppercase"
      >
        Restart
      </button>

      {/* Win overlay */}
      {won && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-4xl font-heading font-bold text-tertiary mb-2">You Win!</h2>
          <p className="text-white font-mono text-lg mb-1">{moves} moves · {fmtTime(timer)}</p>
          {moves <= 12 && <p className="text-primary font-mono text-sm mb-6">PERFECT GAME!</p>}
          {moves > 12 && <p className="text-muted font-mono text-sm mb-6">Can you do better?</p>}
          <button
            onClick={restart}
            className="px-10 py-3 bg-gradient-to-r from-secondary to-primary text-white font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-orange-glow font-mono"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
