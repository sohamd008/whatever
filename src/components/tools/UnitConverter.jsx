import React, { useState, useEffect } from 'react';
import { Scale, RefreshCw } from 'lucide-react';

const UNITS = {
  Length: {
    meters: 1,
    kilometers: 0.001,
    feet: 3.28084,
    inches: 39.3701,
    miles: 0.000621371
  },
  Weight: {
    kilograms: 1,
    grams: 1000,
    pounds: 2.20462,
    ounces: 35.274,
    stones: 0.157473
  },
  Temp: {
    C: (v) => v,
    F: (v) => (v * 9/5) + 32,
    K: (v) => v + 273.15
  }
};

const UnitConverter = () => {
  const [category, setCategory] = useState('Length');
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [result, setResult] = useState(0);

  useEffect(() => {
    const keys = Object.keys(UNITS[category]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  }, [category]);

  useEffect(() => {
    if (category === 'Temp') {
      let baseC = value;
      if (fromUnit === 'F') baseC = (value - 32) * 5/9;
      if (fromUnit === 'K') baseC = value - 273.15;
      
      let res = baseC;
      if (toUnit === 'F') res = (baseC * 9/5) + 32;
      if (toUnit === 'K') res = baseC + 273.15;
      setResult(res.toFixed(2));
    } else {
      const units = UNITS[category];
      const baseValue = value / units[fromUnit];
      const finalValue = baseValue * units[toUnit];
      setResult(finalValue.toLocaleString(undefined, { maximumFractionDigits: 5 }));
    }
  }, [value, fromUnit, toUnit, category]);

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Scale className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">UNIT CONVERT</h3>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-black/40 rounded-xl border border-white/5">
        {Object.keys(UNITS).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-grow py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-tighter transition-all ${category === cat ? 'bg-primary text-[#030304] font-bold shadow-gold-glow' : 'text-muted hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-primary/50"
            >
              {Object.keys(UNITS[category]).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none focus:border-primary/50"
            >
              {Object.keys(UNITS[category]).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-xl text-white outline-none focus:border-primary/50"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted uppercase">{fromUnit}</div>
        </div>

        <div className="flex items-center justify-center py-2 opacity-30">
            <RefreshCw className="w-4 h-4" />
        </div>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
            <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">Result</div>
            <div className="text-2xl font-bold text-white font-mono truncate">
                {result} <span className="text-primary text-[10px] uppercase">{toUnit}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
