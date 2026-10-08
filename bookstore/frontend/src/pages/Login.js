import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Login.css";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        showToast("Welcome back! 👋");
        navigate("/");
      } else {
        await register(form.name, form.email, form.password);
        showToast("Account created! Welcome to BookHaven 🎉");
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-brand">
            <span className="login-brand-icon">📖</span>
            <h1 className="login-brand-name">BookHaven</h1>
          </div>
          <h2 className="login-headline">Discover your next great read</h2>
          <p className="login-subtext">
            Join millions of book lovers. Browse thousands of titles, track your orders, and earn gift points on every purchase.
          </p>
          <div className="login-features">
            <div className="login-feature"><span>📚</span> 10,000+ titles across all genres</div>
            <div className="login-feature"><span>🚚</span> Fast delivery in 2–5 days</div>
            <div className="login-feature"><span>🎁</span> Earn gift points on every order</div>
            <div className="login-feature"><span>🔒</span> Secure & encrypted checkout</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="login-card card">
            <div className="login-tabs">
              <button
                className={`login-tab ${mode === "login" ? "active" : ""}`}
                onClick={() => { setMode("login"); setError(""); }}
              >Sign In</button>
              <button
                className={`login-tab ${mode === "register" ? "active" : ""}`}
                onClick={() => { setMode("register"); setError(""); }}
              >Create Account</button>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {mode === "register" && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-input ${error && !form.name ? "error" : ""}`}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${error ? "error" : ""}`}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className={`form-input ${error ? "error" : ""}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {error && <div className="login-error">⚠ {error}</div>}

              {mode === "login" && (
                <div className="login-demo-hint">
                  <strong>Demo:</strong> alex@example.com / password123
                </div>
              )}

              <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              </button>

              <p className="login-switch">
                {mode === "login" ? "New to BookHaven? " : "Already have an account? "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                >
                  {mode === "login" ? "Create Account" : "Sign In"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
