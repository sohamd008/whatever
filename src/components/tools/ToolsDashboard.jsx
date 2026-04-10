import React from 'react';
import { Settings, Wrench } from 'lucide-react';
import Notepad from './Notepad';
import Clock from './Clock';
import Timer from './Timer';
import PasswordGenerator from './PasswordGenerator';
import UrlShortener from './UrlShortener';

const ToolsDashboard = () => {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center animate-fadeInUp">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
          The <span className="text-primary">Void</span> Toolbox
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          A collection of privacy-focused, offline-first productivity tools. No tracking, no data collection, just pure utility.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Clock & Timer Column */}
        <div className="flex flex-col gap-6">
          <Clock />
          <Timer />
        </div>

        {/* Notepad (Span 2 rows on desktop) */}
        <div className="lg:row-span-2">
          <Notepad />
        </div>

        {/* Utilities */}
        <div className="flex flex-col gap-6">
          <PasswordGenerator />
          <UrlShortener />
        </div>
        
      </div>

      {/* Secondary Tools Footer */}
      <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-tighter text-muted">
             <Settings className="w-3 h-3" /> System Optimized
         </div>
         <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-tighter text-muted">
             <Wrench className="w-3 h-3" /> Developer Grade
         </div>
      </div>
    </div>
  );
};

export default ToolsDashboard;
