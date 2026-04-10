import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Home, Gamepad2, Wrench, Terminal, Cpu, 
  Layers, Wind, Zap, Activity, Divide, Link, 
  FileText, ArrowLeftRight, QrCode, Brackets, 
  Palette, Timer, Clock, Mail, Music, Command, X
} from 'lucide-react';
import { searchItems } from '../data/searchData';

const IconMap = {
  Home, Gamepad2, Tool: Wrench, Terminal, Cpu, 
  Layers, Wind, Zap, Activity, Divide, Link, 
  FileText, ArrowLeftRight, QrCode, Brackets, 
  Palette, Timer, Clock, Github: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.4 5.4 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ), Mail, Music
};

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Toggle Logic
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Logic
  const filteredItems = searchItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Focus Input on Open
  useEffect(() => {
    if (isOpen) {
        setQuery('');
        setSelectedIndex(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard Navigation
  const handleNav = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
          window.location.href = selected.path;
          setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fadeIn"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Window */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-2xl bg-surface/90 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden animate-zoomIn"
      >
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-white/5 bg-black/20">
          <Search className="w-5 h-5 text-muted/50" />
          <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-transparent border-none outline-none px-4 py-5 text-white placeholder:text-muted/30 font-body text-lg"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleNav}
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
            <span className="text-[10px] font-mono text-muted/40 uppercase">ESC TO CLOSE</span>
          </div>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-3">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = IconMap[item.icon] || Command;
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.title + item.path}
                    onClick={() => { window.location.href = item.path; setIsOpen(false); }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-left relative group ${isSelected ? 'bg-primary/20 border-primary/20' : 'bg-transparent border-transparent'}`}
                  >
                    <div className={`p-2.5 rounded-xl border transition-all ${isSelected ? 'bg-primary/20 border-primary/40 text-primary shadow-gold-glow' : 'bg-white/5 border-white/5 text-muted group-hover:text-white'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-white/80'}`}>
                        {item.title}
                      </div>
                      <div className="text-[10px] font-mono text-muted/40 uppercase tracking-tighter">
                        {item.category}
                      </div>
                    </div>

                    {isSelected && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-md border border-primary/20">
                           <span className="text-[9px] font-mono text-primary font-black uppercase">ENTER</span>
                        </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <X className="w-8 h-8 text-red-500/50" />
              </div>
              <p className="text-muted/60 font-mono text-xs uppercase tracking-widest">No matching sectors found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-muted font-bold">↑↓</kbd>
                    <span className="text-[10px] text-muted/30 uppercase tracking-tighter font-mono">Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-muted font-bold">↵</kbd>
                    <span className="text-[10px] text-muted/30 uppercase tracking-tighter font-mono">Select</span>
                </div>
             </div>
             <div className="text-[10px] font-mono text-primary/40 uppercase tracking-[0.2em] font-black animate-pulse">
                Void System OS_v1.0
             </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
