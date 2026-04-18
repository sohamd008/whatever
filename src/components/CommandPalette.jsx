import React, { useEffect, useRef, useState } from 'react';
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

const HELP_CARDS = [
  {
    title: 'Shortcuts',
    lines: [
      'CTRL/CMD + K opens the command palette.',
      '/ jumps straight into search from any page.',
      'UP/DOWN + ENTER navigates the current result set.',
    ],
  },
  {
    title: 'Try Searching',
    lines: [
      'notes for the local markdown pad.',
      'snake or tetris for arcade titles.',
      'shortener or console for link tools.',
    ],
  },
];

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isTypingField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
          setShowHelp(false);
          return;
        }

        setQuery('');
        setSelectedIndex(0);
        setShowHelp(false);
        setIsOpen(true);
        return;
      }

      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false);
          setShowHelp(false);
        }
        return;
      }

      if (!e.ctrlKey && !e.metaKey && !isTypingField) {
        if (e.key === '/') {
          e.preventDefault();
          setQuery('');
          setSelectedIndex(0);
          setShowHelp(false);
          setIsOpen(true);
        }

        if (e.key === '?') {
          e.preventDefault();
          setQuery('');
          setSelectedIndex(0);
          setShowHelp(true);
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const timer = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? searchItems.filter((item) => {
        const haystack = [item.title, item.category, ...(item.keywords || [])]
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
    : searchItems;

  const openItem = (item) => {
    if (!item) return;

    if (/^https?:\/\//i.test(item.path)) {
      window.open(item.path, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = item.path;
    }

    setIsOpen(false);
    setShowHelp(false);
  };

  const handleNav = (e) => {
    if (showHelp) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        setShowHelp(false);
      }
      return;
    }

    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      openItem(filteredItems[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto animate-fadeIn"
        onClick={() => {
          setIsOpen(false);
          setShowHelp(false);
        }}
      />

      <div className="relative w-full max-w-2xl bg-white/[0.04] backdrop-blur-3xl border border-white/[0.1] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] pointer-events-auto overflow-hidden animate-zoomIn">
        <div className="flex items-center px-4 border-b border-white/[0.06] bg-white/[0.02]">
          <Search className="w-5 h-5 text-muted/50" />
          <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-transparent border-none outline-none px-4 py-5 text-white placeholder:text-muted/30 font-body text-lg"
            placeholder={showHelp ? 'Help mode - type to search or press Esc to close help' : 'Type a command or search...'}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
              if (showHelp) setShowHelp(false);
            }}
            onKeyDown={handleNav}
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <span className="text-[10px] font-mono text-muted/40 uppercase">ESC TO CLOSE</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-3">
          {showHelp ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {HELP_CARDS.map((card) => (
                <div key={card.title} className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-4">
                  <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.25em] text-primary">{card.title}</p>
                  <div className="space-y-2 text-sm text-white/80">
                    {card.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = IconMap[item.icon] || Command;
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={item.title + item.path}
                    onClick={() => openItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-left relative group ${isSelected ? 'bg-primary/10 border border-primary/20 backdrop-blur-sm' : 'bg-transparent border border-transparent hover:bg-white/[0.03]'}`}
                  >
                    <div className={`p-2.5 rounded-xl border transition-all ${isSelected ? 'bg-primary/20 border-primary/30 text-primary shadow-gold-glow' : 'bg-white/[0.04] border-white/[0.06] text-muted group-hover:text-white'}`}>
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

        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.06] flex justify-between items-center backdrop-blur-xl">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded text-[10px] font-mono text-muted font-bold">UP/DOWN</kbd>
              <span className="text-[10px] text-muted/30 uppercase tracking-tighter font-mono">Navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded text-[10px] font-mono text-muted font-bold">ENTER</kbd>
              <span className="text-[10px] text-muted/30 uppercase tracking-tighter font-mono">Select</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-muted/20 uppercase tracking-[0.2em]">
            soham.eu.cc
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
