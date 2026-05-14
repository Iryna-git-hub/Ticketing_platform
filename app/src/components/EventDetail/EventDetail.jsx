import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../../api.js";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "../EventIcons/EventIcons.jsx";
import "./EventDetail.css";
import { useCart } from "../../context/CartContext.jsx";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addItem } = useCart();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(api(`/events/${id}`));

        if (response.status === 404) {
          throw new Error("Event not found.");
        }

        if (!response) {
          throw new Error("Could not load event details.");
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (!isCartModalOpen) {
      return;
    }

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
      modalRef.current?.querySelectorAll(focusableSelector) || [],
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsCartModalOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartModalOpen]);

  if (loading) {
    return <p className="event-detail-not-found">Loading event...</p>;
  }

  if (error) {
    return (
      <p className="event-detail-not-found" role="alert">
        {error}
      </p>
    );
  }

  if (!event) {
    return <p className="event-detail-not-found">Event not found.</p>;
  }

  const isSoldOut = event.ticketsAvailable === 0;

  const renderPrice = (price) => {
    return (
      <>
        <span className="event-money-whole">{price}</span>
        <span className="event-money-currency"> kr.</span>
      </>
    );
  };

  const renderEventPrice = (price) => {
    if (Number(price) === 0) {
      return <span className="event-money-whole">Free</span>;
    }

    return renderPrice(price);
  };

  const getSafeQuantity = (value) => {
    if (Number.isNaN(value) || value < 1) {
      return 1;
    }

    if (value > event.ticketsAvailable) {
      return event.ticketsAvailable;
    }

    return value;
  };

  const handleQuantityChange = (e) => {
    const nextValue = Number(e.target.value);
    setQuantity(getSafeQuantity(nextValue));
  };
  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => getSafeQuantity(currentQuantity - 1));
  };

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => getSafeQuantity(currentQuantity + 1));
  };

  const totalPrice = event.price * quantity;

  function handlerAddToCart() {
    addItem(event, quantity);
    setIsCartModalOpen(true);
  }

  return (
    <section className="event-detail-page content-width">
      <article className="event-detail-card panel-card">
        <span className="category-badge">{event.category}</span>

        <h1>{event.name}</h1>

        <div className="event-detail-divider ticket-divider" />

        <div className="event-detail-meta-grid">
          <div className="event-detail-info">
            <p>
              <CalendarIcon />
              <span>{event.date}</span>
            </p>
            <p>
              <ClockIcon />
              <span>{event.time}</span>
            </p>
            <p>
              <MapPinIcon />
              <span>
                {event.venue}, {event.city}
              </span>
            </p>
          </div>

          <aside
            className="event-detail-status"
            aria-label="Ticket pricing and availability"
          >
            <p className="event-detail-price">
              <span className={isSoldOut ? "event-detail-price-sold-out" : ""}>
                {renderEventPrice(event.price)}
              </span>
            </p>

            {!isSoldOut && (
              <div className="event-ticket-quantity-group">
                <div className="event-ticket-stepper">
                  <button
                    type="button"
                    className="event-ticket-stepper-button"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                    aria-label="Decrease ticket quantity"
                  >
                    −
                  </button>

                  <input
                    id="ticket-quantity"
                    className="event-ticket-input"
                    type="number"
                    min="1"
                    max={event.ticketsAvailable}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />

                  <button
                    type="button"
                    className="event-ticket-stepper-button"
                    onClick={increaseQuantity}
                    disabled={quantity === event.ticketsAvailable}
                    aria-label="Increase ticket quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <p
              className={`event-detail-availability availability ${
                isSoldOut ? "availability-sold-out" : ""
              }`}
            >
              {isSoldOut
                ? "Sold out"
                : event.ticketsAvailable === 1
                  ? "1 ticket left"
                  : `${event.ticketsAvailable} tickets left`}
            </p>
          </aside>
        </div>

        <h2>Overview</h2>

        <p className="event-detail-description">{event.description}</p>

        <div className="event-detail-divider ticket-divider" />

        {!isSoldOut && (
          <div className="event-ticket-controls">
            <p className="event-ticket-total">
              <span className="event-ticket-total-label">Total</span>
              <span className="event-ticket-total-value">
                {renderPrice(totalPrice)}
              </span>
            </p>

            <div className="event-ticket-purchase-row">
              <button
                type="button"
                className="event-detail-button primary-button"
                onClick={handlerAddToCart}
              >
                Add to cart
              </button>
            </div>
          </div>
        )}

        {isSoldOut && (
          <div className="event-detail-footer">
            <button
              type="button"
              className="event-detail-button primary-button"
              disabled
            >
              Buy ticket
            </button>
          </div>
        )}
      </article>
      <div className="event-detail-back">
        <Link to="/events" className="event-detail-back-link">
          Back to events
        </Link>
      </div>

      {isCartModalOpen && (
        <div
          className="ticket-modal-backdrop"
          onMouseDown={(modalEvent) => {
            if (modalEvent.target === modalEvent.currentTarget) {
              setIsCartModalOpen(false);
            }
          }}
        >
          <div
            className="ticket-modal panel-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-modal-title"
            ref={modalRef}
          >
            <button
              type="button"
              className="ticket-modal-close"
              onClick={() => setIsCartModalOpen(false)}
              aria-label="Close ticket confirmation"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>

            <div className="ticket-modal-copy">
              <h2 id="ticket-modal-title">Ticket added to cart</h2>
              <p>Your ticket selection is saved in your cart.</p>
            </div>

            <div className="ticket-modal-actions">
              <button
                type="button"
                className="event-detail-button secondary-button"
                onClick={() => setIsCartModalOpen(false)}
              >
                Find more events
              </button>
              <button
                type="button"
                className="event-detail-button primary-button"
                onClick={() => navigate("/cart")}
              >
                View cart
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
