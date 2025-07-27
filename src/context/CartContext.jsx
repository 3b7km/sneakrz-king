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
    try {
      localStorage.setItem("sneakrz-cart", JSON.stringify([]));
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }
  };

  // Get total quantity of items in cart
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // AF1 products that qualify for the offer (Valentine's Day editions and Double Swoosh only)
  const AF1_OFFER_IDS = [28, 29, 30]; // Valentine 23/24, Double Swoosh
  const AF1_OFFER_PRICE = 1500; // Fixed offer price for AF1 products in cart

  // Check if item is AF1 and qualifies for offer
  const isAF1Product = (productId) => {
    return AF1_OFFER_IDS.includes(productId);
  };

  // Get discounted price for AF1 products in cart
  const getDiscountedPrice = (item) => {
    if (isAF1Product(item.id) && getTotalQuantity() >= 2) {
      return AF1_OFFER_PRICE; // Fixed price of 1500 EGP for AF1 items in cart (minimum 2 pairs required)
    }
    return item.price;
  };

  // Get total price of items in cart with AF1 discounts applied
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + getDiscountedPrice(item) * item.quantity,
      0,
    );
  };

  // Get original total price without discounts
  const getOriginalTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  // Get total AF1 discount amount
  const getAF1Discount = () => {
    if (getTotalQuantity() < 2) {
      return 0; // No discount if less than 2 pairs in cart
    }
    return cartItems.reduce((total, item) => {
      if (isAF1Product(item.id)) {
        const discount = item.price - getDiscountedPrice(item);
        return total + discount * item.quantity;
      }
      return total;
    }, 0);
  };

  // Check if customer qualifies for free shipping
  const isFreeShipping = () => {
    // Free shipping if AF1 offer is active (AF1 products in cart AND minimum 2 pairs total)
    const hasAF1Products = cartItems.some((item) => isAF1Product(item.id));
    if (hasAF1Products && getTotalQuantity() >= 2) {
      return true;
    }

    // Free shipping for orders over 3000 EGP (women's collection offer)
    const total = getTotalPrice();
    if (total >= 3000) {
      return true;
    }

    return false;
  };

  // Get shipping cost (0 if free shipping applies)
  const getShippingCost = () => {
    return isFreeShipping() ? 0 : 80;
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
    getOriginalTotalPrice,
    getAF1Discount,
    getDiscountedPrice,
    isAF1Product,
    isFreeShipping,
    getShippingCost,
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
