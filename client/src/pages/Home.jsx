import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { CATEGORIES } from '../constants.js';

export function Card({ p }) {
  return (
    <Link to={`/product/${p._id}`} className="card">
      {p.imageUrl ? <img src={p.imageUrl} alt={p.title} /> : <div className="noimg">{p.title[0]}</div>}
      <div className="card-body">
        <strong>{p.title}</strong>
        <span className="price">₹{p.price}</span>
        <small>{p.category} · {p.condition}</small>
      </div>
    </Link>
  );
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      const q = new URLSearchParams({ search, category }).toString();
      api('/products?' + q).then(setItems).catch((e) => setError(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <>
      <h1>Find what you need on campus</h1>
      <div className="filters">
        <input placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      {!error && items.length === 0 && <p>No listings match. Try another search or sell the first one.</p>}
      <div className="grid">{items.map((p) => <Card key={p._id} p={p} />)}</div>
    </>
  );
}
