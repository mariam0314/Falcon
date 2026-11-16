import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCart, addToCart as apiAddToCart, updateCartQuantity as apiUpdateQty, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from "../services/shop.api";
import { useAuthContext } from "./auth.context";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuthContext();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!localStorage.getItem("accessToken")) {
      setItems([]);
      setTotal(0);
      return;
    }
    try {
      setLoading(true);
      const res = await getCart();
      const cartData = res.data ?? [];
      setItems(cartData);
      setTotal(res.total ?? 0);
    } catch (err) {
      // In case of 401 or network issue, don't break UI
      console.warn("Failed to load cart:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
      setTotal(0);
    }
  }, [isAuthenticated, refreshCart]);

  const addItem = async (productId, quantity = 1) => {
    const res = await apiAddToCart(productId, quantity);
    await refreshCart();
    return res;
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeItem(productId);
    }
    // Optimistic update
    setItems((prev) =>
      prev.map((item) =>
        item.product?._id === productId ? { ...item, quantity } : item
      )
    );
    try {
      await apiUpdateQty(productId, quantity);
      await refreshCart();
    } catch (err) {
      await refreshCart();
      throw err;
    }
  };

  const removeItem = async (productId) => {
    setItems((prev) => prev.filter((item) => item.product?._id !== productId));
    try {
      await apiRemoveFromCart(productId);
      await refreshCart();
    } catch (err) {
      await refreshCart();
      throw err;
    }
  };

  const clear = async () => {
    setItems([]);
    setTotal(0);
    try {
      await apiClearCart();
    } catch (_) {}
  };

  const isInCart = useCallback(
    (productId) => {
      return items.some((item) => item.product?._id === productId);
    },
    [items]
  );

  const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        loading,
        refreshCart,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
