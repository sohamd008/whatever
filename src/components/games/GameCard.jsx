import React from 'react';
import { Gamepad2, ExternalLink } from 'lucide-react';

const GameCard = ({ game }) => {
  const isCustom = game.type === 'custom';
  
  const content = (
    <div className={`relative flex flex-col h-full rounded-2xl overflow-hidden group bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.06] hover:border-white/[0.14] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_60px_-10px_rgba(247,147,26,0.1)] shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] ${game.featured ? 'col-span-1 md:col-span-2 lg:col-span-2 border-primary/20' : ''}`}>
      
      {/* Art Background */}
      <div className="relative h-48 w-full overflow-hidden bg-black/40 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10"></div>
        
        {game.svgArt ? (
          <div 
            className="w-full h-full opacity-50 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
            style={{ 
              filter: `drop-shadow(0 0 10px ${game.color || '#F7931A'}33)`
            }}
            dangerouslySetInnerHTML={{ __html: game.svgArt }}
          />
        ) : (
          <img 
            src={game.thumbnail} 
            alt={game.title}
            className="w-full h-full object-cover opacity-50 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
          />
        )}
        
        {/* Tags */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
          {game.tags.map(tag => (
            <span key={tag} className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded bg-white/[0.06] backdrop-blur-xl text-white border border-white/[0.1]">
              {tag}
            </span>
          ))}
        </div>

        {/* Top-right badges */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
          {game.featured && (
            <span className="px-3 py-1 text-xs font-mono font-bold tracking-widest text-[#030304] bg-tertiary rounded-full shadow-[0_0_15px_rgba(255,214,0,0.5)]">
              FEATURED
            </span>
          )}
          {isCustom ? (
            <span className="px-2 py-1 text-[10px] font-mono font-bold tracking-widest text-primary bg-primary/10 border border-primary/30 rounded-full backdrop-blur-md">
              ORIGINAL
            </span>
          ) : (
            <span className="px-2 py-1 text-[10px] font-mono tracking-widest text-white/30 bg-white/[0.04] border border-white/[0.06] rounded-full flex items-center gap-1 backdrop-blur-md">
              <ExternalLink className="w-2.5 h-2.5" /> NEW TAB
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-20 p-6 flex-grow flex flex-col">
        <h3 className="font-heading font-bold text-xl text-white mb-2 group-hover:text-primary transition-colors duration-300">
          {game.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed flex-grow opacity-70">
          {game.description}
        </p>
        
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs font-mono text-muted/50 tracking-wider">
            By {game.developer}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 border border-white/[0.06]">
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
    return <a href={game.path} className="block h-full">{content}</a>;
  }

  return (
    <a href={game.url} target="_blank" rel="noopener noreferrer" className="block h-full">
      {content}
    </a>
  );
};

export default GameCard;
