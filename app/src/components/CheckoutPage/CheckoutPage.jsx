import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalPrice } = useCart();

  if (!user) {
    return (
      <section className="checkout-empty content-width panel-card">
        <h1>Login required</h1>
        <p>You must be logged in to checkout.</p>
        <Link to="/login" className="checkout-button primary-button">
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-page content-width">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-panel panel-card">
        <div className="checkout-summary-box">
          <span>Total</span>
          <strong>{totalPrice === 0 ? "0 kr." : `${totalPrice} kr.`}</strong>
        </div>

        <div className="checkout-actions">
          <Link to="/cart" className="checkout-empty-link">
            Edit cart
          </Link>
          <button type="button" className="checkout-button primary-button">
            Place order
          </button>
        </div>
      </div>
    </section>
  );
}
