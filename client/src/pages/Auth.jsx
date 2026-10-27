import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth({ mode }) {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await (isRegister ? register(form) : login({ email: form.email, password: form.password }));
      nav('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h1>{isRegister ? 'Create account' : 'Sign in'}</h1>
      {isRegister && <input placeholder="Full name" value={form.name} onChange={set('name')} required />}
      <input type="email" placeholder="College email" value={form.email} onChange={set('email')} required />
      <input type="password" placeholder="Password (8+ characters)" value={form.password} onChange={set('password')} required />
      {error && <p className="error">{error}</p>}
      <button>{isRegister ? 'Create account' : 'Sign in'}</button>
    </form>
  );
}
