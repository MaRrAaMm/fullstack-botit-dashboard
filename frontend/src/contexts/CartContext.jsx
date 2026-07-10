import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "#lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ products: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await api.cart.get();
      setCart(res.data);
    } catch {
      setCart({ products: [] });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.cart.add(productId, quantity);
    setCart(res.data);
    return res;
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await api.cart.update(productId, quantity);
    setCart(res.data);
    return res;
  };

  const removeItem = async (productId) => {
    const res = await api.cart.remove(productId);
    setCart(res.data);
    return res;
  };

  const clearCart = async () => {
    const res = await api.cart.clear();
    setCart(res.data);
    return res;
  };

  const cartCount = cart.products.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartCount,
        cartTotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
