const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { users } = require("../data/users");
const { books } = require("../data/books");

// GET /api/users/profile
router.get("/profile", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({
    id: user.id, name: user.name, email: user.email,
    giftPoints: user.giftPoints, addresses: user.addresses
  });
});

// GET /api/users/recommendations
router.get("/recommendations", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Collect purchased book IDs
  const purchasedIds = user.orderHistory.flatMap(o => o.items.map(i => i.bookId));
  const purchasedBooks = purchasedIds.map(id => books.find(b => b.id === id)).filter(Boolean);

  // Get related books not yet purchased
  const relatedIds = new Set();
  purchasedBooks.forEach(b => b.relatedIds.forEach(rid => {
    if (!purchasedIds.includes(rid)) relatedIds.add(rid);
  }));

  const recommendations = [...relatedIds]
    .map(id => books.find(b => b.id === id))
    .filter(Boolean)
    .slice(0, 4);

  // Fallback to bestsellers if no history
  if (recommendations.length === 0) {
    return res.json({
      books: books.filter(b => b.tags.includes("bestseller")).slice(0, 4)
    });
  }

  res.json({ books: recommendations });
});

// POST /api/users/addresses
router.post("/addresses", authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { label, street, city, postcode, country } = req.body;
  const newAddr = {
    id: "a" + Date.now(),
    label: label || "Address",
    street, city, postcode,
    country: country || "UK",
    isDefault: user.addresses.length === 0
  };
  user.addresses.push(newAddr);
  res.status(201).json({ address: newAddr, addresses: user.addresses });
});

module.exports = router;
