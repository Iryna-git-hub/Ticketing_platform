import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });


useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(items));
}, [items]);

function addItem(event, quantity) {
  setItems((currentItems) => {
    const existingItem = currentItems.find((item) => item.id === event.id);

    if (existingItem) {
      return currentItems.map((item) =>
        item.id === event.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    }

    return [
      ...currentItems,
      {
        id: event.id,
        name: event.name,
        date: event.date,
        time: event.time,
        venue: event.venue,
        city: event.city,
        price: event.price,
        quantity,
      },
    ];
  });
}

function updateQuantity(id, quantity) {
  if (quantity < 1) {
    removeItem(id);
    return;
  }

  setItems((currentItems) =>
    currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
  );
}

function removeItem(id) {
  setItems((currentItems) => currentItems.filter((item) => item.id !== id));
}

function clearCart() {
  setItems([]);
}

const totalPrice = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}, [items]);

const totalQuantity = useMemo(() => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}, [items]);

return (
  <CartContext.Provider
    value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalQuantity,
      totalPrice,
    }}
  >
    {children}
  </CartContext.Provider>
);
}

export function useCart() {
  return useContext(CartContext);
}
