const express = require("express");
const router = express.Router();
const { books, categories, brands } = require("../data/books");

// GET /api/books - list with optional filters
router.get("/", (req, res) => {
  const { category, brand, q, sort } = req.query;
  let result = [...books];

  if (category) result = result.filter(b => b.category === category);
  if (brand) result = result.filter(b => b.brand === brand);
  if (q) {
    const lq = q.toLowerCase();
    result = result.filter(b =>
      b.title.toLowerCase().includes(lq) ||
      b.author.toLowerCase().includes(lq) ||
      b.tags.some(t => t.includes(lq))
    );
  }
  if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
  if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

  res.json({ books: result, total: result.length });
});

// GET /api/books/categories
router.get("/categories", (req, res) => res.json({ categories }));

// GET /api/books/brands
router.get("/brands", (req, res) => res.json({ brands }));

// GET /api/books/featured
router.get("/featured", (req, res) => {
  const featured = books.filter(b => b.tags.includes("bestseller")).slice(0, 6);
  res.json({ books: featured });
});

// GET /api/books/:id
router.get("/:id", (req, res) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + book.deliveryDays);

  const related = book.relatedIds
    .map(rid => books.find(b => b.id === rid))
    .filter(Boolean);

  res.json({
    ...book,
    estimatedDelivery: deliveryDate.toDateString(),
    related
  });
});

module.exports = router;
