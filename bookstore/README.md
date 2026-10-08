# 📖 BookHaven — Online Bookstore

A full-stack responsive e-commerce bookstore built with **React** (frontend) + **Node.js/Express** (backend) + **PostgreSQL** (data model), developed using **IBM Bob** as the Agentic IDE.

---

## ✅ Features Implemented

| Use Case | Feature |
|---|---|
| UC1 | Login page with JWT authentication |
| UC2 | User registration + personalised recommendations from order history |
| UC3 | Product catalogue per category |
| UC4 | Order History with **Buy Again** feature |
| UC5 | Category selection filter |
| UC6 | Browse by publisher/brand |
| UC7 | Product detail with **estimated delivery date** + related products |
| UC8 | Add product(s) to basket |
| UC9 | Select delivery address at checkout |
| UC10 | Payment method selection (Card, PayPal, Apple Pay, Google Pay) |
| UC11 | **Redeem gift points** at checkout |
| UC12 | Payment confirmation page |
| UC13 | **Cancel order within 48 hours** |

---

## 🏗 Project Structure

```
bookstore/
├── backend/                  # Node.js / Express API
│   ├── data/
│   │   ├── books.js          # 16 books across 5 categories
│   │   └── users.js          # Seeded demo user
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── routes/
│   │   ├── auth.js           # POST /api/auth/login|register
│   │   ├── books.js          # GET  /api/books, /api/books/:id, etc.
│   │   ├── orders.js         # GET/POST /api/orders, POST /api/orders/:id/cancel
│   │   └── users.js          # GET /api/users/profile|recommendations
│   ├── server.js
│   └── package.json
│
├── frontend/                 # React 18 SPA
│   ├── public/index.html
│   └── src/
│       ├── App.js            # Router + context providers
│       ├── context/
│       │   ├── AuthContext.js   # JWT auth state
│       │   ├── CartContext.js   # Persistent cart (localStorage)
│       │   └── ToastContext.js  # Global toast notifications
│       ├── components/
│       │   ├── Navbar.js        # Sticky nav with search + cart badge
│       │   ├── BookCard.js      # Reusable book card
│       │   └── Footer.js        # Site footer with links
│       ├── pages/
│       │   ├── Home.js          # Landing page, hero, categories, bestsellers
│       │   ├── Login.js         # Sign in / Register
│       │   ├── Catalogue.js     # Browse + filter by category & brand
│       │   ├── ProductDetail.js # Book detail, delivery date, related books
│       │   ├── Cart.js          # Basket + recommendations
│       │   ├── Checkout.js      # 3-step: address → payment → review
│       │   ├── Confirmation.js  # Order confirmation + cancel notice
│       │   └── Orders.js        # Order history + Buy Again + Cancel
│       └── utils/api.js         # All API calls
│
├── openapi.yaml              # OpenAPI 3.0 specification
├── schema.sql                # PostgreSQL data model
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 15+ *(optional — backend uses in-memory data by default)*

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/bookhaven.git
cd bookhaven
```

### 2. Start the Backend

```bash
cd bookstore/backend
npm install
npm start
# API running at http://127.0.0.1:5001
```

### 3. Start the Frontend

```bash
cd bookstore/frontend
npm install
npm start
# App running at http://localhost:3000
```

### 4. (Optional) Set up PostgreSQL

```bash
createdb bookhaven
psql -U postgres -d bookhaven -f bookstore/schema.sql
```

Then update `backend/server.js` to use `pg` with your connection string:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/bookhaven
```

---

## 🔐 Demo Credentials

| Field | Value |
|---|---|
| Email | `alex@example.com` |
| Password | `password123` |
| Gift Points | 350 |

---

## 🌐 API Reference

The full OpenAPI 3.0 spec is at [`bookstore/openapi.yaml`](./openapi.yaml).

Key endpoints:

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Login → returns JWT |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/books` | List books (filter/sort/search) |
| GET | `/api/books/featured` | Bestsellers |
| GET | `/api/books/:id` | Book detail + delivery date + related |
| GET | `/api/books/categories` | All categories |
| GET | `/api/books/brands` | All publishers |
| GET | `/api/orders` | 🔒 Order history |
| POST | `/api/orders` | 🔒 Place order |
| POST | `/api/orders/:id/cancel` | 🔒 Cancel order (48hr window) |
| GET | `/api/users/profile` | 🔒 User profile |
| GET | `/api/users/recommendations` | 🔒 Personalised recommendations |
| POST | `/api/users/addresses` | 🔒 Add delivery address |

🔒 = requires `Authorization: Bearer <token>` header

---

## 🎥 Video Walkthrough (3 min)

The video demonstrates:
1. **IBM Bob** used as the Agentic IDE — prompts given to generate pages, components, and API routes
2. **Home page** — hero banner, bestsellers, category grid
3. **Login / Register** flow with JWT authentication
4. **Catalogue** — filtering by category and publisher brand
5. **Product Detail** — estimated delivery date, related books
6. **Shopping Cart** — add items, see personalised recommendations
7. **Checkout** — address selection, payment method, gift points redemption
8. **Order Confirmation** — order ID, cancel notice
9. **Orders page** — history, Buy Again button, 48hr cancellation

---

## 🔧 Git Workflow (PR Checklist)

```bash
# 1. Create feature branch
git checkout -b feature/bookhaven-estore

# 2. Stage all files
git add .

# 3. Commit
git commit -m "feat: BookHaven e-commerce bookstore — all 13 use cases implemented"

# 4. Push branch
git push origin feature/bookhaven-estore

# 5. Open Pull Request on GitHub
# Title:  BookHaven E-store — Full Stack Implementation
# Base:   main
# Head:   feature/bookhaven-estore
# Description: Link to video walkthrough + list use cases covered
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, vanilla CSS |
| Backend | Node.js 18, Express 4 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Database | PostgreSQL 15 (schema provided) |
| API Spec | OpenAPI 3.0 |
| Agentic IDE | IBM Bob |

---

## 📊 Data Model (Summary)

See [`bookstore/schema.sql`](./schema.sql) for the full PostgreSQL schema.

```
users ──< addresses
users ──< orders ──< order_items >── books
users ──< gift_points_ledger
books >── categories
books >── publishers
books ──< book_tags >── tags
books ──< related_books
```

---

*Built with ❤️ using IBM Bob — AI-augmented development*
