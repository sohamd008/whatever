import React, { useEffect, useRef, useState } from 'react';
import {
  Trash2, Download, Plus, List, Eye, Edit3,
  Pin, PinOff, Upload, Wifi, WifiOff, MoreVertical, Check
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
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

const DEFAULT_NOTE_CONTENT = '# Welcome to the Workspace\n\n- Auto-saving to local storage\n- Markdown rendering enabled\n- Drag and drop to reorder notes\n- Pin important items to the top';
const FALLBACK_ACTIVE_NOTE = {
  id: 'fallback',
  title: 'Start Typing...',
  content: '',
  lastSaved: 0,
  pinned: false,
  color: '#F7931A',
};

const createNoteRecord = (overrides = {}) => ({
  id: Date.now().toString(),
  title: 'Untitled Note',
  content: '',
  lastSaved: Date.now(),
  pinned: false,
  color: '#F7931A',
  ...overrides,
});

const getDefaultNotes = () => ([
  createNoteRecord({
    id: 'init',
    title: 'Start Typing...',
    content: DEFAULT_NOTE_CONTENT,
  }),
]);

const loadSavedNotes = () => {
  if (typeof window === 'undefined') return getDefaultNotes();

  try {
    const saved = localStorage.getItem('voidnotes_v1') || localStorage.getItem('neonote_v1');
    if (!saved) return getDefaultNotes();

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultNotes();
  } catch {
    return getDefaultNotes();
  }
};

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
        <div
          {...attributes}
          {...listeners}
          className={`flex-shrink-0 cursor-grab active:cursor-grabbing ${note.pinned ? 'text-primary' : 'text-muted/40 group-hover:text-muted/80'}`}
        >
          {note.pinned ? <Pin className="w-3 h-3 fill-primary" /> : <div className="w-1 h-3 flex gap-0.5"><div className="w-0.5 bg-current rounded-full" /><div className="w-0.5 bg-current rounded-full" /></div>}
        </div>

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

        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-lg hover:bg-white/10 text-muted transition-all"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>

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

              <div className="px-3 py-2 mt-1 border-t border-white/5">
                <div className="text-[8px] text-muted/50 mb-2 font-mono uppercase tracking-tighter">System Aesthetic</div>
                <div className="flex justify-between gap-1">
                  {['#F7931A', '#06b6d4', '#22c55e', '#ef4444', '#a855f7'].map((color) => (
                    <button
                      key={color}
                      onClick={(e) => { e.stopPropagation(); onColorChange(note.id, color); }}
                      className="w-5 h-5 rounded-full border border-white/10 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
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

const Notepad = () => {
  const [notes, setNotes] = useState(loadSavedNotes);
  const [activeId, setActiveId] = useState(() => loadSavedNotes()[0]?.id || 'init');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('voidnotes_v1', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find((note) => note.id === activeId) || notes[0] || FALLBACK_ACTIVE_NOTE;

  const updateActiveNote = (updates) => {
    setNotes((prev) => prev.map((note) => (
      note.id === activeId ? { ...note, ...updates, lastSaved: Date.now() } : note
    )));
  };

  const createNote = () => {
    const newNote = createNoteRecord({
      title: `Fragment ${notes.length + 1}`,
    });
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
  };

  const deleteNote = (id) => {
    const remaining = notes.filter((note) => note.id !== id);

    if (remaining.length === 0) {
      const fallback = getDefaultNotes()[0];
      setNotes([fallback]);
      setActiveId(fallback.id);
      return;
    }

    setNotes(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  };

  const togglePin = (id) => {
    setNotes((prev) => {
      const updated = prev.map((note) => note.id === id ? { ...note, pinned: !note.pinned } : note);
      return [...updated].sort((a, b) => Number(b.pinned) - Number(a.pinned));
    });
  };

  const updateColor = (id, color) => {
    setNotes((prev) => prev.map((note) => note.id === id ? { ...note, color } : note));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setNotes((items) => {
      const oldIndex = items.findIndex((note) => note.id === active.id);
      const newIndex = items.findIndex((note) => note.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportOne = (note) => {
    const blob = new Blob([JSON.stringify(note, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `note_${note.title.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (Array.isArray(data)) {
          if (window.confirm('Import multiple notes? This will merge with existing notes.')) {
            setNotes((prev) => [...data, ...prev]);
          }
          return;
        }

        if (data.id) {
          const importedNote = createNoteRecord({ ...data, id: Date.now().toString() });
          setNotes((prev) => [importedNote, ...prev]);
          setActiveId(importedNote.id);
        }
      } catch {
        window.alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-surface/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 overflow-hidden min-h-[500px] shadow-2xl relative select-none">
      <div className="px-6 py-4 bg-black/60 border-b border-white/10 flex justify-between items-center z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
            {isOnline ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500 animate-pulse" />}
            <span className="text-[9px] font-mono tracking-widest text-muted">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/10">
            <Check className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[9px] font-mono tracking-widest text-primary">SAVING LOCALLY</span>
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
        <div className={`absolute inset-y-0 left-0 w-80 bg-background/98 backdrop-blur-2xl border-r border-white/10 z-50 transition-all duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} p-6 flex flex-col`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-[10px] font-mono font-bold tracking-[0.3em] text-primary uppercase">Segment Archive</h4>
              <p className="text-[8px] text-muted/40 uppercase mt-1">Manage Saved Notes</p>
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
                items={notes.map((note) => note.id)}
                strategy={verticalListSortingStrategy}
              >
                {notes.map((note) => (
                  <SortableNoteItem
                    key={note.id}
                    note={note}
                    isActive={activeId === note.id}
                    onClick={() => { setActiveId(note.id); setIsSidebarOpen(false); }}
                    onDelete={deleteNote}
                    onPin={togglePin}
                    onColorChange={updateColor}
                    onExportOne={exportOne}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <span className="text-[8px] font-mono text-muted/20 tracking-widest uppercase italic">Storage: Browser local only</span>
          </div>
        </div>

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
                placeholder="System waiting for input..."
                className="flex-grow w-full bg-transparent p-8 sm:p-12 font-mono text-sm sm:text-base text-white/90 placeholder:text-white/5 line-clamp-none resize-none outline-none leading-relaxed transition-opacity"
                spellCheck={false}
              />
              <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-black/40 border border-white/5 rounded-full text-[9px] font-mono text-muted/40 uppercase tracking-widest backdrop-blur-md">
                {activeNote.content.trim().split(/\s+/).filter(Boolean).length} Words Active
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notepad;
