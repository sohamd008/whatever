import React, { useState, useEffect } from 'react';
import { Scale, RefreshCw, ChevronDown } from 'lucide-react';

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
  },
  Data: {
    Bytes: 1,
    Kilobytes: 1/1024,
    Megabytes: 1/Math.pow(1024, 2),
    Gigabytes: 1/Math.pow(1024, 3),
    Terabytes: 1/Math.pow(1024, 4),
    Bits: 8
  },
  Time: {
    seconds: 1,
    minutes: 1/60,
    hours: 1/3600,
    days: 1/86400,
    weeks: 1/604800
  },
  Temp: {
    C: (v) => v,
    F: (v) => (v * 9/5) + 32,
    K: (v) => v + 273.15
  }
};

const UnitConverter = () => {
  const [category, setCategory] = useState('Data');
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('Gigabytes');
  const [toUnit, setToUnit] = useState('Megabytes');
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
      setResult(finalValue.toLocaleString(undefined, { maximumFractionDigits: 4 }));
    }
  }, [value, fromUnit, toUnit, category]);

  return (
    <div className="p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 h-full flex flex-col min-h-[380px]">
      <div className="flex items-center gap-3 mb-6">
        <Scale className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tighter">Unit Nexus</h3>
      </div>

      <div className="relative mb-6">
        <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white appearance-none outline-none focus:border-primary/50"
        >
            {Object.keys(UNITS).map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono text-muted outline-none focus:text-primary transition-colors"
            >
              {Object.keys(UNITS[category]).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-black/60 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-mono text-muted outline-none focus:text-primary transition-colors"
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

        <div className="flex items-center justify-center -my-1 opacity-20">
            <RefreshCw className="w-4 h-4" />
        </div>

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-3xl -mr-8 -mt-8" />
            <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">Calculation</div>
            <div className="text-2xl font-bold text-white font-mono truncate transition-all group-hover:scale-105">
                {result} <span className="text-primary text-[10px] uppercase font-normal">{toUnit}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
