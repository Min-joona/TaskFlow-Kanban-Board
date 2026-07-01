import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trello } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await register(form); toast.success('Account created!'); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-600 to-violet-700 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3 text-white">
          <Trello size={28} /> <h1 className="text-2xl font-extrabold">TaskFlow</h1>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-bold">Create account</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" type="password" placeholder="Password (min 6)" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button disabled={busy} className="btn-primary w-full">{busy ? 'Creating…' : 'Sign up'}</button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-white/90">Have an account? <Link to="/login" className="font-semibold underline">Sign in</Link></p>
      </div>
    </div>
  );
}
