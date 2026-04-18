import React, { useState } from 'react';
import { XCircle, AlertCircle } from 'lucide-react';

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState('');
  const [matches, setMatches] = useState([]);

  const testRegex = () => {
    setError('');
    setMatches([]);
    if (!pattern.trim()) return;
    
    try {
      const regex = new RegExp(pattern, flags);
      if (!testString) {
        setMatches([]);
        return;
      }
      
      const results = [];
      let match;
      while ((match = regex.exec(testString)) !== null) {
        results.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        if (!flags.includes('g')) break;
      }
      setMatches(results);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">REGEX TEST</h3>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Pattern</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-z]+"
              className="bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-xs text-white outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Flags</label>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="g"
              className="bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-xs text-white outline-none focus:border-primary/50"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against the regex..."
            className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-xs text-white outline-none focus:border-primary/50 resize-none"
          />
        </div>

        <button onClick={testRegex} className="py-2 bg-primary/20 border border-primary/50 text-primary rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all">
          Test Regex
        </button>

        {error && (
          <div className="text-[10px] font-mono text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20 flex items-center gap-2">
            <XCircle className="w-3 h-3" /> {error}
          </div>
        )}

        <div className="flex flex-col gap-2 flex-grow overflow-auto">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">
            Matches ({matches.length})
          </label>
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col gap-2 max-h-40 overflow-auto">
            {matches.length === 0 ? (
              <span className="text-muted/30 italic text-xs">No matches found</span>
            ) : (
              matches.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-green-400">"{m.text}"</span>
                  <span className="text-muted/50">idx: {m.index}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
