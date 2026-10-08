const BASE_URL = process.env.REACT_APP_API_URL || "/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("bookhaven_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const api = {
  // Auth
  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }).then(handleResponse),

  register: (name, email, password) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    }).then(handleResponse),

  // Books
  getBooks: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/books${qs ? "?" + qs : ""}`).then(handleResponse);
  },

  getBook: (id) => fetch(`${BASE_URL}/books/${id}`).then(handleResponse),

  getFeatured: () => fetch(`${BASE_URL}/books/featured`).then(handleResponse),

  getCategories: () => fetch(`${BASE_URL}/books/categories`).then(handleResponse),

  getBrands: () => fetch(`${BASE_URL}/books/brands`).then(handleResponse),

  // User
  getProfile: () =>
    fetch(`${BASE_URL}/users/profile`, {
      headers: { ...getAuthHeader() }
    }).then(handleResponse),

  getRecommendations: () =>
    fetch(`${BASE_URL}/users/recommendations`, {
      headers: { ...getAuthHeader() }
    }).then(handleResponse),

  addAddress: (addressData) =>
    fetch(`${BASE_URL}/users/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(addressData)
    }).then(handleResponse),

  // Orders
  getOrders: () =>
    fetch(`${BASE_URL}/orders`, {
      headers: { ...getAuthHeader() }
    }).then(handleResponse),

  placeOrder: (orderData) =>
    fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(orderData)
    }).then(handleResponse),

  cancelOrder: (orderId) =>
    fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: { ...getAuthHeader() }
    }).then(handleResponse),
};
