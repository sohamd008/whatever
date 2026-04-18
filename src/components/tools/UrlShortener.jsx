import React, { useState } from 'react';
import { Link2, Copy, Check, Zap } from 'lucide-react';

const UrlShortener = () => {
  const [url, setUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const shorten = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    
    try {
      const resp = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, slug: customSlug })
      });
      
      const data = await resp.json();
      if (!resp.ok) {
        if (resp.status === 409) {
            setError('This slug is already taken. Try another one.');
        } else if (data.error && data.error.includes('KV namespace')) {
            setError('Cloudflare KV "LINKS" not bound. See logs.');
        } else {
            setError(data.error || 'Check Link service failed');
        }
        return;
      }
      
      setShortUrl(`${window.location.origin}/s/${data.slug}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
      // Fallback for local testing if API isn't deployed yet
      if (err.message.includes('Unexpected token')) {
         setError('API not detected. Cloudflare Functions only work in production or via wrangler.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 glass-card h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Link2 className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-bold text-lg text-white">VOID SHORTENER</h3>
      </div>

      <form onSubmit={shorten} className="space-y-4">
        <div>
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1 mb-1 block">Long URL</label>
          <input
            type="url"
            required
            placeholder="https://example.com/very-long-link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        
        <div>
          <label className="text-[10px] font-mono text-muted uppercase tracking-widest pl-1 mb-1 block">Custom Slug (Optional)</label>
          <input
            type="text"
            placeholder="my-link"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-white outline-none focus:border-primary/50 transition-colors"
          />
          <p className="mt-2 text-[9px] font-mono text-muted/40 uppercase tracking-wider">Letters, numbers, and hyphens only</p>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(247,147,26,0.2)] flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          {loading ? 'Processing...' : 'Generate Short Link'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-mono text-red-400">
          {error}
        </div>
      )}

      {shortUrl && (
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <label className="text-[10px] font-mono text-primary uppercase tracking-widest block mb-2">Result</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="flex-grow bg-black/40 border border-white/5 rounded-lg px-3 py-2 font-mono text-xs text-primary outline-none"
            />
            <button onClick={copy} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-muted hover:text-white transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      <div className="mt-auto pt-6 text-[9px] font-mono text-muted uppercase tracking-tighter text-center opacity-40 italic">
        * Requires the LINKS KV binding in Cloudflare Pages
      </div>
    </div>
  );
};

export default UrlShortener;
