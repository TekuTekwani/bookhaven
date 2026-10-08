import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { api } from "../utils/api";
import "./Catalogue.css";

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const Catalogue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const activeCategory = searchParams.get("category") || "";
  const activeBrand = searchParams.get("brand") || "";
  const activeSort = searchParams.get("sort") || "";
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    api.getCategories().then(d => setCategories(d.categories || []));
    api.getBrands().then(d => setBrands(d.brands || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (activeBrand) params.brand = activeBrand;
    if (activeSort) params.sort = activeSort;
    if (searchQuery) params.q = searchQuery;

    api.getBooks(params).then(d => {
      setBooks(d.books || []);
      setTotal(d.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeCategory, activeBrand, activeSort, searchQuery]);

  const setFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    // Reset pagination when filter changes
    setSearchParams(newParams);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = activeCategory || activeBrand || searchQuery || activeSort;

  return (
    <div className="catalogue-page">
      <div className="container">
        {/* Header */}
        <div className="catalogue-header">
          <div>
            <h1 className="catalogue-title">
              {searchQuery ? `Results for "${searchQuery}"` :
               activeCategory ? activeCategory : "All Books"}
            </h1>
            <p className="catalogue-count">
              {loading ? "Loading..." : `${total} book${total !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <div className="catalogue-sort">
            <label className="form-label">Sort by</label>
            <select
              className="form-input"
              value={activeSort}
              onChange={e => setFilter("sort", e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="catalogue-layout">
          {/* Sidebar Filters */}
          <aside className="catalogue-sidebar">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Categories</h3>
              <button
                className={`sidebar-item ${!activeCategory ? "active" : ""}`}
                onClick={() => setFilter("category", "")}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`sidebar-item ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setFilter("category", activeCategory === cat ? "" : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="sidebar-section">
              <h3 className="sidebar-title">Publishers / Brands</h3>
              <button
                className={`sidebar-item ${!activeBrand ? "active" : ""}`}
                onClick={() => setFilter("brand", "")}
              >
                All Publishers
              </button>
              {brands.map(brand => (
                <button
                  key={brand}
                  className={`sidebar-item ${activeBrand === brand ? "active" : ""}`}
                  onClick={() => setFilter("brand", activeBrand === brand ? "" : brand)}
                >
                  {brand}
                </button>
              ))}
            </div>

            {hasFilters && (
              <button className="btn btn-secondary clear-filters-btn" onClick={clearFilters}>
                ✕ Clear Filters
              </button>
            )}
          </aside>

          {/* Main Content */}
          <main className="catalogue-main">
            {/* Active filter chips */}
            {hasFilters && (
              <div className="filter-chips">
                {activeCategory && (
                  <span className="filter-chip">
                    📚 {activeCategory}
                    <button onClick={() => setFilter("category", "")}>✕</button>
                  </span>
                )}
                {activeBrand && (
                  <span className="filter-chip">
                    🏷 {activeBrand}
                    <button onClick={() => setFilter("brand", "")}>✕</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="filter-chip">
                    🔍 "{searchQuery}"
                    <button onClick={() => setFilter("q", "")}>✕</button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="catalogue-grid">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="skeleton" style={{ height: "320px", borderRadius: "0.75rem" }} />
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No books found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="catalogue-grid">
                {books.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
