import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface WishlistItem {
  id: string; // Product ID
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  const loadWishlistForUser = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const wishlistKey = `wishlistItems_${userId}`; // యూజర్-స్పెసిఫిక్ కీ
      const localData = localStorage.getItem(wishlistKey);
      setItems(localData ? JSON.parse(localData) : []);
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    loadWishlistForUser();
    window.addEventListener("tokenChange", loadWishlistForUser);
    return () => window.removeEventListener("tokenChange", loadWishlistForUser);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const wishlistKey = `wishlistItems_${userId}`;
      localStorage.setItem(wishlistKey, JSON.stringify(items));
    }
  }, [items]);

  const addToWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
    toast({
      title: "Added to Wishlist",
      description: `${item.name} has been added.`,
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
    toast({ title: "Removed from Wishlist" });
  };

  const isInWishlist = (productId: string) => {
    return items.some((i) => i.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
