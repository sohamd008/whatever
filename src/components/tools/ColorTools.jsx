import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check } from 'lucide-react';

const ColorTools = () => {
  const [hex, setHex] = useState('#F7931A');
  const [rgb, setRgb] = useState('247, 147, 26');
  const [copied, setCopied] = useState(false);

  const hexToRgb = (h) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return isNaN(r) ? null : `${r}, ${g}, ${b}`;
  };

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      const res = hexToRgb(hex);
      if (res) setRgb(res);
    }
  }, [hex]);

  const copy = (val) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">COLOR STUDIO</h3>
      </div>

      <div className="space-y-6 flex-grow">
        <div className="flex flex-col items-center gap-4">
            <div 
                className="w-full h-32 rounded-2xl border border-white/10 shadow-elevation transition-colors duration-300" 
                style={{ backgroundColor: hex }}
            />
            <input 
                type="color" 
                value={hex} 
                onChange={(e) => setHex(e.target.value.toUpperCase())}
                className="w-full h-10 bg-transparent border-none cursor-pointer p-0"
            />
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">HEX</label>
            <div className="relative">
                <input
                    type="text"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 font-mono text-sm text-primary outline-none focus:border-primary/50"
                />
                <button onClick={() => copy(hex)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded">
                    {copied === hex ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted" />}
                </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">RGB</label>
            <div className="relative">
                <input
                    type="text"
                    readOnly
                    value={`rgb(${rgb})`}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 font-mono text-sm text-white/70 outline-none"
                />
                <button onClick={() => copy(`rgb(${rgb})`)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded">
                    {copied === `rgb(${rgb})` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-muted" />}
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-2">
         {['#F7931A', '#06b6d4', '#22c55e', '#ef4444', '#a855f7'].map(c => (
             <button 
                key={c} 
                onClick={() => setHex(c)}
                className="w-8 h-8 rounded-full border border-white/10 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
             />
         ))}
      </div>
    </div>
  );
};

export default ColorTools;
