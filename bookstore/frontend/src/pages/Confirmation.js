import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    navigate("/");
    return null;
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-card card">
          {/* Success Header */}
          <div className="confirmation-header">
            <div className="success-icon">✓</div>
            <h1 className="confirmation-title">Order Confirmed!</h1>
            <p className="confirmation-sub">
              Thank you for your order. You'll receive a confirmation email shortly.
            </p>
          </div>

          {/* Order Info */}
          <div className="order-info-grid">
            <div className="order-info-item">
              <div className="order-info-label">Order ID</div>
              <div className="order-info-value order-id">#{order.id}</div>
            </div>
            <div className="order-info-item">
              <div className="order-info-label">Status</div>
              <div className="order-info-value">
                <span className="badge badge-green">✓ Confirmed</span>
              </div>
            </div>
            <div className="order-info-item">
              <div className="order-info-label">Payment</div>
              <div className="order-info-value">{order.paymentMethod?.toUpperCase()}</div>
            </div>
            <div className="order-info-item">
              <div className="order-info-label">Cancellation</div>
              <div className="order-info-value cancel-hint">Within 48 hours</div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="confirmation-section">
            <h3 className="conf-section-title">📍 Delivery Address</h3>
            <p className="address-display">
              {order.address?.street}, {order.address?.city}, {order.address?.postcode}, {order.address?.country}
            </p>
          </div>

          {/* Items */}
          <div className="confirmation-section">
            <h3 className="conf-section-title">📦 Items Ordered</h3>
            <div className="confirmation-items">
              {order.items.map(item => (
                <div key={item.bookId} className="conf-item">
                  <div className="conf-item-name">{item.title}</div>
                  <div className="conf-item-qty">Qty: {item.qty}</div>
                  <div className="conf-item-price">£{(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="confirmation-section">
            <h3 className="conf-section-title">💰 Payment Summary</h3>
            <div className="conf-totals">
              <div className="conf-total-row">
                <span>Subtotal</span>
                <span>£{order.subtotal?.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="conf-total-row green">
                  <span>🎁 Gift Points Discount</span>
                  <span>−£{order.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="conf-total-row total">
                <span>Total Paid</span>
                <strong>£{order.total?.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="confirmation-actions">
            <Link to="/orders" className="btn btn-primary">
              📦 View My Orders
            </Link>
            <Link to="/catalogue" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>

          {/* Cancel Hint */}
          <div className="cancel-notice">
            <span className="cancel-icon">ℹ</span>
            <span>
              You can cancel this order within <strong>48 hours</strong> of placing it.{" "}
              <Link to="/orders" className="cancel-link">Manage Orders →</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
