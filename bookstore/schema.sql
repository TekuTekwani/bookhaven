-- ============================================================
-- BookHaven PostgreSQL Data Model
-- ============================================================
-- Run: psql -U postgres -d bookhaven -f schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ───────────────────────────────────────────────
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(150)        NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255)        NOT NULL,  -- bcrypt hash
    gift_points INTEGER             NOT NULL DEFAULT 100,
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- ─── Addresses ───────────────────────────────────────────
CREATE TABLE addresses (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label      VARCHAR(50)  NOT NULL DEFAULT 'Address',
    street     VARCHAR(255) NOT NULL,
    city       VARCHAR(100) NOT NULL,
    postcode   VARCHAR(20)  NOT NULL,
    country    VARCHAR(80)  NOT NULL DEFAULT 'UK',
    is_default BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── Categories ──────────────────────────────────────────
CREATE TABLE categories (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO categories (name) VALUES
    ('Fiction'),
    ('Non-Fiction'),
    ('Children'),
    ('Mystery & Thriller'),
    ('Science & Tech');

-- ─── Publishers (Brands) ─────────────────────────────────
CREATE TABLE publishers (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

-- ─── Books ───────────────────────────────────────────────
CREATE TABLE books (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title          VARCHAR(255)   NOT NULL,
    author         VARCHAR(255)   NOT NULL,
    category_id    INTEGER        REFERENCES categories(id),
    publisher_id   INTEGER        REFERENCES publishers(id),
    price          NUMERIC(8, 2)  NOT NULL CHECK (price >= 0),
    original_price NUMERIC(8, 2)  NOT NULL CHECK (original_price >= 0),
    image_emoji    VARCHAR(10)    NOT NULL DEFAULT '📚',
    rating         NUMERIC(3, 2)  NOT NULL DEFAULT 0.0 CHECK (rating BETWEEN 0 AND 5),
    review_count   INTEGER        NOT NULL DEFAULT 0,
    stock          INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
    delivery_days  SMALLINT       NOT NULL DEFAULT 3 CHECK (delivery_days > 0),
    description    TEXT,
    is_active      BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_books_category  ON books(category_id);
CREATE INDEX idx_books_publisher ON books(publisher_id);
CREATE INDEX idx_books_rating    ON books(rating DESC);

-- Full-text search index
CREATE INDEX idx_books_fts ON books
    USING GIN (to_tsvector('english', title || ' ' || author || ' ' || COALESCE(description, '')));

-- ─── Book Tags ───────────────────────────────────────────
CREATE TABLE tags (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE book_tags (
    book_id UUID    NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    tag_id  INTEGER NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
    PRIMARY KEY (book_id, tag_id)
);

-- ─── Related Books ───────────────────────────────────────
CREATE TABLE related_books (
    book_id         UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    related_book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, related_book_id),
    CHECK (book_id <> related_book_id)
);

-- ─── Orders ──────────────────────────────────────────────
CREATE TYPE order_status AS ENUM (
    'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
);

CREATE TYPE payment_method AS ENUM (
    'card', 'paypal', 'apple', 'google'
);

CREATE TABLE orders (
    id             UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID           NOT NULL REFERENCES users(id),
    address_id     UUID           REFERENCES addresses(id),
    status         order_status   NOT NULL DEFAULT 'confirmed',
    payment_method payment_method NOT NULL,
    subtotal       NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount       NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
    delivery_fee   NUMERIC(6, 2)  NOT NULL DEFAULT 0,
    total          NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    can_cancel     BOOLEAN        NOT NULL DEFAULT TRUE,
    placed_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user      ON orders(user_id);
CREATE INDEX idx_orders_placed_at ON orders(placed_at DESC);

-- ─── Order Items ─────────────────────────────────────────
CREATE TABLE order_items (
    id         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   UUID           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id    UUID           NOT NULL REFERENCES books(id),
    title      VARCHAR(255)   NOT NULL,  -- snapshot at time of order
    qty        SMALLINT       NOT NULL CHECK (qty > 0),
    unit_price NUMERIC(8, 2)  NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(10, 2) GENERATED ALWAYS AS (qty * unit_price) STORED
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ─── Gift Points Ledger ──────────────────────────────────
CREATE TYPE points_event AS ENUM (
    'earned', 'redeemed', 'refunded', 'adjustment'
);

CREATE TABLE gift_points_ledger (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES users(id),
    order_id    UUID         REFERENCES orders(id),
    event       points_event NOT NULL,
    points      INTEGER      NOT NULL,  -- positive = earned, negative = redeemed
    balance     INTEGER      NOT NULL,  -- running balance after this event
    description TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_points_user ON gift_points_ledger(user_id, created_at DESC);

-- ─── Triggers: updated_at ────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Cancellation auto-disable after 48hrs ───────────────
-- Run this as a scheduled job (pg_cron or app-level cron)
-- UPDATE orders SET can_cancel = FALSE
-- WHERE can_cancel = TRUE
--   AND status NOT IN ('cancelled', 'delivered')
--   AND placed_at < NOW() - INTERVAL '48 hours';
