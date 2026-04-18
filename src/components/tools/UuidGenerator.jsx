import React, { useState } from 'react';
import { Hash, Copy, RefreshCw } from 'lucide-react';

const UuidGenerator = () => {
  const [Uuids, setUuids] = useState([]);
  const [version, setVersion] = useState(4);
  const [copied, setCopied] = useState(null);

  const generateUuid = () => {
    const u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return version === 1 ? u.replace(/^4/, '1') : u;
  };

  const generate = (count = 1) => {
    const newUuids = Array.from({ length: count }, () => generateUuid());
    setUuids(newUuids);
  };

  const copy = (uuid, index) => {
    navigator.clipboard.writeText(uuid);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 glass-card h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Hash className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">UUID GEN</h3>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="flex gap-2">
          <button onClick={() => generate(1)} className="flex-1 py-2 bg-primary/20 border border-primary/50 text-primary rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all">
            Generate 1
          </button>
          <button onClick={() => generate(5)} className="flex-1 py-2 bg-primary/20 border border-primary/50 text-primary rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all">
            Generate 5
          </button>
          <button onClick={() => generate(10)} className="flex-1 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
            Generate 10
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Version</label>
          <select
            value={version}
            onChange={(e) => setVersion(Number(e.target.value))}
            className="bg-black/40 border border-white/10 rounded-xl p-2 font-mono text-xs text-white outline-none focus:border-primary/50"
          >
            <option value={4}>v4 (Random)</option>
            <option value={1}>v1 (Timestamp)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 flex-grow overflow-auto">
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Output ({Uuids.length})</label>
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 font-mono text-xs text-primary/80 flex flex-col gap-2 max-h-40 overflow-auto">
            {Uuids.length === 0 ? (
              <span className="text-muted/30 italic">Click generate to create UUIDs</span>
            ) : (
              Uuids.map((uuid, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <span className="font-mono truncate">{uuid}</span>
                  <button onClick={() => copy(uuid, i)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded">
                    {copied === i ? <span className="text-green-500 text-[10px]">COPIED</span> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UuidGenerator;