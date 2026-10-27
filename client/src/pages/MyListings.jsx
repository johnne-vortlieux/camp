import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Card } from './Home.jsx';

export default function MyListings() {
  const { user, ready } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) return nav('/login');
    api('/products/mine').then(setItems).catch(() => setItems([]));
  }, [ready, user, nav]);

  if (!items) return <p>Loading…</p>;
  return (
    <>
      <h1>My listings</h1>
      {items.length === 0 && <p>You haven't listed anything yet.</p>}
      <div className="grid">
        {items.map((p) => (
          <div key={p._id}>
            <Card p={p} />
            {p.isSold && <small className="sold">Sold</small>}
          </div>
        ))}
      </div>
    </>
  );
}
