import React, { useState, useEffect } from 'react';
import { Save, Trash2, FileText, Download, Plus, List, Eye, Edit3, ChevronRight } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const Notepad = () => {
  const [notes, setNotes] = useState([{ id: 1, title: 'First Note', content: '', lastSaved: Date.now() }]);
  const [activeId, setActiveId] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Initialize from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('void_notes_v2');
    if (saved) {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
        setActiveId(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    // Only save if it's not the initial empty state or if user has modified it
    if (notes.length > 0) {
        localStorage.setItem('void_notes_v2', JSON.stringify(notes));
    }
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeId) || notes[0];

  const updateActiveNote = (updates) => {
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, ...updates, lastSaved: Date.now() } : n));
  };

  const createNote = () => {
    const newNote = { id: Date.now(), title: 'Untitled Note', content: '', lastSaved: Date.now() };
    setNotes(prev => [newNote, ...prev]);
    setActiveId(newNote.id);
    setIsSidebarOpen(false);
  };

  const deleteNote = (id) => {
    if (notes.length === 1) return alert("Cannot delete the last note.");
    if (window.confirm("Delete this note?")) {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (activeId === id) setActiveId(notes.find(n => n.id !== id).id);
    }
  };

  const download = () => {
    const blob = new Blob([activeNote.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden min-h-[500px] relative group shadow-2xl">
      
      {/* Dynamic Header */}
      <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 px-2 hover:bg-white/10 rounded-lg text-primary transition-colors flex items-center gap-2">
            <List className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold uppercase hidden sm:block">Archive</span>
          </button>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <input 
            value={activeNote.title}
            onChange={(e) => updateActiveNote({ title: e.target.value })}
            className="bg-transparent border-none outline-none font-heading font-bold text-sm text-white/90 placeholder:text-white/20 w-32 sm:w-48"
          />
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => setIsPreview(!isPreview)} title="Toggle Preview" className={`p-1.5 rounded-lg transition-all ${isPreview ? 'bg-primary text-black' : 'hover:bg-white/10 text-muted hover:text-white'}`}>
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button onClick={download} title="Download Markdown" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted hover:text-white">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => deleteNote(activeId)} title="Delete Note" className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-muted hover:text-red-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-grow relative overflow-hidden">
        {/* Sidebar overlay */}
        <div className={`absolute inset-y-0 left-0 w-64 bg-background/95 backdrop-blur-xl border-r border-white/10 z-30 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4 flex flex-col h-full">
                <button onClick={createNote} className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg font-mono text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 mb-4 transition-all">
                    <Plus className="w-3 h-3" /> New Fragment
                </button>
                <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {notes.map(n => (
                        <button 
                            key={n.id}
                            onClick={() => { setActiveId(n.id); setIsSidebarOpen(false); }}
                            className={`w-full text-left p-3 rounded-xl border transition-all relative group/item ${activeId === n.id ? 'bg-primary/10 border-primary/40' : 'bg-white/5 border-transparent hover:border-white/10 h-16'}`}
                        >
                            <div className={`text-xs font-bold truncate ${activeId === n.id ? 'text-primary' : 'text-white/70'}`}>{n.title}</div>
                            <div className="text-[9px] font-mono text-muted mt-1 truncate opacity-60">
                                {n.content.slice(0, 30) || 'Empty string...'}
                            </div>
                            {activeId === n.id && <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-grow flex flex-col h-full relative">
            {isPreview ? (
                <div 
                    className="flex-grow p-6 overflow-y-auto prose prose-invert prose-sm font-body text-white/80 max-w-none prose-headings:text-primary prose-a:text-tertiary"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(activeNote.content || '_No content yet_')) }}
                />
            ) : (
                <textarea
                    value={activeNote.content}
                    onChange={(e) => updateActiveNote({ content: e.target.value })}
                    placeholder="# Start writing...&#10;Support for **Markdown**, *fragments*, and data packets."
                    className="flex-grow w-full bg-transparent p-6 text-sm font-mono text-white/90 placeholder:text-white/10 resize-none outline-none leading-relaxed border-none custom-scrollbar"
                />
            )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-muted/30 uppercase tracking-tighter">
        <div className="flex gap-4">
            <span>{activeNote.content.length} CHARS</span>
            <span>{Math.ceil(activeNote.content.split(/\s+/).length / 200)} MIN READ</span>
        </div>
        <div>Last Sync: {new Date(activeNote.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>
  );
};

export default Notepad;
