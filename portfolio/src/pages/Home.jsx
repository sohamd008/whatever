import React from 'react';
import { Mail, Disc } from 'lucide-react';
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
      <main className="flex-grow flex flex-col items-center justify-center container mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 animate-float">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping block absolute"></span>
            <span className="w-2 h-2 rounded-full bg-primary block relative z-10"></span>
            <span className="text-xs font-mono font-medium text-primary tracking-widest pl-2">STUDENT & DEV</span>
        </div>
        
        <h1 className="font-heading font-extrabold text-5xl sm:text-6xl md:text-8xl tracking-tight leading-none mb-6">
          <span className="text-white block">Soham</span>
          <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent block mt-2 text-glow">Dandekar</span>
        </h1>
        
        <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Building digital experiences and preserving the past. A student exploring the intersections of technology, music, and the web.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="#projects" variant="primary">
            View Projects
          </Button>
          <Button href="https://github.com/sohamd008" variant="outline">
            <GithubIcon className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
      </main>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Featured <span className="text-primary">Work</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="flex flex-col h-full relative overflow-hidden group">
            {/* Decorative background icon */}
            <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:rotate-12 group-hover:scale-110">
              <Disc className="w-64 h-64 text-tertiary" />
            </div>
            
            <div className="flex-grow relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-tertiary/10 border border-primary/30 flex items-center justify-center mb-6 shadow-elevation">
                <Disc className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="font-heading font-bold text-2xl text-white mb-3 tracking-tight">Swaramanjusha</h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                An extensive digital archive dedicated to the preservation and curation of old and rare music. Ensuring cultural heritage remains accessible for future generations.
              </p>
            </div>
            
            <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
              <a 
                href="https://swaramanjusha.eu.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-mono font-bold text-primary hover:text-tertiary transition-colors"
              >
                VISIT ARCHIVE
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto max-w-7xl px-6 py-24 mb-12">
        <Card glass className="text-center py-16 max-w-4xl mx-auto relative overflow-hidden group shadow-elevation">
            {/* Gradient glow behind the content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-all duration-700"></div>
            
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-6">
              Let's create something <span className="text-tertiary">extraordinary</span>
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto mb-10">
              Whether you have a project in mind or just want to say hi, my inbox is always open.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button href="mailto:sohamd008@gmail.com" variant="primary">
                <Mail className="w-4 h-4 mr-2" />
                sohamd008@gmail.com
              </Button>
              <Button href="https://github.com/sohamd008" variant="outline">
                <GithubIcon className="w-4 h-4 mr-2" />
                @sohamd008
              </Button>
            </div>
        </Card>
      </section>
    </>
  );
};

export default Home;
