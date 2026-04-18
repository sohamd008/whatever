import React, { useState } from 'react';
import { Copy, RefreshCw, Check, ShieldCheck } from 'lucide-react';

const DEFAULT_OPTIONS = {
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true
};

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
};

const pickRandom = (value) => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return value[array[0] % value.length];
};

const shuffle = (value) => {
  const array = value.split('');

  for (let index = array.length - 1; index > 0; index--) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    const swapIndex = buffer[0] % (index + 1);
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }

  return array.join('');
};

const buildPassword = (length, options) => {
  const enabledSets = Object.entries(options)
    .filter(([, isEnabled]) => isEnabled)
    .map(([key]) => CHARSETS[key]);

  if (enabledSets.length === 0) return '';

  let result = enabledSets.map((charset) => pickRandom(charset)).join('');
  const combinedCharset = enabledSets.join('');

  while (result.length < length) {
    result += pickRandom(combinedCharset);
  }

  return shuffle(result.slice(0, length));
};

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [password, setPassword] = useState(() => buildPassword(16, DEFAULT_OPTIONS));
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setPassword(buildPassword(length, options));
    setCopied(false);
  };

  const updateLength = (nextLength) => {
    setLength(nextLength);
    setPassword(buildPassword(nextLength, options));
    setCopied(false);
  };

  const toggleOption = (key) => {
    const nextOptions = { ...options, [key]: !options[key] };
    setOptions(nextOptions);
    setPassword(buildPassword(length, nextOptions));
    setCopied(false);
  };

  const copy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 glass-card h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">SECURITY GEN</h3>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          readOnly
          value={password}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 font-mono text-primary text-lg outline-none"
        />
        <button
          onClick={copy}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="flex justify-between items-center">
          <label className="text-xs font-mono text-muted uppercase tracking-wider">Length: {length}</label>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => updateLength(parseInt(e.target.value, 10))}
            className="w-32 accent-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.entries(options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => toggleOption(key)}
              className={`px-3 py-2 rounded-lg border text-[10px] font-mono uppercase tracking-tighter transition-all ${value ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-black/20 border-white/5 text-muted hover:border-white/20'}`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        className="mt-6 w-full py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group"
      >
        <RefreshCw className="w-3.5 h-3.5 group-active:rotate-180 transition-transform duration-500" />
        Regenerate
      </button>
    </div>
  );
};

export default PasswordGenerator;
