import React, { useState, useRef, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TerminalSquare, Send, Cpu } from 'lucide-react';

const TheOracle = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'oracle', text: "INITIALIZING NEURAL LINK...\nCONNECTION ESTABLISHED.\nI AM THE ORACLE. DESIGNATION: VOID_AI.\n\nAWAITING QUERY INPUT." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'oracle', text: data.error || "CONNECTION FAILED.", isError: true }]);
      } else {
        setMessages(prev => [...prev, { role: 'oracle', text: data.response }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'oracle', text: "CRITICAL NETWORK FAILURE. EDGE OF VOID REACHED.", isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="h-[400px] border-tertiary/20 shadow-[-10px_10px_30px_-5px_rgba(var(--tertiary),0.1)] relative overflow-hidden group flex flex-col bg-black/80">
      <CardHeader className="border-b border-tertiary/10 bg-tertiary/5 pb-3 flexshrink-0">
        <CardTitle className="flex items-center gap-2 text-tertiary text-glow font-mono uppercase tracking-widest text-sm">
          <Cpu className="w-5 h-5 text-tertiary" /> The Oracle [AI]
        </CardTitle>
        <p className="text-[10px] text-tertiary/50 font-mono mt-2 uppercase tracking-widest">Powered by Llama-3 Edge Compute</p>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar font-mono text-sm space-y-5">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className={`text-[9px] mb-1 opacity-50 uppercase tracking-widest ${msg.role === 'user' ? 'text-primary' : 'text-tertiary'}`}>
                {msg.role === 'user' ? 'USER_INPUT' : 'ORACLE_DATA'}
              </span>
              <div className={`p-3 rounded-lg max-w-[85%] border backdrop-blur-sm shadow-xl ${
                  msg.role === 'user' 
                    ? 'border-primary/20 bg-primary/10 text-primary text-right' 
                    : msg.isError 
                      ? 'border-red-500/30 bg-red-500/10 text-red-400'
                      : 'border-tertiary/20 bg-tertiary/10 text-tertiary whitespace-pre-wrap tracking-tight'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex flex-col items-start">
               <span className="text-[9px] mb-1 opacity-50 uppercase tracking-widest text-tertiary">ANALYZING</span>
               <div className="p-3, py-4 rounded-lg border border-tertiary/20 bg-tertiary/5 flex items-center gap-1.5 px-4">
                 <div className="w-1.5 h-1.5 bg-tertiary/80 animate-pulse rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-tertiary/80 animate-pulse rounded-full" style={{animationDelay: '150ms'}}></div>
                 <div className="w-1.5 h-1.5 bg-tertiary/80 animate-pulse rounded-full" style={{animationDelay: '300ms'}}></div>
               </div>
             </div>
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-3 border-t border-tertiary/10 shrink-0 bg-black/60 flex items-center gap-3">
          <TerminalSquare className="w-5 h-5 text-tertiary/50 shrink-0" />
          <input
            type="text"
            className="flex-grow bg-transparent border-none text-tertiary font-mono text-sm outline-none placeholder:text-tertiary/20"
            placeholder="ENTER DIRECTIVE..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            autoComplete="off"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()}
            className="p-2 bg-tertiary/10 hover:bg-tertiary/30 border border-tertiary/20 hover:border-tertiary/50 text-tertiary rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-tertiary/10 disabled:hover:border-tertiary/20 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TheOracle;
