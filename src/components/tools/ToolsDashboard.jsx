import React from 'react';
import { Settings, Wrench, Layout } from 'lucide-react';
import Notepad from './Notepad';
import Clock from './Clock';
import Timer from './Timer';
import PasswordGenerator from './PasswordGenerator';
import UrlShortener from './UrlShortener';
import JsonFormatter from './JsonFormatter';
import UnitConverter from './UnitConverter';
import QrGenerator from './QrGenerator';
import ColorTools from './ColorTools';
import UuidGenerator from './UuidGenerator';
import Base64Tool from './Base64Tool';
import RegexTester from './RegexTester';
import HashGenerator from './HashGenerator';
import LoremIpsum from './LoremIpsum';

const ToolsDashboard = () => {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center animate-fadeInUp">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
          The <span className="text-primary text-glow">Void</span> Toolbox
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-body">
          A high-performance cluster of offline-first productivity and developer utilities.
        </p>
      </div>

      {/* Main Grid: Masonry-style simulated with columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Row 1, Col 1 */}
        <div className="flex flex-col gap-6">
          <Clock />
          <Timer />
          <PasswordGenerator />
        </div>

        {/* Row 1, Col 2 */}
        <div className="flex flex-col gap-6">
          <Notepad />
          <ColorTools />
        </div>

        {/* Row 1, Col 3 */}
        <div className="flex flex-col gap-6">
          <UrlShortener />
          <UnitConverter />
        </div>

        {/* Developer Row */}
        <div className="lg:col-span-2">
            <JsonFormatter />
        </div>
        
        <div>
            <QrGenerator />
        </div>

        {/* DevTools Row */}
        <UuidGenerator />
        <Base64Tool />
        <HashGenerator />
        <LoremIpsum />
        <RegexTester />
        
      </div>

      {/* Secondary Tools Footer */}
      <div className="mt-16 pt-8 border-t border-border/30 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-tighter text-muted">
             <Settings className="w-3 h-3" /> System Optimized
         </div>
         <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-tighter text-muted">
             <Wrench className="w-3 h-3" /> Developer Grade
         </div>
         <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-tighter text-muted">
             <Layout className="w-3 h-3" /> Modular Interface
         </div>
      </div>
    </div>
  );
};

export default ToolsDashboard;
