import React from 'react';
import { gamesList } from '../data/gamesList';
import GameCard from '../components/games/GameCard';

const Games = () => {
  return (
    <main className="flex-grow flex flex-col py-24 animate-fadeInUp">
      <div className="container mx-auto max-w-7xl px-6 mb-16 text-center">
        <h1 className="font-heading font-extrabold text-5xl md:text-7xl text-white mb-6">
          The <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent text-glow">Arcade</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Enter the grid. {gamesList.length} original games built from scratch, with autoplay modes and AI challengers across most titles.
        </p>
      </div>

      <div className="px-6 w-full max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gamesList.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Games;
