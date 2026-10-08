import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span>📖</span>
            <span className="footer-logo-text">BookHaven</span>
          </div>
          <p className="footer-tagline">
            Discover your next great read. Millions of books, delivered to your door.
          </p>
          <div className="footer-socials">
            <a href="https://github.com" className="social-link">GitHub</a>
            <a href="https://twitter.com" className="social-link">Twitter</a>
            <a href="https://linkedin.com" className="social-link">LinkedIn</a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/catalogue?category=Fiction">Fiction</Link>
            <Link to="/catalogue?category=Non-Fiction">Non-Fiction</Link>
            <Link to="/catalogue?category=Children">Children</Link>
            <Link to="/catalogue?category=Mystery+%26+Thriller">Mystery &amp; Thriller</Link>
            <Link to="/catalogue?category=Science+%26+Tech">Science &amp; Tech</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/login">Register</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart">My Basket</Link>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <a href="#faq">FAQ</a>
            <a href="#shipping">Shipping Info</a>
            <a href="#returns">Returns Policy</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2025 BookHaven. All rights reserved.</span>
          <span className="footer-badges">
            <span className="footer-badge">🔒 Secure Payments</span>
            <span className="footer-badge">📦 Free Delivery over £25</span>
            <span className="footer-badge">⭐ 4.9/5 Customer Rating</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
