import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <section className="checkout-empty content-width panel-card">
        <h1>Your cart is empty</h1>
        <Link to="/events" className="checkout-empty-link">
          Find more events
        </Link>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="content-width panel-card">
        <h1>Login required</h1>
        <p>You must be logged in to checkout.</p>
        <Link to="/login" className="primary-button">
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="content-width panel-card">
      <h1>Checkout</h1>
      <p>Total: {totalPrice === 0 ? "0 kr." : `${totalPrice} kr.`}</p>
      <button type="button">Place order</button>
    </section>
  );
}
