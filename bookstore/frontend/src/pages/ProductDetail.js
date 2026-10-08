import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import BookCard from "../components/BookCard";
import { api } from "../utils/api";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    setQty(1);
    window.scrollTo(0, 0);
    api.getBook(id)
      .then(data => {
        setBook(data);
        setRelated(data.related || []);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [id]);

  const handleAddToCart = () => {
    addItem(book, qty);
    showToast(`${qty}× "${book.title}" added to basket! 🛒`);
  };

  const handleBuyNow = () => {
    addItem(book, qty);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="product-detail-page container" style={{ paddingTop: "2rem" }}>
        <div className="skeleton" style={{ height: "400px", borderRadius: "0.75rem" }} />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
        <h2>Book not found</h2>
        <Link to="/catalogue" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const discount = book.originalPrice > book.price
    ? Math.round((1 - book.price / book.originalPrice) * 100) : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/catalogue">Catalogue</Link>
          <span>›</span>
          <Link to={`/catalogue?category=${encodeURIComponent(book.category)}`}>{book.category}</Link>
          <span>›</span>
          <span>{book.title}</span>
        </nav>

        {/* Main Product Section */}
        <div className="product-main">
          {/* Cover */}
          <div className="product-cover">
            <div className="cover-display">
              <span className="cover-emoji">{book.image}</span>
            </div>
            {discount > 0 && (
              <div className="cover-discount-badge">Save {discount}%</div>
            )}
          </div>

          {/* Details */}
          <div className="product-details">
            <div className="product-category-badge badge badge-blue">{book.category}</div>
            <h1 className="product-title">{book.title}</h1>
            <p className="product-author">by <strong>{book.author}</strong></p>
            <p className="product-brand">Publisher: {book.brand}</p>

            <div className="product-rating">
              <span className="stars large">{"★".repeat(Math.round(book.rating))}{"☆".repeat(5 - Math.round(book.rating))}</span>
              <span className="rating-value">{book.rating}</span>
              <span className="rating-count">({book.reviews.toLocaleString()} reviews)</span>
            </div>

            <div className="product-pricing">
              <span className="price-current large">£{book.price.toFixed(2)}</span>
              {discount > 0 && (
                <>
                  <span className="price-original">£{book.originalPrice.toFixed(2)}</span>
                  <span className="price-discount badge badge-green">-{discount}%</span>
                </>
              )}
            </div>

            <p className="product-description">{book.description}</p>

            {/* Delivery Info */}
            <div className="delivery-info-box">
              <div className="delivery-row">
                <span className="delivery-label">🚚 Estimated Delivery</span>
                <strong className="delivery-date">{book.estimatedDelivery}</strong>
              </div>
              <div className="delivery-row">
                <span className="delivery-label">📦 Availability</span>
                <span className={`badge ${book.stock > 20 ? "badge-green" : book.stock > 5 ? "badge-amber" : "badge-red"}`}>
                  {book.stock > 20 ? "In Stock" : book.stock > 5 ? `Only ${book.stock} left` : "Low Stock"}
                </span>
              </div>
              <div className="delivery-row">
                <span className="delivery-label">🔒 Secure Checkout</span>
                <span style={{ fontSize: "0.82rem", color: "#64748b" }}>SSL encrypted payment</span>
              </div>
            </div>

            {/* Tags */}
            <div className="product-tags">
              {book.tags.map(tag => (
                <Link key={tag} to={`/catalogue?q=${tag}`} className="tag-chip">#{tag}</Link>
              ))}
            </div>

            {/* Quantity + Actions */}
            <div className="product-actions">
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(book.stock, q + 1))}>+</button>
              </div>
              <button className="btn btn-primary add-btn" onClick={handleAddToCart}>
                🛒 Add to Basket
              </button>
              <button className="btn btn-success buy-now-btn" onClick={handleBuyNow}>
                ⚡ Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="related-section">
            <h2 className="section-title">Customers Also Bought</h2>
            <div className="related-grid">
              {related.map(rb => (
                <BookCard key={rb.id} book={rb} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
