// services/shop.api.js
// Covers: wishlist, cart, buy/orders — mirrors your existing request() pattern

import { buildApiUrl, BASE_URL } from "./api.config";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(buildApiUrl(endpoint), {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
export const getWishlist         = ()  => request("/wishlist");
export const addToWishlist       = (id) => request(`/wishlist/${id}`, { method: "POST" });
export const removeFromWishlist  = (id) => request(`/wishlist/${id}`, { method: "DELETE" });
export const checkWishlist       = (id) => request(`/wishlist/${id}/check`);
export const clearWishlist       = ()  => request("/wishlist", { method: "DELETE" });

// ─── CART ─────────────────────────────────────────────────────────────────────
export const getCart             = ()  => request("/cart");
export const addToCart           = (id, quantity = 1) =>
  request(`/cart/${id}`, { method: "POST", body: JSON.stringify({ quantity }) });
export const updateCartQuantity  = (id, quantity) =>
  request(`/cart/${id}/quantity`, { method: "PUT", body: JSON.stringify({ quantity }) });
export const removeFromCart      = (id) => request(`/cart/${id}`, { method: "DELETE" });
export const clearCart           = ()  => request("/cart", { method: "DELETE" });
export const checkCart           = (id) => request(`/cart/${id}/check`);
export const checkoutFromCart = (id, payload) => {
  const body = typeof payload === "string" ? { paymentMethod: payload } : payload;
  return request(`/cart/${id}/checkout`, { method: "POST", body: JSON.stringify(body) });
};
export const checkoutMultiple = (payload) => {
  const body = typeof payload === "string" ? { paymentMethod: payload } : payload;
  return request("/cart/checkout", { method: "POST", body: JSON.stringify(body) });
};

// ─── BUY / ORDERS ────────────────────────────────────────────────────────────
export const buyProduct = (id, payload) => {
  const body = typeof payload === "string" ? { paymentMethod: payload } : payload;
  return request(`/orders/products/${id}/buy`, { method: "POST", body: JSON.stringify(body) });
};
export const applyCoupon = (code, amount) =>
  request(`/orders/apply-coupon`, { method: "POST", body: JSON.stringify({ code, amount }) });
export const trackOrder = (orderId) =>
  request(`/orders/${orderId}/track`);
export const getMyOrders = (filters = {}) => {
  const p = new URLSearchParams(filters).toString();
  return request(`/orders/my${p ? "?" + p : ""}`);
};
export const cancelOrder = (orderId) =>
  request(`/orders/${orderId}/cancel`, { method: "POST" });