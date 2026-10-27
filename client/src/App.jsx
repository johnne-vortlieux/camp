import { Link, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import ProductForm from './pages/ProductForm.jsx';
import MyListings from './pages/MyListings.jsx';

export default function App() {
  const { user, logout } = useAuth();
  return (
    <>
      <header className="nav">
        <Link to="/" className="brand">CampusCart</Link>
        <nav>
          {user ? (
            <>
              <Link to="/sell">Sell an item</Link>
              <Link to="/my">My listings</Link>
              <button className="link" onClick={logout}>Sign out ({user.name})</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link to="/register">Create account</Link>
            </>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/sell" element={<ProductForm />} />
          <Route path="/edit/:id" element={<ProductForm />} />
          <Route path="/my" element={<MyListings />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
