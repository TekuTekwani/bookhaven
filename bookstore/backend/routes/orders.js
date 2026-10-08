const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { users } = require("../data/users");
const { books } = require("../data/books");
const { v4: uuidv4 } = require("uuid");

// GET /api/orders - get order history for logged-in user
router.get("/", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const ordersWithDetails = user.orderHistory.map(order => ({
    ...order,
    canCancel: canCancelOrder(order.date)
  }));
  res.json({ orders: ordersWithDetails });
});

// POST /api/orders - place a new order
router.post("/", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { items, addressId, paymentMethod, useGiftPoints } = req.body;
  if (!items || items.length === 0)
    return res.status(400).json({ error: "No items in order" });

  const address = user.addresses.find(a => a.id === addressId);
  if (!address) return res.status(400).json({ error: "Invalid address" });

  let subtotal = 0;
  const orderItems = items.map(item => {
    const book = books.find(b => b.id === item.bookId);
    if (!book) throw new Error("Book not found: " + item.bookId);
    subtotal += book.price * item.qty;
    return { bookId: book.id, title: book.title, qty: item.qty, price: book.price };
  });

  let discount = 0;
  if (useGiftPoints && user.giftPoints > 0) {
    discount = Math.min(user.giftPoints / 100, subtotal * 0.2);
    user.giftPoints -= discount * 100;
    if (user.giftPoints < 0) user.giftPoints = 0;
  }

  const total = parseFloat((subtotal - discount).toFixed(2));
  const orderId = "ord" + uuidv4().slice(0, 6).toUpperCase();

  const newOrder = {
    id: orderId,
    date: new Date().toISOString().split("T")[0],
    status: "confirmed",
    items: orderItems,
    address,
    paymentMethod,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total,
    canCancel: true
  };

  user.orderHistory.unshift(newOrder);
  // Award points: 1 point per £1 spent
  user.giftPoints = Math.floor((user.giftPoints || 0) + total);

  res.status(201).json({ order: newOrder, giftPoints: user.giftPoints });
});

// POST /api/orders/:id/cancel
router.post("/:id/cancel", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const order = user.orderHistory.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (!canCancelOrder(order.date)) {
    return res.status(400).json({ error: "Cancellation window (48hrs) has passed" });
  }

  order.status = "cancelled";
  order.canCancel = false;

  // Refund gift points used
  if (order.discount > 0) {
    user.giftPoints += order.discount * 100;
  }

  res.json({ message: "Order cancelled successfully", order });
});

function canCancelOrder(orderDate) {
  const placed = new Date(orderDate);
  const now = new Date();
  const diffHrs = (now - placed) / (1000 * 60 * 60);
  return diffHrs <= 48;
}

module.exports = router;
