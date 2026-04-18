import React, { useState } from 'react';
import { QrCode, Download, RefreshCw, Type } from 'lucide-react';

const QrGenerator = () => {
  const [text, setText] = useState('https://soham.eu.cc');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use a cleaner URL format. QRServer doesn't like some custom dash-separated hex codes.
  // We'll stick to a clean monochrome look that fits the theme perfectly.
  const qrUrl = text 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}&color=f7931a&bgcolor=030304` 
    : null;

  const download = async () => {
    if (!qrUrl) return;
    setIsGenerating(true);
    try {
        const resp = await fetch(qrUrl);
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-code-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
    } catch(e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 glass-card h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tighter">QR Matrix</h3>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="relative">
          <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text or URL..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 font-mono text-sm text-white outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-black/60 rounded-2xl border border-white/5 relative group min-h-[220px]">
          {text ? (
             <img 
               src={qrUrl} 
               alt="QR Code" 
               className="w-40 h-40 rounded-lg shadow-[0_0_30px_rgba(247,147,26,0.2)] transition-opacity duration-300" 
               onLoad={() => setIsGenerating(false)}
             />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center text-muted/10 border border-dashed border-white/5 rounded-lg">
                <QrCode className="w-12 h-12" />
            </div>
          )}
          
          {text && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-sm">
                <button 
                  onClick={download} 
                  disabled={isGenerating}
                  className="px-6 py-2 bg-primary text-[#030304] font-mono text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    {isGenerating ? 'PROCESSING' : 'SAVE TO DISK'}
                </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-[9px] font-mono text-muted/30 text-center uppercase tracking-[0.2em] animate-pulse">
        Generated via QRServer API
      </div>
    </div>
  );
};

export default QrGenerator;
