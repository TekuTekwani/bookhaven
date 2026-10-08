import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { api } from "../utils/api";
import "./Orders.css";

const statusColors = {
  confirmed: "badge-blue",
  processing: "badge-amber",
  shipped: "badge-purple",
  delivered: "badge-green",
  cancelled: "badge-red",
};

const Orders = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.getOrders()
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, navigate]);

  const handleBuyAgain = (order) => {
    order.items.forEach(item => {
      addItem({
        id: item.bookId,
        title: item.title,
        price: item.price,
        image: "📚",
        author: ""
      });
    });
    showToast(`${order.items.length} item${order.items.length > 1 ? "s" : ""} added to basket! 🛒`);
    navigate("/cart");
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const data = await api.cancelOrder(orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
      showToast("Order cancelled successfully");
    } catch (err) {
      showToast(err.message || "Cannot cancel this order", "error");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="orders-page container">
        <div className="skeleton" style={{ height: "200px", borderRadius: "0.75rem", marginTop: "2rem" }} />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1 className="orders-title">📦 My Orders</h1>
          <p className="orders-sub">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">📭</div>
            <h3>No orders yet</h3>
            <p>Looks like you haven't placed any orders. Start shopping!</p>
            <button className="btn btn-primary" onClick={() => navigate("/catalogue")}>
              Browse Books
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card card">
                {/* Order Header */}
                <div
                  className="order-header"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <div className="order-meta">
                    <span className="order-id">#{order.id}</span>
                    <span className="order-date">{new Date(order.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="order-status-block">
                    <span className={`badge ${statusColors[order.status] || "badge-blue"}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="order-total">£{order.total?.toFixed(2)}</span>
                  </div>
                  <button className="expand-btn">{expandedId === order.id ? "▲" : "▼"}</button>
                </div>

                {/* Order Items Preview */}
                <div className="order-items-preview">
                  {order.items.map(item => (
                    <div key={item.bookId} className="order-item-pill">
                      <span>📚</span>
                      <span>{item.title}</span>
                      <span className="pill-qty">×{item.qty}</span>
                    </div>
                  ))}
                </div>

                {/* Expanded Details */}
                {expandedId === order.id && (
                  <div className="order-expanded">
                    <div className="order-expanded-items">
                      {order.items.map(item => (
                        <div key={item.bookId} className="order-exp-item">
                          <span className="exp-item-icon">📚</span>
                          <div className="exp-item-info">
                            <div className="exp-item-title">{item.title}</div>
                            <div className="exp-item-price">£{item.price.toFixed(2)} × {item.qty}</div>
                          </div>
                          <div className="exp-item-total">£{(item.price * item.qty).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    {order.address && (
                      <div className="order-address">
                        <span className="order-detail-label">📍 Delivered to:</span>
                        <span>{order.address.street}, {order.address.city}, {order.address.postcode}</span>
                      </div>
                    )}
                    <div className="order-total-breakdown">
                      <span>Order Total</span>
                      <strong>£{order.total?.toFixed(2)}</strong>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="order-actions">
                  <button
                    className="btn btn-primary buy-again-btn"
                    onClick={() => handleBuyAgain(order)}
                  >
                    🔄 Buy Again
                  </button>
                  {order.canCancel && order.status !== "cancelled" && (
                    <button
                      className="btn btn-danger cancel-btn"
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                    >
                      {cancellingId === order.id ? "Cancelling..." : "✕ Cancel Order"}
                    </button>
                  )}
                  {order.canCancel && order.status !== "cancelled" && (
                    <span className="cancel-window-hint">⏱ Cancellable within 48hrs</span>
                  )}
                  {order.status === "cancelled" && (
                    <span className="cancelled-label">Order Cancelled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
