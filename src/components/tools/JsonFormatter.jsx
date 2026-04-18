import React, { useState } from 'react';
import { AlignLeft, Copy, Check, Trash2 } from 'lucide-react';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const processJson = (type) => {
    setError('');
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      if (type === 'format') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
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

  return (
    <div className="p-6 glass-card h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <AlignLeft className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">JSON PARSER</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-grow">
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Input</label>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-xs text-white outline-none focus:border-primary/50 resize-none"
            />
        </div>

        <div className="flex gap-2">
            <button onClick={() => processJson('format')} className="flex-grow py-2 bg-primary/20 border border-primary/50 text-primary rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all">
                Prettify
            </button>
            <button onClick={() => processJson('minify')} className="flex-grow py-2 bg-white/5 border border-white/10 text-white rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                Minify
            </button>
            <button onClick={clear} className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>

        {error && <div className="text-[10px] font-mono text-red-500 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}

        <div className="flex flex-col gap-2 flex-grow relative">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">Output</label>
            <textarea
                readOnly
                value={output}
                placeholder="Result will appear here..."
                className="w-full h-40 bg-black/60 border border-white/5 rounded-xl p-3 font-mono text-xs text-primary/80 outline-none resize-none"
            />
            {output && (
                <button onClick={copy} className="absolute right-3 bottom-3 p-1.5 bg-black/60 hover:bg-white/10 rounded-lg text-muted transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
