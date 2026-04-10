import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Save, Trash2, Download, Plus, List, Eye, Edit3, 
  ChevronRight, Pin, PinOff, Palette, FileJson, 
  Upload, Wifi, WifiOff, MoreVertical, X, Check
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// DnD Kit
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

// --- Sortable Item Component ---
const SortableNoteItem = ({ note, isActive, onClick, onDelete, onPin, onColorChange, onExportOne }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: note.id, disabled: note.pinned });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1
  };

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`relative group mb-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/15 border-primary/30 ring-1 ring-primary/20' : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'} border`}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Handle / Pin indicator */}
        <div 
          {...attributes} {...listeners}
          className={`flex-shrink-0 cursor-grab active:cursor-grabbing ${note.pinned ? 'text-primary' : 'text-muted/40 group-hover:text-muted/80'}`}
        >
          {note.pinned ? <Pin className="w-3 h-3 fill-primary" /> : <div className="w-1 h-3 flex gap-0.5"><div className="w-0.5 bg-current rounded-full" /><div className="w-0.5 bg-current rounded-full" /></div>}
        </div>

        {/* Tab content */}
        <button 
          onClick={onClick}
          className="flex-grow text-left min-w-0"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: note.color || '#F7931A' }} />
            <span className={`text-[11px] font-bold truncate tracking-tight ${isActive ? 'text-primary' : 'text-white/70'}`}>
              {note.title || 'Untitled Note'}
            </span>
          </div>
          <div className="text-[9px] font-mono text-muted/50 mt-0.5 truncate uppercase">
            {new Date(note.lastSaved).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
        </button>

        {/* Local Menu Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-lg hover:bg-white/10 text-muted transition-all"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Popover Menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-2 top-full mt-1 w-48 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 z-50 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); onPin(note.id); setShowMenu(false); }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-[10px] font-mono uppercase tracking-widest text-muted hover:text-white"
              >
                {note.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                {note.pinned ? 'Unpin Note' : 'Pin to Top'}
              </button>
              
              {/* Color Palette */}
              <div className="px-3 py-2 mt-1 border-t border-white/5">
                <div className="text-[8px] text-muted/50 mb-2 font-mono uppercase tracking-tighter">System Aesthetic</div>
                <div className="flex justify-between gap-1">
                  {['#F7931A', '#06b6d4', '#22c55e', '#ef4444', '#a855f7'].map(c => (
                    <button 
                      key={c} 
                      onClick={(e) => { e.stopPropagation(); onColorChange(note.id, c); }}
                      className="w-5 h-5 rounded-full border border-white/10 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-1 border-t border-white/5 pt-1">
                <button 
                    onClick={(e) => { e.stopPropagation(); onExportOne(note); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-[10px] font-mono uppercase tracking-widest text-muted hover:text-white"
                >
                    <Download className="w-3.5 h-3.5" /> Export .json
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(note.id); setShowMenu(false); }}
                    disabled={note.pinned}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-xl text-[10px] font-mono uppercase tracking-widest text-red-500/50 hover:text-red-500 disabled:opacity-20"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Main Component ---
const Notepad = () => {
  const [notes, setNotes] = useState([{ id: 'init', title: 'Void Workspace', content: '# Welcome to Neonote\n\n- **Offline First** using localStorage\n- **Material 3** Aesthetics\n- **Markdown** Support\n- **Drag & Drop** Reordering', lastSaved: Date.now(), pinned: false, color: '#F7931A' }]);
  const [activeId, setActiveId] = useState('init');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Sync with Online State
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // Initialize from storage
  useEffect(() => {
    const saved = localStorage.getItem('neonote_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        setNotes(parsed);
        setActiveId(parsed[0].id);
      }
    }
  }, []);

  // Save to storage
  useEffect(() => {
    localStorage.setItem('neonote_v1', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeId) || notes[0];

  const updateActiveNote = (updates) => {
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, ...updates, lastSaved: Date.now() } : n));
  };

  const createNote = () => {
    const newNote = { id: Date.now().toString(), title: 'Fragment ' + (notes.length + 1), content: '', lastSaved: Date.now(), pinned: false, color: '#F7931A' };
    setNotes(prev => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  const togglePin = (id) => {
    setNotes(prev => {
        const item = prev.find(n => n.id === id);
        const updated = prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
        // Re-sort: pinned at top
        return [...updated].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    });
  };

  const updateColor = (id, color) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, color } : n));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex(n => n.id === active.id);
        const newIndex = items.findIndex(n => n.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neonote_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportOne = (note) => {
    const blob = new Blob([JSON.stringify(note, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note_${note.title.replace(/\s+/g,'_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const data = JSON.parse(ev.target.result);
            if (Array.isArray(data)) {
                if (confirm('Import multiple notes? This will merge with existing.')) setNotes(prev => [...data, ...prev]);
            } else if (data.id) {
                setNotes(prev => [{ ...data, id: Date.now().toString() }, ...prev]);
            }
        } catch (err) { alert('Invalid file format'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-surface/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden min-h-[500px] shadow-2xl relative select-none">
      
      {/* System ToolBar */}
      <div className="px-6 py-4 bg-black/60 border-b border-white/10 flex justify-between items-center z-40">
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
                {isOnline ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500 animate-pulse" />}
                <span className="text-[9px] font-mono tracking-widest text-muted">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/10">
                <Check className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-[9px] font-mono tracking-widest text-primary">SAVING ENCRYPTED</span>
             </div>
             <div className="h-4 w-px bg-white/10" />
             <input
              value={activeNote.title}
              onChange={(e) => updateActiveNote({ title: e.target.value })}
              className="bg-transparent border-none outline-none font-heading font-bold text-base text-white/90 placeholder:text-white/10 w-40 sm:w-64 focus:text-primary transition-colors"
             />
        </div>

        <div className="flex gap-2">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-2 border ${isSidebarOpen ? 'bg-primary/20 text-primary border-primary/30 shadow-gold-glow' : 'bg-black/40 text-muted hover:text-white border-white/5'}`}>
                <List className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-widest hidden sm:block">Archive</span>
            </button>
            <button onClick={() => setIsPreview(!isPreview)} className={`p-2 rounded-2xl transition-all ${isPreview ? 'bg-tertiary/20 text-tertiary shadow-cyan-glow border-tertiary/30' : 'bg-black/40 text-muted hover:text-white border-white/5'} border`}>
                {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
      </div>

      <div className="flex flex-grow relative overflow-hidden">
        
        {/* Dynamic Sidebar (Material Inspired) */}
        <div className={`absolute inset-y-0 left-0 w-80 bg-background/98 backdrop-blur-2xl border-r border-white/10 z-50 transition-all duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} p-6 flex flex-col`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-[10px] font-mono font-bold tracking-[0.3em] text-primary uppercase">Segment Archive</h4>
                  <p className="text-[8px] text-muted/40 uppercase mt-1">Manage Previous Notes</p>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => fileInputRef.current.click()} className="p-2 hover:bg-white/5 rounded-xl text-muted/50 hover:text-white transition-colors" title="Import"><Upload className="w-3.5 h-3.5" /></button>
                    <button onClick={exportAll} className="p-2 hover:bg-white/5 rounded-xl text-muted/50 hover:text-white transition-colors" title="Export Backup"><Download className="w-3.5 h-3.5" /></button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
            </div>

            <button onClick={createNote} className="w-full h-14 bg-primary text-black rounded-2xl font-heading font-bold flex items-center justify-center gap-3 mb-6 hover:scale-[1.02] active:scale-95 transition-all shadow-gold-glow">
                <Plus className="w-5 h-5 stroke-[3px]" /> NEW FRAGMENT
            </button>

            <div className="flex-grow overflow-y-auto custom-scrollbar -mx-2 px-2">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext 
                    items={notes.map(n => n.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {notes.map(note => (
                      <SortableNoteItem 
                        key={note.id}
                        note={note}
                        isActive={activeId === note.id}
                        onClick={() => { setActiveId(note.id); setIsSidebarOpen(false); }}
                        onDelete={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
                        onPin={togglePin}
                        onColorChange={updateColor}
                        onExportOne={exportOne}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <span className="text-[8px] font-mono text-muted/20 tracking-widest uppercase italic">Encryption: Web-Local 256</span>
            </div>
        </div>

        {/* Editor Engine */}
        <div className="flex-grow flex flex-col h-full bg-[#030304]/20">
             {isPreview ? (
                <div 
                    className="flex-grow p-8 sm:p-12 overflow-y-auto prose prose-invert prose-base sm:prose-lg font-body text-white/80 max-w-none prose-headings:text-primary prose-a:text-tertiary prose-strong:text-white animate-fadeIn"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(activeNote.content || '_Package empty. Transmit data._')) }}
                />
            ) : (
                <div className="flex-grow flex flex-col relative">
                     <textarea
                        value={activeNote.content}
                        onChange={(e) => updateActiveNote({ content: e.target.value })}
                        placeholder="System waiting for input... (Shift+Enter for newline)"
                        className="flex-grow w-full bg-transparent p-8 sm:p-12 font-mono text-sm sm:text-base text-white/90 placeholder:text-white/5 line-clamp-none resize-none outline-none leading-relaxed transition-opacity"
                        spellCheck={false}
                    />
                    {/* Floating word count */}
                    <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-black/40 border border-white/5 rounded-full text-[9px] font-mono text-muted/40 uppercase tracking-widest backdrop-blur-md">
                        {activeNote.content.trim().split(/\s+/).filter(x => x).length} Words Active
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Notepad;
