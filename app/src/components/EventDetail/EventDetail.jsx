import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api.js";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "../EventIcons/EventIcons.jsx";
import "./EventDetail.css";
import { useCart } from "../../context/CartContext.jsx";
import TicketAddedModal from "../TicketAddedModal/TicketAddedModal.jsx";

export default function EventDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addItem } = useCart();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(api(`/events/${id}`));

        if (response.status === 404) {
          throw new Error("Event not found.");
        }

        if (!response.ok) {
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

      <TicketAddedModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </section>
  );
}
