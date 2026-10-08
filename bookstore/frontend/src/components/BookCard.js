import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "./BookCard.css";

const BookCard = ({ book }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const discount = book.originalPrice > book.price
    ? Math.round((1 - book.price / book.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(book);
    showToast(`"${book.title}" added to basket! 🛒`);
  };

  return (
    <div className="book-card card">
      <Link to={`/book/${book.id}`} className="book-card-link">
        <div className="book-cover">
          <span className="book-emoji">{book.image}</span>
          {discount > 0 && (
            <span className="discount-badge">-{discount}%</span>
          )}
          {book.tags.includes("bestseller") && (
            <span className="bestseller-badge">★ Bestseller</span>
          )}
        </div>
        <div className="book-info">
          <div className="book-category">{book.category}</div>
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <div className="book-brand">{book.brand}</div>
          <div className="book-rating">
            <span className="stars">{"★".repeat(Math.round(book.rating))}{"☆".repeat(5 - Math.round(book.rating))}</span>
            <span className="rating-value">{book.rating}</span>
            <span className="rating-count">({book.reviews.toLocaleString()})</span>
          </div>
          <div className="book-delivery">
            <span className="delivery-icon">🚚</span>
            <span>Delivery in {book.deliveryDays} day{book.deliveryDays > 1 ? "s" : ""}</span>
          </div>
        </div>
      </Link>
      <div className="book-card-footer">
        <div className="book-price">
          <span className="price-current">£{book.price.toFixed(2)}</span>
          {discount > 0 && (
            <span className="price-original">£{book.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          + Add to Basket
        </button>
      </div>
    </div>
  );
};

export default BookCard;
