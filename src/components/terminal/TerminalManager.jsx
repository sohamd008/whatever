import React, { useState, useEffect } from 'react';
import { Shield, ChevronRight, Trash2, ExternalLink, Hash, Globe, RefreshCcw, Lock } from 'lucide-react';

const TerminalManager = () => {
  const [auth, setAuth] = useState(null);
  const [password, setPassword] = useState('');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-login from session
  useEffect(() => {
    const saved = sessionStorage.getItem('terminal_auth');
    if (saved) {
      setAuth(saved);
      fetchLinks(saved);
    }
  }, []);

  const fetchLinks = async (token) => {
    setLoading(true);
    try {
      const resp = await fetch('/api/links', {
        headers: { 'x-terminal-auth': token }
      });
      if (resp.ok) {
        const data = await resp.json();
        setLinks(data.links);
      } else {
        setAuth(null);
        sessionStorage.removeItem('terminal_auth');
      }
    } catch (e) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password) return;
    setAuth(password);
    sessionStorage.setItem('terminal_auth', password);
    fetchLinks(password);
  };

  const deleteLink = async (slug) => {
    if (!window.confirm(`Delete slug "${slug}"?`)) return;
    try {
      const resp = await fetch('/api/links', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-terminal-auth': auth 
        },
        body: JSON.stringify({ action: 'delete', slug })
      });
      if (resp.ok) {
        setLinks(prev => prev.filter(l => l.slug !== slug));
      }
    } catch (e) {
      alert('Delete failed');
    }
  };

  if (!auth) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 border border-green-900/40 bg-green-900/5 rounded-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                <Lock className="w-8 h-8 text-green-500 animate-pulse" />
            </div>
            <h2 className="text-xl font-bold tracking-widest text-green-400">AUTHORIZED ACCESS ONLY</h2>
            <p className="text-[10px] text-green-500/40 mt-1 uppercase">Enter level 1 decryption key</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
                <input 
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ENTER SECRET..."
                    className="w-full bg-black border border-green-900/50 rounded-lg px-4 py-3 text-green-400 font-mono text-sm outline-none focus:border-green-500 transition-colors"
                />
                <Shield className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-900" />
            </div>
            <button className="w-full py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/40 text-green-500 rounded-lg font-bold text-xs tracking-[0.2em] transition-all">
                INITIALIZE_SESSION
            </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-green-900/20">
        <div>
            <h1 className="text-2xl font-bold text-green-400 tracking-tighter">LINK_DATABASE_CONTROL</h1>
            <p className="text-[10px] text-green-500/40 uppercase tracking-widest mt-1">Found {links.length} active data pointers</p>
        </div>
        <button 
          onClick={() => fetchLinks(auth)}
          className="p-2 hover:bg-green-500/10 rounded-lg text-green-500 transition-all flex items-center gap-2"
        >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {links.length === 0 && !loading && (
            <div className="text-center py-20 border border-dashed border-green-900/20 rounded-2xl opacity-30 italic">
                No links detected in KV sector.
            </div>
        )}

        {links.map((link) => (
            <div key={link.slug} className="group flex items-center justify-between p-4 bg-green-900/5 border border-green-900/20 rounded-xl hover:border-green-500/30 transition-all">
                <div className="flex items-center gap-6 overflow-hidden">
                    <div className="flex flex-col min-w-[120px]">
                        <div className="flex items-center gap-1.5 text-green-300 font-bold">
                            <Hash className="w-3 h-3 opacity-40" />
                            {link.slug}
                        </div>
                        <div className="text-[9px] text-green-900 opacity-60 uppercase">Slug Index</div>
                    </div>
                    
                    <div className="flex flex-col overflow-hidden">
                        <div className="text-xs text-white/50 truncate max-w-md flex items-center gap-2">
                           <Globe className="w-3 h-3 opacity-30" />
                           {link.url}
                        </div>
                        <div className="text-[9px] text-green-900 opacity-60 uppercase">Destination URL</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-green-500/10 rounded-lg text-green-500/40 hover:text-green-500 transition-all">
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => deleteLink(link.slug)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-red-500/20 hover:text-red-500 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalManager;
