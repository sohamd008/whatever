import React, { useState } from 'react';
import { Lock, Copy, RefreshCcw, ArrowLeftRight } from 'lucide-react';

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = () => {
    setError('');
    try {
      if (!input.trim()) return;
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (err) {
      setError(mode === 'decode' ? 'Invalid Base64 string' : err.message);
      setOutput('');
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const swap = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">BASE64</h3>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        <div className="flex gap-2">
          <button onClick={() => setMode('encode')} className={`flex-1 py-2 border rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all ${mode === 'encode' ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-white'}`}>
            Encode
          </button>
          <button onClick={() => setMode('decode')} className={`flex-1 py-2 border rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all ${mode === 'decode' ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-white'}`}>
            Decode
          </button>
          <button onClick={swap} className="p-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all">
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Input</label>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Hello World' : 'SGVsbG8gV29ybGQ='}
                className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-xs text-white outline-none focus:border-primary/50 resize-none"
            />
        </div>

        <div className="flex gap-2">
            <button onClick={process} className="flex-grow py-2 bg-primary/20 border border-primary/50 text-primary rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all">
                {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
            <button onClick={clear} className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">
                <RefreshCcw className="w-3.5 h-3.5" />
            </button>
        </div>

        {error && <div className="text-[10px] font-mono text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}

        <div className="flex flex-col gap-2 flex-grow relative">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Output</label>
            <textarea
                readOnly
                value={output}
                placeholder="Result will appear here..."
                className="w-full h-24 bg-black/60 border border-white/5 rounded-xl p-3 font-mono text-xs text-primary/80 outline-none resize-none"
            />
            {output && (
                <button onClick={copy} className="absolute right-3 top-9 p-1.5 bg-black/60 hover:bg-white/10 rounded-lg text-muted transition-colors">
                    {copied ? <span className="text-green-500 text-[10px]">COPIED</span> : <Copy className="w-3.5 h-3.5" />}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Base64Tool;