import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check, Zap, Eye } from 'lucide-react';

const ColorTools = () => {
  const [hex, setHex] = useState('#F7931A');
  const [rgb, setRgb] = useState({ r: 247, g: 147, b: 26 });
  const [hsl, setHsl] = useState({ h: 33, s: 93, l: 54 });
  const [copied, setCopied] = useState(false);

  const updateFromHex = (h) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return;
    
    setRgb({ r, g, b });
    
    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
    let h_ = 0, s, l = (max + min) / 2;

    if (max === min) {
      h_ = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h_ = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h_ = (bNorm - rNorm) / d + 2; break;
        case bNorm: h_ = (rNorm - gNorm) / d + 4; break;
      }
      h_ /= 6;
    }
    setHsl({ h: Math.round(h_ * 360), s: Math.round(s * 100), l: Math.round(l * 100) });
  };

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      updateFromHex(hex);
    }
  }, [hex]);

  const copy = (val) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(false), 2000);
  };

  const palette = [
    hex,
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`,
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
    `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(0, hsl.l - 20)}%)`,
    `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(100, hsl.l + 20)}%)`,
  ];

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full flex flex-col min-h-[420px]">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tighter text-glow">Chroma Core</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 flex-grow">
        <div className="flex gap-4">
            <div 
                className="w-24 h-24 rounded-2xl border border-white/10 shadow-elevation shrink-0" 
                style={{ backgroundColor: hex }}
            />
            <div className="flex-grow flex flex-col justify-center gap-2">
                <div className="h-10 w-full rounded-xl overflow-hidden glass-panel relative">
                    <div className="absolute inset-0 transition-opacity duration-300" style={{ backgroundColor: hex, opacity: 0.1 }} />
                    <input 
                        type="color" 
                        value={hex} 
                        onChange={(e) => setHex(e.target.value.toUpperCase())}
                        className="w-full h-full bg-transparent border-none cursor-pointer scale-150"
                    />
                </div>
                <div className="text-[10px] font-mono text-muted flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" /> PICKER CONNECTED
                </div>
            </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'HEX', val: hex },
            { label: 'RGB', val: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
            { label: 'HSL', val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` }
          ].map(item => (
            <div key={item.label} className="relative group">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[9px] font-mono text-muted/60 uppercase tracking-widest pl-1">{item.label}</label>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={item.val}
                        readOnly
                        className="flex-grow bg-black/40 border border-white/5 rounded-lg px-3 py-2 font-mono text-[11px] text-white/90 outline-none"
                    />
                    <button onClick={() => copy(item.val)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted transition-colors">
                        {copied === item.val ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>
          ))}
        </div>

        <div>
           <label className="text-[9px] font-mono text-muted/60 uppercase tracking-widest pl-1 mb-2 block">AI Palette</label>
           <div className="flex gap-2">
                {palette.map((c, i) => (
                    <button 
                        key={i} 
                        onClick={() => i === 0 && setHex(c)}
                        className="h-8 flex-grow rounded-md border border-white/5 hover:scale-110 transition-transform shadow-lg"
                        style={{ backgroundColor: c }}
                        title={c}
                    />
                ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ColorTools;
