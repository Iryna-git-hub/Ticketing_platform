import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFormValid = fullName.trim() && email.trim() && paymentMethod;

  function handleSubmit(event) {
    event.preventDefault();
    setShowErrors(true);

    if (!isFormValid) {
      return;
    }
  }

  return (
    <section className="checkout-page content-width">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <form className="checkout-panel panel-card" onSubmit={handleSubmit}>
        <div className="checkout-left">
          <div className="checkout-section">
            <h2>Customer details</h2>

            <label className="checkout-field" htmlFor="full-name">
              <span>Full name</span>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                aria-invalid={Boolean(showErrors && !fullName.trim())}
              />
              {showErrors && !fullName.trim() && (
                <p className="checkout-error">Full name is required.</p>
              )}
            </label>

            <label className="checkout-field" htmlFor="email">
              <span>Email address</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(showErrors && !email.trim())}
              />
              <p className="checkout-helper">
                Your e-ticket will be sent to this email address.
              </p>
              {showErrors && !email.trim() && (
                <p className="checkout-error">Email is required.</p>
              )}
            </label>

            <label className="checkout-field" htmlFor="phone-number">
              <span>Phone number</span>
              <input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
            </label>
          </div>

          <div className="checkout-section">
            <h2>Payment method</h2>
            <div className="checkout-payment-options">
              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="payment-method"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                Card
              </label>

              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="payment-method"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                PayPal
              </label>

              {showErrors && !paymentMethod && (
                <p className="checkout-error">Choose a payment method.</p>
              )}
            </div>
          </div>

          <div className="checkout-actions">
            <Link to="/cart" className="checkout-empty-link">
              Edit cart
            </Link>
            <button
              type="submit"
              className="checkout-button primary-button"
              disabled={!isFormValid}
            >
              Pay now
            </button>
          </div>
        </div>

        <aside className="checkout-section checkout-order-summary">
          <h2>Order summary</h2>
          <div className="checkout-summary-table">
            <div className="checkout-summary-row checkout-summary-head">
              <span>Event</span>
              <span>Quantity</span>
              <span>Price</span>
            </div>
            {items.map((item) => (
              <div className="checkout-summary-row" key={item.id}>
                <div>
                  <span>{item.name}</span>
                  <p>{item.date}</p>
                </div>
                <span>{item.quantity}</span>
                <strong>
                  {item.price * item.quantity === 0
                    ? "0 kr."
                    : `${item.price * item.quantity} kr.`}
                </strong>
              </div>
            ))}
          </div>
          <div className="checkout-summary-box">
            <span>Total</span>
            <strong>{totalPrice === 0 ? "0 kr." : `${totalPrice} kr.`}</strong>
          </div>
        </aside>
      </form>
    </section>
  );
}
