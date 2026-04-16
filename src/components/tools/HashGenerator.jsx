import React, { useState } from 'react';
import { FileKey, Copy, Check } from 'lucide-react';

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({});
  const [copied, setCopied] = useState('');

  const generateHashes = async () => {
    if (!input.trim()) return;
    
    const enc = new TextEncoder();
    const data = enc.encode(input);
    
    const sha256 = await crypto.subtle.digest('SHA-256', data).then(b => bufferToHex(b));
    const sha384 = await crypto.subtle.digest('SHA-384', data).then(b => bufferToHex(b));
    const sha512 = await crypto.subtle.digest('SHA-512', data).then(b => bufferToHex(b));
    
    setHashes({ SHA256: sha256, SHA384: sha384, SHA512: sha512 });
  };

  const bufferToHex = (buffer) => {
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const copy = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopied(hash);
    setTimeout(() => setCopied(''), 2000);
  };

  const hashTypes = ['SHA256', 'SHA384', 'SHA512'];

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <FileKey className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">HASH GEN</h3>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-xs text-white outline-none focus:border-primary/50 resize-none"
          />
        </div>

        <button onClick={generateHashes} className="py-2 bg-primary/20 border border-primary/50 text-primary rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all">
          Generate Hashes
        </button>

        <div className="flex flex-col gap-2 flex-grow overflow-auto">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Output</label>
          <div className="flex flex-col gap-2 max-h-40 overflow-auto">
            {hashTypes.map((type) => (
              <div key={type} className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col gap-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-primary uppercase">{type}</span>
                  <button onClick={() => copy(hashes[type])} className="text-muted hover:text-white transition-colors">
                    {copied === hashes[type] ? <span className="text-green-500 text-[10px]">COPIED</span> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <code className="text-[10px] font-mono text-muted break-all">
                  {hashes[type] || '—'}
                </code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;