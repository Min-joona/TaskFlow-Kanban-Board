import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus, X, Trash2, GripVertical, Check, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';

const LABELS = {
  none: 'transparent', red: '#ef4444', yellow: '#f59e0b',
  green: '#22c55e', blue: '#3b82f6', purple: '#a855f7',
};

// deep clone that keeps it simple for our plain board data
const clone = (b) => JSON.parse(JSON.stringify(b));

export default function Board() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [drag, setDrag] = useState(null); // { col, card }
  const [dropCol, setDropCol] = useState(null);
  const [editing, setEditing] = useState(null); // { col, card }
  const [addingCol, setAddingCol] = useState(false);
  const [newCol, setNewCol] = useState('');
  const saveTimer = useRef(null);

  useEffect(() => { api.get(`/api/boards/${id}`).then(({ data }) => setBoard(data)); }, [id]);

  // Debounced save of the whole board.
  const save = useCallback((next) => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      api.put(`/api/boards/${id}`, { title: next.title, color: next.color, columns: next.columns })
        .catch(() => toast.error('Save failed'));
    }, 500);
  }, [id]);

  const update = (mutator) => {
    setBoard((prev) => {
      const next = clone(prev);
      mutator(next);
      save(next);
      return next;
    });
  };

  if (!board) return <div className="grid min-h-screen place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" /></div>;

  /* ---- drag & drop ---- */
  const onDrop = (colIndex, cardIndex = null) => {
    if (!drag) return;
    update((b) => {
      const [moved] = b.columns[drag.col].cards.splice(drag.card, 1);
      const target = b.columns[colIndex].cards;
      const insertAt = cardIndex === null ? target.length : cardIndex;
      target.splice(insertAt, 0, moved);
    });
    setDrag(null); setDropCol(null);
  };

  /* ---- card / column ops ---- */
  const addCard = (colIndex, title) => title.trim() && update((b) => b.columns[colIndex].cards.push({ title: title.trim(), description: '', label: 'none' }));
  const deleteCard = (col, card) => update((b) => b.columns[col].cards.splice(card, 1));
  const saveCard = (col, card, patch) => update((b) => Object.assign(b.columns[col].cards[card], patch));
  const addColumn = () => { if (newCol.trim()) { update((b) => b.columns.push({ title: newCol.trim(), cards: [] })); setNewCol(''); setAddingCol(false); } };
  const deleteColumn = (col) => confirm('Delete this list and its cards?') && update((b) => b.columns.splice(col, 1));
  const renameColumn = (col, title) => update((b) => { b.columns[col].title = title; });

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-indigo-600 to-violet-700">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 py-3 text-white">
        <Link to="/" className="rounded-lg p-1.5 hover:bg-white/20"><ChevronLeft /></Link>
        <input
          value={board.title}
          onChange={(e) => update((b) => { b.title = e.target.value; })}
          className="bg-transparent text-xl font-extrabold outline-none focus:bg-white/10 rounded px-2"
        />
        <span className="ml-auto text-xs text-white/70">Auto-saved</span>
      </header>

      {/* Columns */}
      <div className="no-scrollbar flex flex-1 items-start gap-4 overflow-x-auto px-4 pb-6">
        {board.columns.map((col, ci) => (
          <div
            key={ci}
            onDragOver={(e) => { e.preventDefault(); setDropCol(ci); }}
            onDrop={() => onDrop(ci)}
            className={`flex max-h-full w-72 shrink-0 flex-col rounded-xl bg-slate-100 ${dropCol === ci ? 'ring-2 ring-white' : ''}`}
          >
            <div className="flex items-center justify-between px-3 py-2.5">
              <input
                value={col.title}
                onChange={(e) => renameColumn(ci, e.target.value)}
                className="w-full bg-transparent font-bold text-slate-700 outline-none focus:bg-white rounded px-1"
              />
              <span className="ml-1 shrink-0 rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-500">{col.cards.length}</span>
              <button onClick={() => deleteColumn(ci)} className="ml-1 text-slate-300 hover:text-rose-500"><Trash2 size={15} /></button>
            </div>

            <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-2">
              {col.cards.map((card, di) => (
                <div
                  key={di}
                  draggable
                  onDragStart={() => setDrag({ col: ci, card: di })}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => { e.stopPropagation(); onDrop(ci, di); }}
                  className="group cursor-grab rounded-lg bg-white p-2.5 shadow-sm active:cursor-grabbing"
                >
                  {card.label && card.label !== 'none' && (
                    <span className="mb-1.5 block h-1.5 w-10 rounded-full" style={{ background: LABELS[card.label] }} />
                  )}
                  <div className="flex items-start gap-1">
                    <p className="flex-1 text-sm">{card.title}</p>
                    <button onClick={() => setEditing({ col: ci, card: di })} className="text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-indigo-500"><Pencil size={13} /></button>
                  </div>
                  {card.description && <p className="mt-1 line-clamp-2 text-xs text-slate-400">{card.description}</p>}
                </div>
              ))}
              <AddCard onAdd={(t) => addCard(ci, t)} />
            </div>
          </div>
        ))}

        {/* Add column */}
        <div className="w-72 shrink-0">
          {addingCol ? (
            <div className="rounded-xl bg-white/90 p-2">
              <input autoFocus value={newCol} onChange={(e) => setNewCol(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addColumn()} placeholder="List title…" className="input" />
              <div className="mt-2 flex gap-2">
                <button onClick={addColumn} className="btn-primary flex-1">Add list</button>
                <button onClick={() => setAddingCol(false)} className="btn-ghost"><X size={16} /></button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingCol(true)} className="flex w-full items-center gap-2 rounded-xl bg-white/20 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/30">
              <Plus size={16} /> Add a list
            </button>
          )}
        </div>
      </div>

      {/* Edit card modal */}
      {editing && (
        <CardModal
          card={board.columns[editing.col].cards[editing.card]}
          onClose={() => setEditing(null)}
          onSave={(patch) => { saveCard(editing.col, editing.card, patch); setEditing(null); }}
          onDelete={() => { deleteCard(editing.col, editing.card); setEditing(null); }}
        />
      )}
    </div>
  );
}

function AddCard({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const submit = () => { onAdd(text); setText(''); setOpen(false); };
  if (!open) return (
    <button onClick={() => setOpen(true)} className="mb-2 flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-200">
      <Plus size={15} /> Add a card
    </button>
  );
  return (
    <div className="mb-2">
      <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} placeholder="Card title…" className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none" rows={2} />
      <div className="mt-1 flex gap-2">
        <button onClick={submit} className="btn-primary flex-1 py-1.5">Add</button>
        <button onClick={() => setOpen(false)} className="btn-ghost py-1.5"><X size={15} /></button>
      </div>
    </div>
  );
}

function CardModal({ card, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({ title: card.title, description: card.description || '', label: card.label || 'none' });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Edit card</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <label className="mt-4 block text-sm font-medium text-slate-600">Title</label>
        <input className="input mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <label className="mt-4 block text-sm font-medium text-slate-600">Description</label>
        <textarea className="input mt-1" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="mt-4 block text-sm font-medium text-slate-600">Label</label>
        <div className="mt-2 flex gap-2">
          {Object.entries(LABELS).map(([name, color]) => (
            <button key={name} onClick={() => setForm({ ...form, label: name })}
              className={`h-8 w-8 rounded-full border-2 ${form.label === name ? 'border-slate-800' : 'border-transparent'} ${name === 'none' ? 'bg-slate-100' : ''}`}
              style={name === 'none' ? {} : { background: color }} aria-label={name}>
              {form.label === name && name !== 'none' && <Check size={14} className="mx-auto text-white" />}
            </button>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button onClick={onDelete} className="btn-ghost text-rose-500"><Trash2 size={16} /> Delete</button>
          <button onClick={() => onSave(form)} className="btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  );
}
