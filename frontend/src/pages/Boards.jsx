import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trello, Plus, LayoutGrid, LogOut, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const colorBar = {
  indigo: 'from-indigo-500 to-violet-500',
  emerald: 'from-emerald-500 to-teal-500',
  rose: 'from-rose-500 to-pink-500',
  amber: 'from-amber-500 to-orange-500',
};

export default function Boards() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');

  const load = () => api.get('/api/boards').then(({ data }) => setBoards(data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const { data } = await api.post('/api/boards', { title, color: ['indigo', 'emerald', 'rose', 'amber'][boards.length % 4] });
    navigate(`/board/${data._id}`);
  };

  const remove = async (id, e) => {
    e.preventDefault(); e.stopPropagation();
    if (!confirm('Delete this board?')) return;
    await api.delete(`/api/boards/${id}`);
    setBoards((b) => b.filter((x) => x._id !== id));
    toast.success('Board deleted');
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <span className="flex items-center gap-2 font-extrabold text-indigo-600"><Trello size={22} /> TaskFlow</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user.name}</span>
            <button onClick={logout} className="btn-ghost"><LogOut size={16} /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your boards</h1>
          <button onClick={() => setCreating(true)} className="btn-primary"><Plus size={16} /> New board</button>
        </div>

        {creating && (
          <form onSubmit={create} className="mt-4 flex gap-2 rounded-xl bg-white p-4 shadow-sm">
            <input autoFocus className="input" placeholder="Board title…" value={title} onChange={(e) => setTitle(e.target.value)} />
            <button className="btn-primary shrink-0">Create</button>
            <button type="button" onClick={() => setCreating(false)} className="btn-ghost shrink-0">Cancel</button>
          </form>
        )}

        {loading ? (
          <div className="grid place-items-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" /></div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((b) => (
              <Link key={b._id} to={`/board/${b._id}`} className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
                <div className={`h-2 bg-gradient-to-r ${colorBar[b.color] || colorBar.indigo}`} />
                <div className="p-5">
                  <h3 className="font-bold">{b.title}</h3>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <LayoutGrid size={13} /> {b.columns} lists · {b.cards} cards
                  </p>
                </div>
                <button onClick={(e) => remove(b._id, e)} className="absolute right-3 top-4 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-rose-500"><Trash2 size={16} /></button>
              </Link>
            ))}
            {boards.length === 0 && !creating && (
              <button onClick={() => setCreating(true)} className="grid place-items-center rounded-xl border-2 border-dashed border-slate-300 py-12 text-slate-400 hover:border-indigo-400 hover:text-indigo-500">
                <Plus /> Create your first board
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
