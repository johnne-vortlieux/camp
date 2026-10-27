import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { user, ready } = useAuth();
  const nav = useNavigate();
  const [p, setP] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    api(`/products/${id}`).then(setP).catch((e) => setError(e.message));
  }, [id, ready, user]);

  async function markSold() {
    await api(`/products/${id}`, { method: 'PATCH', body: { isSold: true } });
    nav('/my');
  }
  async function remove() {
    if (!confirm('Delete this listing?')) return;
    await api(`/products/${id}`, { method: 'DELETE' });
    nav('/my');
  }

  if (error) return <p className="error">{error}</p>;
  if (!p) return <p>Loading…</p>;

  return (
    <div className="detail">
      {p.imageUrl ? <img src={p.imageUrl} alt={p.title} /> : <div className="noimg big">{p.title[0]}</div>}
      <div>
        <h1>{p.title}</h1>
        <p className="price big-price">₹{p.price}</p>
        <p><small>{p.category} · {p.condition}{p.isSold ? ' · Sold' : ''}</small></p>
        <p>{p.description || 'No description.'}</p>
        <p>Seller: <strong>{p.seller.name}</strong></p>
        {p.seller.email ? (
          <p>Contact: <a href={`mailto:${p.seller.email}`}>{p.seller.email}</a></p>
        ) : (
          <p><Link to="/login">Sign in</Link> to see the seller's contact.</p>
        )}
        {p.isOwner && (
          <div className="actions">
            <Link to={`/edit/${p._id}`} className="btn">Edit</Link>
            {!p.isSold && <button onClick={markSold}>Mark as sold</button>}
            <button className="danger" onClick={remove}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
