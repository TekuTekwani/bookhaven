const books = [
  {
    id: "b001", title: "The Midnight Library", author: "Matt Haig",
    category: "Fiction", brand: "Canongate Books", price: 14.99,
    originalPrice: 18.99, image: "📚", rating: 4.7, reviews: 2841,
    stock: 45, deliveryDays: 3,
    description: "A dazzling novel about all the lives you could have lived.",
    tags: ["bestseller", "emotional", "philosophical"],
    relatedIds: ["b002", "b003", "b010"]
  },
  {
    id: "b002", title: "Project Hail Mary", author: "Andy Weir",
    category: "Fiction", brand: "Ballantine Books", price: 16.99,
    originalPrice: 16.99, image: "🚀", rating: 4.9, reviews: 3102,
    stock: 30, deliveryDays: 2,
    description: "A lone astronaut must save Earth from disaster in this gripping sci-fi.",
    tags: ["sci-fi", "adventure", "bestseller"],
    relatedIds: ["b001", "b003", "b011"]
  },
  {
    id: "b003", title: "Lessons in Chemistry", author: "Bonnie Garmus",
    category: "Fiction", brand: "Doubleday", price: 15.99,
    originalPrice: 19.99, image: "🔬", rating: 4.8, reviews: 1987,
    stock: 22, deliveryDays: 4,
    description: "A chemist-turned-cooking-show-host challenges 1960s gender norms.",
    tags: ["women", "humor", "historical"],
    relatedIds: ["b001", "b004", "b010"]
  },
  {
    id: "b004", title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin",
    category: "Fiction", brand: "Knopf", price: 17.99,
    originalPrice: 17.99, image: "🎮", rating: 4.6, reviews: 1543,
    stock: 18, deliveryDays: 3,
    description: "A story of creativity, collaboration, and love set in the world of gaming.",
    tags: ["friendship", "gaming", "literary"],
    relatedIds: ["b002", "b003", "b005"]
  },
  {
    id: "b005", title: "Atomic Habits", author: "James Clear",
    category: "Non-Fiction", brand: "Avery", price: 13.99,
    originalPrice: 16.99, image: "⚛️", rating: 4.9, reviews: 5234,
    stock: 80, deliveryDays: 2,
    description: "Tiny changes, remarkable results. The definitive guide to habit formation.",
    tags: ["self-help", "productivity", "bestseller"],
    relatedIds: ["b006", "b007", "b008"]
  },
  {
    id: "b006", title: "Thinking, Fast and Slow", author: "Daniel Kahneman",
    category: "Non-Fiction", brand: "Farrar, Straus and Giroux", price: 15.00,
    originalPrice: 17.00, image: "🧠", rating: 4.7, reviews: 4102,
    stock: 35, deliveryDays: 3,
    description: "A masterpiece exploring the two systems that drive how we think.",
    tags: ["psychology", "decision-making", "classic"],
    relatedIds: ["b005", "b007", "b009"]
  },
  {
    id: "b007", title: "Sapiens", author: "Yuval Noah Harari",
    category: "Non-Fiction", brand: "Harper", price: 14.99,
    originalPrice: 18.00, image: "🏛️", rating: 4.8, reviews: 6801,
    stock: 50, deliveryDays: 2,
    description: "A brief history of humankind from the Stone Age to the present.",
    tags: ["history", "science", "bestseller"],
    relatedIds: ["b006", "b008", "b009"]
  },
  {
    id: "b008", title: "Educated", author: "Tara Westover",
    category: "Non-Fiction", brand: "Random House", price: 13.99,
    originalPrice: 15.99, image: "🎓", rating: 4.8, reviews: 3921,
    stock: 28, deliveryDays: 3,
    description: "A memoir of a woman who grows up in a survivalist family and earns a PhD.",
    tags: ["memoir", "education", "inspiring"],
    relatedIds: ["b007", "b006", "b009"]
  },
  {
    id: "b009", title: "The Very Hungry Caterpillar", author: "Eric Carle",
    category: "Children", brand: "Philomel Books", price: 8.99,
    originalPrice: 9.99, image: "🐛", rating: 4.9, reviews: 8523,
    stock: 100, deliveryDays: 2,
    description: "A beloved classic about a caterpillar who eats his way to becoming a butterfly.",
    tags: ["picture-book", "classic", "toddler"],
    relatedIds: ["b010", "b011", "b012"]
  },
  {
    id: "b010", title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling",
    category: "Children", brand: "Bloomsbury", price: 10.99,
    originalPrice: 12.99, image: "⚡", rating: 4.9, reviews: 12045,
    stock: 65, deliveryDays: 2,
    description: "The magical beginning of the most beloved series in the world.",
    tags: ["fantasy", "magic", "series", "bestseller"],
    relatedIds: ["b009", "b011", "b002"]
  },
  {
    id: "b011", title: "Diary of a Wimpy Kid", author: "Jeff Kinney",
    category: "Children", brand: "Amulet Books", price: 9.99,
    originalPrice: 9.99, image: "📓", rating: 4.7, reviews: 7231,
    stock: 55, deliveryDays: 3,
    description: "Middle school survival in cartoon-illustrated diary format.",
    tags: ["humor", "middle-grade", "series"],
    relatedIds: ["b009", "b010", "b012"]
  },
  {
    id: "b012", title: "The Silent Patient", author: "Alex Michaelides",
    category: "Mystery & Thriller", brand: "Celadon Books", price: 12.99,
    originalPrice: 15.99, image: "🔍", rating: 4.6, reviews: 4567,
    stock: 40, deliveryDays: 3,
    description: "A famous painter shoots her husband and never speaks another word.",
    tags: ["thriller", "psychological", "twist"],
    relatedIds: ["b013", "b014", "b001"]
  },
  {
    id: "b013", title: "Gone Girl", author: "Gillian Flynn",
    category: "Mystery & Thriller", brand: "Crown Publishers", price: 11.99,
    originalPrice: 14.99, image: "👰", rating: 4.5, reviews: 3892,
    stock: 33, deliveryDays: 4,
    description: "On their fifth wedding anniversary, Nick's wife Amy disappears.",
    tags: ["thriller", "suspense", "marriage"],
    relatedIds: ["b012", "b014", "b004"]
  },
  {
    id: "b014", title: "The Da Vinci Code", author: "Dan Brown",
    category: "Mystery & Thriller", brand: "Doubleday", price: 11.99,
    originalPrice: 13.99, image: "🎨", rating: 4.4, reviews: 9102,
    stock: 42, deliveryDays: 2,
    description: "A murder in the Louvre and clues in Da Vinci paintings lead to a discovery.",
    tags: ["thriller", "adventure", "classic"],
    relatedIds: ["b012", "b013", "b007"]
  },
  {
    id: "b015", title: "A Brief History of Time", author: "Stephen Hawking",
    category: "Science & Tech", brand: "Bantam Books", price: 12.99,
    originalPrice: 14.99, image: "🌌", rating: 4.8, reviews: 7643,
    stock: 38, deliveryDays: 3,
    description: "From the Big Bang to black holes, Hawking explains the universe.",
    tags: ["physics", "astronomy", "classic"],
    relatedIds: ["b016", "b006", "b007"]
  },
  {
    id: "b016", title: "The Code Book", author: "Simon Singh",
    category: "Science & Tech", brand: "Anchor", price: 13.99,
    originalPrice: 15.99, image: "💻", rating: 4.7, reviews: 2341,
    stock: 25, deliveryDays: 4,
    description: "The science of secrecy from ancient Egypt to quantum cryptography.",
    tags: ["cryptography", "history", "technology"],
    relatedIds: ["b015", "b005", "b006"]
  }
];

const categories = ["Fiction", "Non-Fiction", "Children", "Mystery & Thriller", "Science & Tech"];
const brands = [...new Set(books.map(b => b.brand))];

module.exports = { books, categories, brands };
