import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import BookCard from "../components/BookCard";
import { api } from "../utils/api";
import "./Home.css";

const CATEGORIES = [
  { name: "Fiction", icon: "📚", desc: "Novels, short stories, literary fiction" },
  { name: "Non-Fiction", icon: "🧠", desc: "Self-help, history, science, biography" },
  { name: "Children", icon: "🌈", desc: "Picture books, middle grade, young adult" },
  { name: "Mystery & Thriller", icon: "🔍", desc: "Suspense, crime, detective fiction" },
  { name: "Science & Tech", icon: "🔬", desc: "Physics, computing, technology" },
];

const Home = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const featData = await api.getFeatured();
        setFeatured(featData.books || []);
        if (user) {
          try {
            const recData = await api.getRecommendations();
            setRecommendations(recData.books || []);
          } catch (_) {}
        }
      } catch (_) {}
      setLoading(false);
    };
    fetchData();
  }, [user]);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            {user ? (
              <div className="hero-welcome">👋 Welcome back, {user.name.split(" ")[0]}!</div>
            ) : null}
            <h1 className="hero-title">
              Your Next Great Read<br />
              <span className="hero-highlight">Awaits You</span>
            </h1>
            <p className="hero-sub">
              Browse thousands of books across every genre. Free delivery on orders over £25.
              Earn gift points with every purchase.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary hero-cta" onClick={() => navigate("/catalogue")}>
                Browse Catalogue
              </button>
              {!user && (
                <button className="btn btn-outline hero-cta-alt" onClick={() => navigate("/login")}>
                  Sign In / Register
                </button>
              )}
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>10,000+</strong><span>Titles</span></div>
              <div className="hero-stat"><strong>5 Genres</strong><span>Categories</span></div>
              <div className="hero-stat"><strong>2–5 Days</strong><span>Delivery</span></div>
              <div className="hero-stat"><strong>4.9★</strong><span>Rating</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-books-stack">
              <span>📖</span><span>📗</span><span>📘</span><span>📕</span><span>📙</span>
            </div>
          </div>
        </div>
      </section>

      {/* Personalised Recommendations */}
      {user && recommendations.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Recommended for You</h2>
                <p className="section-sub">Based on your order history</p>
              </div>
              <Link to="/catalogue" className="section-link">View all →</Link>
            </div>
            <div className="books-grid">
              {recommendations.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/catalogue?category=${encodeURIComponent(cat.name)}`}
                className="category-card card"
              >
                <span className="category-icon">{cat.icon}</span>
                <h3 className="category-name">{cat.name}</h3>
                <p className="category-desc">{cat.desc}</p>
                <span className="category-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Bestsellers */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">★ Bestsellers</h2>
              <p className="section-sub">Top-rated books loved by our community</p>
            </div>
            <Link to="/catalogue?sort=rating" className="section-link">See more →</Link>
          </div>
          {loading ? (
            <div className="books-grid">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton" style={{ height: "320px", borderRadius: "0.75rem" }} />
              ))}
            </div>
          ) : (
            <div className="books-grid">
              {featured.slice(0, 6).map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <div className="container promo-inner">
          <div className="promo-text">
            <h2>🎁 Gift Points Programme</h2>
            <p>Earn 1 point for every £1 spent. Redeem points at checkout for discounts on future orders.</p>
          </div>
          {!user ? (
            <button className="btn btn-primary promo-btn" onClick={() => navigate("/login")}>
              Join Now — It's Free
            </button>
          ) : (
            <div className="promo-points-display">
              <div className="promo-points-num">{user.giftPoints}</div>
              <div className="promo-points-label">Your Gift Points</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
