const bcrypt = require("bcryptjs");

const users = [
  {
    id: "u001",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: bcrypt.hashSync("password123", 10),
    addresses: [
      { id: "a001", label: "Home", street: "42 Maple Street", city: "London", postcode: "EC1A 1BB", country: "UK", isDefault: true },
      { id: "a002", label: "Work", street: "100 Tech Park", city: "Manchester", postcode: "M1 2AB", country: "UK", isDefault: false }
    ],
    giftPoints: 350,
    orderHistory: [
      {
        id: "ord001",
        date: "2024-11-15",
        status: "delivered",
        items: [
          { bookId: "b005", title: "Atomic Habits", qty: 1, price: 13.99 },
          { bookId: "b007", title: "Sapiens", qty: 1, price: 14.99 }
        ],
        total: 28.98,
        canCancel: false
      },
      {
        id: "ord002",
        date: "2025-01-20",
        status: "delivered",
        items: [
          { bookId: "b010", title: "Harry Potter and the Philosopher's Stone", qty: 2, price: 10.99 }
        ],
        total: 21.98,
        canCancel: false
      }
    ]
  }
];

module.exports = { users };
