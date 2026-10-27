import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CATEGORIES, CONDITIONS } from '../constants.js';

const empty = { title: '', description: '', price: '', category: CATEGORIES[0], condition: CONDITIONS[2], imageUrl: '' };

export default function ProductForm() {
  const { id } = useParams();
  const { user, ready } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (ready && !user) nav('/login');
  }, [ready, user, nav]);

  useEffect(() => {
    if (id) api(`/products/${id}`).then((p) => setForm({ ...empty, ...p })).catch((e) => setError(e.message));
  }, [id]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    const { title, description, price, category, condition, imageUrl } = form;
    try {
      const saved = await api(id ? `/products/${id}` : '/products', {
        method: id ? 'PATCH' : 'POST',
        body: { title, description, price, category, condition, imageUrl },
      });
      nav(`/product/${saved._id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <h1>{id ? 'Edit listing' : 'Sell an item'}</h1>
      <input placeholder="Title" value={form.title} onChange={set('title')} required />
      <textarea placeholder="Description" rows="4" value={form.description} onChange={set('description')} />
      <input type="number" min="0" placeholder="Price in ₹" value={form.price} onChange={set('price')} required />
      <select value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
      <select value={form.condition} onChange={set('condition')}>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select>
      <input type="url" placeholder="Image URL (optional)" value={form.imageUrl} onChange={set('imageUrl')} />
      {error && <p className="error">{error}</p>}
      <button>{id ? 'Save changes' : 'Publish listing'}</button>
    </form>
  );
}
