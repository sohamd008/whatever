import React from 'react';
import { Gamepad2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
  const isCustom = game.type === 'custom';
  
  const content = (
    <div className={`relative flex flex-col h-full rounded-2xl overflow-hidden group bg-surface border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-elevation ${game.featured ? 'col-span-1 md:col-span-2 lg:col-span-2 shadow-elevation border-primary/30' : ''}`}>
      
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10"></div>
        <img 
          src={game.thumbnail} 
          alt={game.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
          {game.tags.map(tag => (
            <span key={tag} className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded bg-black/50 backdrop-blur-md text-white border border-white/10">
              {tag}
            </span>
          ))}
        </div>
        {game.featured && (
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 text-xs font-mono font-bold tracking-widest text-[#030304] bg-tertiary rounded-full shadow-[0_0_15px_rgba(255,214,0,0.5)]">
              FEATURED
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-20 p-6 flex-grow flex flex-col">
        <h3 className="font-heading font-bold text-xl text-white mb-2 flex flex-col group-hover:text-primary transition-colors">
          {game.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed flex-grow">
          {game.description}
        </p>
        
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono text-muted/60 tracking-wider">
            By {game.developer}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            {isCustom ? (
              <Gamepad2 className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            ) : (
              <ExternalLink className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isCustom) {
    return <Link to={game.path} className="block h-full">{content}</Link>;
  }

  // Embedded games open in a new tab for this basic implementation 
  // (could be an iframe overlay but a new tab is safer for mobile + CORS)
  return (
    <a href={game.url} target="_blank" rel="noopener noreferrer" className="block h-full">
      {content}
    </a>
  );
};

export default GameCard;
