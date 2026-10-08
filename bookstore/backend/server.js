const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", service: "BookHaven API" }));

app.listen(PORT, "127.0.0.1", () => {
  console.log(`BookHaven API running on http://127.0.0.1:${PORT}`);
});

module.exports = app;
