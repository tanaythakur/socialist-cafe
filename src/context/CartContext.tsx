import React, { createContext, useContext, useState, useCallback } from "react";
import { MenuItem } from "@/data/mockData";

export type CartItem = {
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  specialInstructions: string;
};

type CartContextType = {
  items: CartItem[];
  tableNumber: number | null;
  setTableNumber: (n: number) => void;
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateInstructions: (menuItemId: string, instructions: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          specialInstructions: "",
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const updateInstructions = useCallback((menuItemId: string, instructions: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.menuItemId === menuItemId ? { ...i, specialInstructions: instructions } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        tableNumber,
        setTableNumber,
        addItem,
        removeItem,
        updateQuantity,
        updateInstructions,
        clearCart,
        total,
        itemCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
