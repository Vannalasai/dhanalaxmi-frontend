import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  weight: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (itemData: Omit<CartItem, "quantity">) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // యూజర్ మారినప్పుడు కార్ట్‌ను లోడ్/రీలోడ్ చేయడానికి ఈ ఫంక్షన్
  const loadCartForUser = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const cartKey = `cartItems_${userId}`; // యూజర్-స్పెసిఫిక్ కీ
      const localData = localStorage.getItem(cartKey);
      setItems(localData ? JSON.parse(localData) : []);
    } else {
      setItems([]); // యూజర్ లాగిన్ అవ్వకపోతే కార్ట్ ఖాళీగా ఉంటుంది
    }
  };

  // కాంపోనెంట్ మౌంట్ అయినప్పుడు మరియు యూజర్ లాగిన్/లాగ్ అవుట్ అయినప్పుడు కార్ట్‌ను లోడ్ చేయండి
  useEffect(() => {
    loadCartForUser();
    window.addEventListener("tokenChange", loadCartForUser);
    return () => window.removeEventListener("tokenChange", loadCartForUser);
  }, []);

  // కార్ట్ ఐటెమ్స్ మారినప్పుడు localStorage ను అప్‌డేట్ చేయండి
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const cartKey = `cartItems_${userId}`;
      localStorage.setItem(cartKey, JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (itemData: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.variantId === itemData.variantId
      );
      if (existingItem) {
        return prevItems.map((i) =>
          i.variantId === itemData.variantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prevItems, { ...itemData, quantity: 1 }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
    } else {
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.variantId === variantId ? { ...i, quantity: newQuantity } : i
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
