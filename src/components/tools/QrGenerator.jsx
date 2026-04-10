import React, { useState } from 'react';
import { QrCode, Download, Share2 } from 'lucide-react';

const QrGenerator = () => {
  const [text, setText] = useState('https://soham.eu.cc');
  
  const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}&bgcolor=3-3-4&color=f7-93-1a` : null;

  const download = async () => {
    if (!qrUrl) return;
    const resp = await fetch(qrUrl);
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <QrCode className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">QR GENERATOR</h3>
      </div>

      <div className="space-y-4 flex-grow">
        <div>
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1 mb-1 block">Content</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text or URL..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5 relative group">
          {qrUrl ? (
             <img src={qrUrl} alt="QR Code" className="w-48 h-48 rounded-lg shadow-elevation" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-muted/20 border border-dashed border-white/10 rounded-lg">
                <QrCode className="w-12 h-12" />
            </div>
          )}
          
          {qrUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-sm">
                <button onClick={download} className="px-6 py-2 bg-primary text-[#030304] font-mono text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                    <Download className="w-3.5 h-3.5" /> Download PNG
                </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-[9px] font-mono text-muted/40 text-center italic uppercase tracking-tighter">
        Generating high-res Bitcoin-Orange QR
      </div>
    </div>
  );
};

export default QrGenerator;
