import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { CalendarIcon } from "../EventIcons/EventIcons.jsx";
import "./CartPage.css";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalQuantity } =
    useCart();

  const formatPrice = (price) => `${price} kr.`;

  if (items.length === 0) {
    return (
      <section className="cart-page cart-page-empty content-width">
        <div className="cart-card panel-card">
          <p>Your cart is empty.</p>
          <Link to="/events" className="cart-empty-button event-detail-button secondary-button">
            Find more events
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page content-width">
      <div className="cart-header">
        <h1>
          Event Cart{" "}
          <span>
            ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
          </span>
        </h1>
      </div>

      <div className="cart-table panel-card">
        <div className="cart-columns">
          <span>Event details</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
          <button className="cart-clear-button secondary-button" type="button" onClick={clearCart}>
            Empty cart
          </button>
        </div>

        <ul className="cart-list">
          {items.map((item) => (
            <li className="cart-item" key={item.id}>
              <div className="cart-item-main">
                <h2>{item.name}</h2>
                <p>
                  <CalendarIcon />
                  <span>{item.date}</span>
                </p>
              </div>

              <p className="cart-price" data-label="Price">
                {formatPrice(item.price)}
              </p>

              <div className="cart-quantity event-ticket-quantity-group" data-label="Quantity">
                <div className="cart-quantity-stepper event-ticket-stepper">
                  <button
                    className="event-ticket-stepper-button"
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    aria-label="Decrease ticket quantity"
                  >
                    -
                  </button>
                  <input
                    className="cart-quantity-input event-ticket-input"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Math.max(1, Number(e.target.value)))
                    }
                    aria-label="Ticket quantity"
                  />
                  <button
                    className="event-ticket-stepper-button"
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase ticket quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="cart-total" data-label="Total">
                {formatPrice(item.price * item.quantity)}
              </p>

              <button
                className="cart-remove"
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label="Remove ticket"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <div className="cart-summary">
          <span>Total</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </div>

        <div className="cart-actions">
          <Link to="/events" className="cart-back-link">
            Back to Events
          </Link>
          <Link to="/checkout" className="cart-button primary-button">
            Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}
