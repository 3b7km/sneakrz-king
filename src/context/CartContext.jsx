import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem("sneakrz-cart");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("sneakrz-cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // Add item to cart or update quantity if it exists
  const addToCart = (product, quantity = 1, selectedSize = null) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize,
      );

      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        // Add new item to cart
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          selectedSize: selectedSize,
          quantity: quantity,
          addedAt: new Date().toISOString(),
        };
        return [...prevItems, cartItem];
      }
    });
  };

  // Update quantity of specific item
  const updateQuantity = (productId, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId, selectedSize);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  // Remove item from cart
  const removeItem = (productId, selectedSize) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.id === productId && item.selectedSize === selectedSize),
      ),
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total quantity of items in cart
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price of items in cart
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  // Check if product is in cart
  const isInCart = (productId, selectedSize = null) => {
    return cartItems.some(
      (item) => item.id === productId && item.selectedSize === selectedSize,
    );
  };

  // Get quantity of specific item in cart
  const getItemQuantity = (productId, selectedSize = null) => {
    const item = cartItems.find(
      (item) => item.id === productId && item.selectedSize === selectedSize,
    );
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalQuantity,
    getTotalPrice,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
