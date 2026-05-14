import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } =
    useCart();

  if (items.length === 0) {
    return (
      <section className="cart-card panel-card">
        <h1>Your cart is empty</h1>
        <p>Add tickets from an event page.</p>
        <Link to="/events" className="primary-button">
          Browse events
        </Link>
      </section>
    );
  }

  return (
    <section className="content-width">
      <h1>Cart</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>
              {item.date} at {item.time}
            </p>
            <p>
              {item.venue}, {item.city}
            </p>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, Number(e.target.value))
                }
              />
            </label>
            <p>
              Price:
              {item.price === 0 ? "Free" : `${item.price} kr.`}
            </p>
            <p>
              Subtotal:{" "}
              {item.price === 0 ? "Free" : `${item.price * item.quantity} kr.`}
            </p>
            <button type="button" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h2>Total: {totalPrice === 0 ? "Free" : `${totalPrice} kr.`}</h2>
      <button type="button" onClick={clearCart}>
        Clear cart
      </button>

      <Link to="/checkout" className="primary-button">Checkout</Link>
    </section>
  );
}
