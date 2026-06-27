/* c:/Users/USER/Desktop/BagsAndBeyond/client/src/contexts/CartContext.jsx */
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Load from localStorage on initial render
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      // Use slug as the unique key (fallback to id for backward compat)
      const key = product.slug || product.id;
      const existing = prev.find(
        (item) => (item.slug || item.id) === key && item.color === product.color && item.size === product.size
      );
      if (existing) {
        return prev.map((item) =>
          (item.slug || item.id) === key && item.color === product.color && item.size === product.size
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (slug) => {
    setCartItems((prev) => prev.filter((item) => (item.slug || item.id) !== slug));
  };

  const updateQuantity = (slug, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        (item.slug || item.id) === slug ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
