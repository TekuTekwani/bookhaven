import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bookhaven_cart")) || [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("bookhaven_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (book, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.bookId === book.id);
      if (existing) {
        return prev.map(i =>
          i.bookId === book.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, {
        bookId: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
        qty
      }];
    });
  };

  const removeItem = (bookId) => {
    setItems(prev => prev.filter(i => i.bookId !== bookId));
  };

  const updateQty = (bookId, qty) => {
    if (qty <= 0) { removeItem(bookId); return; }
    setItems(prev => prev.map(i => i.bookId === bookId ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
