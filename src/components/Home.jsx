import React from 'react';
import { Mail, Disc, Terminal, PlayCircle, Zap, FileText, Palette, Hammer } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.4 5.4 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center container mx-auto max-w-7xl px-6 py-28 text-center animate-fadeInUp">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-10 animate-float backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping block absolute"></span>
            <span className="w-2 h-2 rounded-full bg-primary block relative z-10"></span>
            <span className="text-[10px] font-mono font-bold text-primary tracking-[0.3em] pl-2 uppercase">Systems Online // 2026</span>
        </div>
        
        <h1 className="font-heading font-black text-5xl sm:text-7xl md:text-9xl tracking-tighter leading-[0.85] mb-8">
          <span className="text-white block opacity-90">Soham</span>
          <span className="bg-gradient-to-r from-primary via-tertiary to-primary bg-[length:200%_auto] animate-gradient text-transparent bg-clip-text block mt-2 text-glow">Dandekar</span>
        </h1>
        
        <p className="text-muted text-lg md:text-2xl max-w-3xl mx-auto mb-14 font-medium leading-relaxed opacity-80">
          Personal site, browser toolkit, retro arcade, and digital archive work. <br className="hidden md:block" />
          Building precise web experiences with a soft spot for preservation projects and playful interfaces.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <Button href="/toolbox" variant="primary" className="h-14 px-10 text-base shadow-gold-glow hover:scale-105 transition-all">
            <Hammer className="w-5 h-5 mr-3" /> Launch Toolbox
          </Button>
          <Button href="/games" variant="outline" className="h-14 px-10 text-base border-white/10 hover:border-white/40 hover:bg-white/5">
            <PlayCircle className="w-5 h-5 mr-3" /> Enter Arcade
          </Button>
        </div>

        {/* Scannable Feature Grid */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 w-full opacity-60">
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted">URL Shortener</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <FileText className="w-5 h-5 text-tertiary" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Local Notes</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <Palette className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Color Tools</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <Terminal className="w-5 h-5 text-tertiary" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Link Console</span>
            </div>
        </div>
      </main>

      {/* Featured Projects Section */}
      <section id="projects" className="container mx-auto max-w-7xl px-6 py-32 animate-fadeInUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
        <div className="mb-16">
          <h2 className="font-heading font-black text-4xl md:text-6xl text-white mb-6 uppercase tracking-tighter">
            The <span className="text-primary italic">Archive</span>
          </h2>
          <div className="h-1.5 w-32 bg-gradient-to-r from-primary to-transparent rounded-full shadow-gold-glow"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Card className="flex flex-col h-full relative overflow-hidden group border-white/5 hover:border-primary/20 transition-all duration-500">
            {/* Decorative background icon */}
            <div className="absolute -right-12 -bottom-12 opacity-[0.02] group-hover:opacity-10 transition-all duration-700 transform group-hover:rotate-[30deg] group-hover:scale-125">
              <Disc className="w-80 h-80 text-primary" />
            </div>
            
            <div className="flex-grow relative z-10 p-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-tertiary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-inner ring-1 ring-white/5">
                <Disc className="w-7 h-7 text-primary animate-pulse" />
              </div>
              
              <h3 className="font-heading font-black text-3xl text-white mb-4 tracking-tighter uppercase italic">Swaramanjusha</h3>
              <p className="text-muted text-lg leading-relaxed mb-8 opacity-70">
                An extensive digital archive dedicated to the preservation of rare melodies. Bridging the gap between ancient heritage and modern accessibility.
              </p>
            </div>
            
            <div className="mt-auto pt-8 border-t border-white/5 relative z-10 flex items-center justify-between">
              <a 
                href="https://swaramanjusha.eu.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-mono font-black text-primary hover:text-white transition-all tracking-[0.2em] group/link"
              >
                ACCESS REPOSITORY
                <svg className="w-4 h-4 ml-3 transition-transform group-hover/link:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <div className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[8px] font-mono text-muted/30 uppercase tracking-widest italic">Live Instance</div>
            </div>
          </Card>
        </div>
      </section>

      {/* Global Connectivity / Contact Section */}
      <section id="contact" className="container mx-auto max-w-7xl px-6 py-32 mb-20 animate-fadeInUp" style={{ animationDelay: '0.4s', opacity: 0 }}>
        <Card glass className="text-center py-20 px-10 max-w-5xl mx-auto relative overflow-hidden group shadow-2xl border-white/5 rounded-[3rem]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 group-hover:bg-primary/30 transition-all duration-1000 animate-pulse"></div>
            
            <h2 className="font-heading font-black text-4xl md:text-7xl text-white mb-8 tracking-tighter uppercase italic">
              Ready for <span className="text-tertiary">Deployment?</span>
            </h2>
            <p className="text-muted text-xl max-w-2xl mx-auto mb-14 font-medium opacity-80 leading-relaxed">
              Open for collaboration on high-performance web systems, interaction design, and technical engineering. Let's build the future together.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <Button href="mailto:sohamd008@gmail.com" variant="primary" className="h-16 px-10 text-lg shadow-gold-glow">
                <Mail className="w-5 h-5 mr-4" />
                Connectivity
              </Button>
              <Button href="https://github.com/sohamd008" variant="outline" className="h-16 px-10 text-lg border-white/10">
                <GithubIcon className="w-5 h-5 mr-4" />
                Repository
              </Button>
            </div>
        </Card>
      </section>
    </>
  );
};

export default Home;
