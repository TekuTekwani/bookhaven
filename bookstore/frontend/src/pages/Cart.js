import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import BookCard from "../components/BookCard";
import { api } from "../utils/api";
import "./Cart.css";

const Cart = () => {
  const { items, removeItem, updateQty, subtotal, totalItems } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (user) {
      api.getRecommendations().then(d => setRecommendations(d.books || [])).catch(() => {});
    } else {
      // Fallback: fetch featured books
      api.getFeatured().then(d => setRecommendations((d.books || []).slice(0, 4))).catch(() => {});
    }
  }, [user]);

  const handleRemove = (item) => {
    removeItem(item.bookId);
    showToast(`"${item.title}" removed from basket`);
  };

  const deliveryFee = subtotal >= 25 ? 0 : 3.99;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="cart-empty container">
        <div className="empty-basket-icon">🛒</div>
        <h2>Your basket is empty</h2>
        <p>Looks like you haven't added any books yet.</p>
        <Link to="/catalogue" className="btn btn-primary">Browse Books</Link>

        {recommendations.length > 0 && (
          <div className="cart-recommendations" style={{ marginTop: "3rem", textAlign: "left" }}>
            <h3 className="section-title">You Might Like</h3>
            <div className="rec-grid">
              {recommendations.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">🛒 My Basket ({totalItems} item{totalItems !== 1 ? "s" : ""})</h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.bookId} className="cart-item card">
                <div className="cart-item-cover">{item.image}</div>
                <div className="cart-item-info">
                  <Link to={`/book/${item.bookId}`} className="cart-item-title">{item.title}</Link>
                  <div className="cart-item-author">{item.author}</div>
                  <div className="cart-item-price">£{item.price.toFixed(2)} each</div>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control">
                    <button onClick={() => updateQty(item.bookId, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.bookId, item.qty + 1)}>+</button>
                  </div>
                  <div className="cart-item-subtotal">£{(item.price * item.qty).toFixed(2)}</div>
                  <button className="remove-btn" onClick={() => handleRemove(item)}>🗑</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? "free-delivery" : ""}>
                {deliveryFee === 0 ? "FREE" : `£${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            {deliveryFee > 0 && (
              <div className="free-delivery-hint">
                Add £{(25 - subtotal).toFixed(2)} more for free delivery
              </div>
            )}
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>£{total.toFixed(2)}</strong>
            </div>

            {user && (
              <div className="points-earn-hint">
                🎁 Earn ~{Math.floor(total)} gift points on this order
              </div>
            )}

            <button
              className="btn btn-primary checkout-btn"
              onClick={() => user ? navigate("/checkout") : navigate("/login")}
            >
              {user ? "Proceed to Checkout →" : "Sign In to Checkout"}
            </button>
            <Link to="/catalogue" className="btn btn-secondary continue-btn">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="cart-recommendations">
            <h2 className="section-title">
              {user ? "Recommended Based on Your History" : "You Might Also Like"}
            </h2>
            <div className="rec-grid">
              {recommendations.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Cart;
