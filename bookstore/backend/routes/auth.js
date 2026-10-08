const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users } = require("../data/users");

const JWT_SECRET = process.env.JWT_SECRET || "bookhaven_secret_key_2025";

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      giftPoints: user.giftPoints,
      addresses: user.addresses
    }
  });
});

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ error: "Email already registered" });

  const newUser = {
    id: "u" + Date.now(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    addresses: [],
    giftPoints: 100,
    orderHistory: []
  };
  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, name: newUser.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, giftPoints: 100, addresses: [] }
  });
});

module.exports = router;
