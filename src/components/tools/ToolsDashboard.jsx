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
import JwtDecoder from './JwtDecoder';

const ToolsDashboard = () => {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-12 text-center animate-fadeInUp">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-foreground mb-4">
          The <span className="text-primary text-glow">Void</span> Toolbox
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto font-body">
          A local-first cluster of productivity and developer utilities, with a few network-backed helpers where they add real value.
        </p>
      </div>

      {/* Main Grid: Masonry-style simulated with columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Row 1, Col 1 */}
        <div className="flex flex-col gap-6">
          <section id="clock" className="scroll-mt-28">
            <Clock />
          </section>
          <section id="timer" className="scroll-mt-28">
            <Timer />
          </section>
          <PasswordGenerator />
        </div>

        {/* Row 1, Col 2 */}
        <div className="flex flex-col gap-6">
          <section id="notepad" className="scroll-mt-28">
            <Notepad />
          </section>
          <section id="color-tools" className="scroll-mt-28">
            <ColorTools />
          </section>
        </div>

        {/* Row 1, Col 3 */}
        <div className="flex flex-col gap-6">
          <section id="url-shortener" className="scroll-mt-28">
            <UrlShortener />
          </section>
          <section id="unit-converter" className="scroll-mt-28">
            <UnitConverter />
          </section>
        </div>

        {/* Developer Row */}
        <div id="json-formatter" className="lg:col-span-2 scroll-mt-28">
            <JsonFormatter />
        </div>
        
        <div id="qr-generator" className="scroll-mt-28">
            <QrGenerator />
        </div>

        {/* DevTools Row */}
        <div id="uuid-generator" className="scroll-mt-28">
          <UuidGenerator />
        </div>
        <div id="base64-tool" className="scroll-mt-28">
          <Base64Tool />
        </div>
        <div id="hash-generator" className="scroll-mt-28">
          <HashGenerator />
        </div>
        <div id="lorem-ipsum" className="scroll-mt-28">
          <LoremIpsum />
        </div>
        <div id="jwt-decoder" className="scroll-mt-28">
          <JwtDecoder />
        </div>
        <div id="regex-tester" className="scroll-mt-28">
          <RegexTester />
        </div>
        
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
