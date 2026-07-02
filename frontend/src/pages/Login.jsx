import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trello } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'amar@taskflow.io', password: 'demo123' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await login(form.email, form.password); toast.success('Welcome back!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-600 to-violet-700 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3 text-white">
          <img src="/favicon.png" alt="" className="h-10 w-10 rounded-xl bg-white p-0.5" /> <h1 className="text-2xl font-extrabold">TaskFlow</h1>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-bold">Sign in</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button disabled={busy} className="btn-primary w-full">{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
          <p className="mt-4 text-xs text-slate-500">Demo: amar@taskflow.io / demo123 (prefilled)</p>
        </div>
        <p className="mt-4 text-center text-sm text-white/90">New here? <Link to="/register" className="font-semibold underline">Create account</Link></p>
      </div>
    </div>
  );
}
