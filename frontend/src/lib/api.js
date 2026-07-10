const API_BASE = "http://localhost:3000/api";

async function request(endpoint, options = {}) {
  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  auth: {
    login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/auth/me"),
    logout: () => request("/auth/logout", { method: "POST" }),
  },
  products: {
    getAll: () => request("/products"),
    getById: (id) => request(`/products/${id}`),
    create: (body) => request("/products", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
  },
  cart: {
    get: () => request("/cart"),
    add: (productId, quantity = 1) =>
      request("/cart/add", { method: "POST", body: JSON.stringify({ productId, quantity }) }),
    update: (productId, quantity) =>
      request("/cart/update", { method: "PUT", body: JSON.stringify({ productId, quantity }) }),
    remove: (productId) => request(`/cart/remove/${productId}`, { method: "DELETE" }),
    clear: () => request("/cart/clear", { method: "DELETE" }),
  },
  orders: {
    getAll: (params) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ""}`);
    },
    getById: (id) => request(`/orders/${id}`),
    getUserOrders: () => request("/orders/user/me"),
    checkout: (body) => request("/orders/checkout", { method: "POST", body: JSON.stringify(body) }),
    create: (body) => request("/orders", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/orders/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id) => request(`/orders/${id}`, { method: "DELETE" }),
  },
};
