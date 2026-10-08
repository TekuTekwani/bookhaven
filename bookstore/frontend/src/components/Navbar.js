import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📖</span>
          <span className="logo-text">BookHaven</span>
        </Link>

        {/* Search */}
        <form className="navbar-search hide-mobile" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search books, authors, genres..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/catalogue" className={`nav-link ${location.pathname === "/catalogue" ? "active" : ""}`}>
            Catalogue
          </Link>

          {user ? (
            <>
              <Link to="/orders" className={`nav-link ${location.pathname === "/orders" ? "active" : ""}`}>
                Orders
              </Link>
              <div className="nav-user-menu">
                <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                  <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="hide-mobile">{user.name.split(" ")[0]}</span>
                  <span>▾</span>
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-email">{user.email}</div>
                      <div className="dropdown-points">🎁 {user.giftPoints} Gift Points</div>
                    </div>
                    <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      📦 My Orders
                    </Link>
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}>
              Sign In
            </Link>
          )}

          <Link to="/cart" className="cart-btn">
            <span>🛒</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile search */}
      <div className="mobile-search">
        <form className="container" onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", padding: "0.5rem 1rem" }}>
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ flex: 1 }}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
