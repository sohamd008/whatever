import React, { useState, useEffect } from 'react';
import { Save, Trash2, FileText, Download } from 'lucide-react';

const Notepad = () => {
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_notepad_content');
    if (saved) {
      setContent(saved);
      const time = localStorage.getItem('portfolio_notepad_last_saved');
      if (time) setLastSaved(new Date(parseInt(time)));
    }
  }, []);

  const handleUpdate = (e) => {
    const newVal = e.target.value;
    setContent(newVal);
    localStorage.setItem('portfolio_notepad_content', newVal);
    const now = Date.now();
    localStorage.setItem('portfolio_notepad_last_saved', now.toString());
    setLastSaved(new Date(now));
  };

  const clear = () => {
    if (window.confirm('Clear all notes? This cannot be undone.')) {
      setContent('');
      localStorage.removeItem('portfolio_notepad_content');
      setLastSaved(null);
    }
  };

  const download = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-surface/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden min-h-[400px]">
      <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <FileText className="w-3 h-3 text-primary" />
          <span>OFFLINE SCRATCHPAD</span>
        </div>
        <div className="flex gap-2">
          <button onClick={download} title="Download as .txt" className="p-1.5 hover:bg-white/10 rounded transition-colors text-muted hover:text-white">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button onClick={clear} title="Clear all" className="p-1.5 hover:bg-red-500/20 rounded transition-colors text-muted hover:text-red-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <textarea
        value={content}
        onChange={handleUpdate}
        placeholder="Type your notes here... they are saved automatically to your browser cache."
        className="flex-grow w-full bg-transparent p-6 text-sm font-mono text-white/90 placeholder:text-white/20 resize-none outline-none leading-relaxed border-none"
      />

      <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-muted/50">
        <div>{content.length} characters | {content.split(/\s+/).filter(x => x).length} words</div>
        {lastSaved && <div>Saved: {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
      </div>
    </div>
  );
};

export default Notepad;
