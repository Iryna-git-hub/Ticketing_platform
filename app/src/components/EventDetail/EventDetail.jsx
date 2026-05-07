import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api.js";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "../EventIcons/EventIcons.jsx";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(api(`/events/&{id}`));

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

  return (
    <section className="event-detail-page content-width">
      <article className="event-detail-card panel-card">
        <span className="category-badge">{event.category}</span>

        <h1>{event.name}</h1>

        <div className="event-detail-divider ticket-divider" />

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

        <p className="event-detail-description">{event.description}</p>

        <p className="event-detail-price">
          <span className={isSoldOut ? "event-detail-price-sold-out" : ""}>
            {event.price === 0 ? "Free" : `${event.price} DKK`}
          </span>
        </p>

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

        {!isSoldOut && (
          <div className="event-ticket-controls">
            <label className="event-ticket-quantity" htmlFor="ticket-quantity">
              Quantity
            </label>

            <div className="event-ticket-stepper">
              <button
                type="button"
                className="event-ticket-stepper-button"
                onClick={decreaseQuantity}
                disabled={quantity === 1}
                aria-label="Decrease ticket quantity"
              >
                -
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

            <p className="event-ticket-total">
              Total: {event.price === 0 ? "Free" : `${totalPrice} DKK`}
            </p>
          </div>
        )}

        <div className="event-detail-footer">
          <button
            className="event-detail-button primary-button"
            disabled={isSoldOut}
          >
            Buy ticket
          </button>
        </div>
      </article>
    </section>
  );
}
