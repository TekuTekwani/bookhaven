import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../utils/api";
import "./Checkout.css";

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, Amex" },
  { id: "paypal", label: "PayPal", icon: "🅿", desc: "Pay with your PayPal account" },
  { id: "apple", label: "Apple Pay", icon: "🍎", desc: "Fast, secure checkout" },
  { id: "google", label: "Google Pay", icon: "G", desc: "Pay with Google" },
];

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [selectedAddress, setSelectedAddress] = useState(
    user?.addresses?.find(a => a.isDefault)?.id || user?.addresses?.[0]?.id || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [usePoints, setUsePoints] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", street: "", city: "", postcode: "", country: "UK" });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: review

  const deliveryFee = subtotal >= 25 ? 0 : 3.99;
  const pointsDiscount = usePoints ? Math.min((user?.giftPoints || 0) / 100, subtotal * 0.2) : 0;
  const total = subtotal + deliveryFee - pointsDiscount;

  useEffect(() => {
    if (!user) navigate("/login");
    if (items.length === 0) navigate("/cart");
  }, [user, items, navigate]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const data = await api.addAddress(newAddr);
      setAddresses(data.addresses);
      setSelectedAddress(data.address.id);
      setAddingAddress(false);
      setNewAddr({ label: "", street: "", city: "", postcode: "", country: "UK" });
      showToast("Address saved ✓");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { showToast("Please select a delivery address", "error"); return; }
    setLoading(true);
    try {
      const data = await api.placeOrder({
        items: items.map(i => ({ bookId: i.bookId, qty: i.qty })),
        addressId: selectedAddress,
        paymentMethod,
        useGiftPoints: usePoints,
      });
      updateUser({ giftPoints: data.giftPoints });
      clearCart();
      navigate("/confirmation", { state: { order: data.order } });
    } catch (err) {
      showToast(err.message || "Order failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Secure Checkout 🔒</h1>

        {/* Step Indicator */}
        <div className="checkout-steps">
          {["Delivery", "Payment", "Review"].map((s, i) => (
            <div key={s} className={`checkout-step ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}>
              <div className="step-num">{step > i + 1 ? "✓" : i + 1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">

            {/* Step 1: Address */}
            {step === 1 && (
              <div className="checkout-section card">
                <h2 className="checkout-section-title">📍 Select Delivery Address</h2>
                <div className="address-list">
                  {addresses.map(addr => (
                    <label key={addr.id} className={`address-option ${selectedAddress === addr.id ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                      />
                      <div className="address-details">
                        <div className="address-label">
                          {addr.label}
                          {addr.isDefault && <span className="badge badge-blue" style={{ marginLeft: "0.5rem" }}>Default</span>}
                        </div>
                        <div className="address-text">{addr.street}, {addr.city}, {addr.postcode}, {addr.country}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {!addingAddress ? (
                  <button className="btn btn-secondary add-addr-btn" onClick={() => setAddingAddress(true)}>
                    + Add New Address
                  </button>
                ) : (
                  <form className="add-address-form" onSubmit={handleAddAddress}>
                    <h3 style={{ marginBottom: "0.75rem", fontSize: "0.95rem", fontWeight: 600 }}>New Address</h3>
                    <div className="addr-form-grid">
                      <div className="form-group">
                        <label className="form-label">Label (Home/Work)</label>
                        <input className="form-input" placeholder="e.g. Home"
                          value={newAddr.label} onChange={e => setNewAddr({ ...newAddr, label: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Country</label>
                        <input className="form-input" placeholder="UK"
                          value={newAddr.country} onChange={e => setNewAddr({ ...newAddr, country: e.target.value })} required />
                      </div>
                      <div className="form-group full-span">
                        <label className="form-label">Street Address</label>
                        <input className="form-input" placeholder="123 Main Street"
                          value={newAddr.street} onChange={e => setNewAddr({ ...newAddr, street: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input className="form-input" placeholder="London"
                          value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Postcode</label>
                        <input className="form-input" placeholder="EC1A 1BB"
                          value={newAddr.postcode} onChange={e => setNewAddr({ ...newAddr, postcode: e.target.value })} required />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button type="submit" className="btn btn-primary">Save Address</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setAddingAddress(false)}>Cancel</button>
                    </div>
                  </form>
                )}

                <button className="btn btn-primary next-btn" onClick={() => selectedAddress && setStep(2)} disabled={!selectedAddress}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="checkout-section card">
                <h2 className="checkout-section-title">💳 Payment Method</h2>
                <div className="payment-methods">
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.id} className={`payment-option ${paymentMethod === pm.id ? "selected" : ""}`}>
                      <input type="radio" name="payment" value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)} />
                      <div className="payment-icon">{pm.icon}</div>
                      <div className="payment-info">
                        <div className="payment-label">{pm.label}</div>
                        <div className="payment-desc">{pm.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Gift Points */}
                {(user?.giftPoints || 0) > 0 && (
                  <div className="gift-points-section">
                    <h3 className="gift-points-title">🎁 Redeem Gift Points</h3>
                    <div className="gift-points-balance">
                      You have <strong>{user.giftPoints} points</strong> (worth £{(user.giftPoints / 100).toFixed(2)})
                    </div>
                    <label className="gift-points-toggle">
                      <input
                        type="checkbox"
                        checked={usePoints}
                        onChange={e => setUsePoints(e.target.checked)}
                      />
                      <span>Apply gift points to this order (save £{Math.min(user.giftPoints / 100, subtotal * 0.2).toFixed(2)})</span>
                    </label>
                  </div>
                )}

                <div className="step-buttons">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary next-btn" onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="checkout-section card">
                <h2 className="checkout-section-title">📋 Review Your Order</h2>

                <div className="review-items">
                  {items.map(item => (
                    <div key={item.bookId} className="review-item">
                      <span className="review-item-emoji">{item.image}</span>
                      <div className="review-item-info">
                        <div className="review-item-title">{item.title}</div>
                        <div className="review-item-qty">Qty: {item.qty}</div>
                      </div>
                      <div className="review-item-price">£{(item.price * item.qty).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="review-details">
                  <div className="review-row">
                    <span>📍 Delivery to</span>
                    <span>{addresses.find(a => a.id === selectedAddress)?.street}, {addresses.find(a => a.id === selectedAddress)?.city}</span>
                  </div>
                  <div className="review-row">
                    <span>💳 Payment</span>
                    <span>{PAYMENT_METHODS.find(pm => pm.id === paymentMethod)?.label}</span>
                  </div>
                  {usePoints && (
                    <div className="review-row green">
                      <span>🎁 Gift Points Discount</span>
                      <span>−£{pointsDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="step-buttons">
                  <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                  <button
                    className="btn btn-success place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : "✓ Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary card">
            <h3 className="summary-title">Order Summary</h3>
            {items.map(item => (
              <div key={item.bookId} className="summary-item">
                <span className="summary-item-emoji">{item.image}</span>
                <span className="summary-item-name">{item.title}</span>
                <span className="summary-item-price">£{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-row">
              <span>Subtotal</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? "free-delivery" : ""}>{deliveryFee === 0 ? "FREE" : `£${deliveryFee.toFixed(2)}`}</span>
            </div>
            {usePoints && pointsDiscount > 0 && (
              <div className="summary-row" style={{ color: "#16a34a" }}>
                <span>Gift Points</span>
                <span>−£{pointsDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>£{total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
