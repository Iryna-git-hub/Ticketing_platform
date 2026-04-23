import { useState } from "react";
import { useParams } from "react-router-dom";
import events from "../../data/events.js";
import { CalendarIcon, ClockIcon, MapPinIcon } from "../EventIcons/EventIcons.jsx";
import "./EventDetail.css";

// TODO: fetch the event from GET /events/:id instead of using mock data

export default function EventDetail() {
  const { id } = useParams();
  const event = events.find((item) => String(item.id) === id);
  const [quantity, setQuantity] = useState(1);

  if (!event) {
    return <p className="event-detail-not-found">Event not found.</p>;
  }

  const isSoldOut = event.ticketsAvailable === 0;

  const handleQuantityChange = (e) => {
    const nextValue = Number(e.target.value);

    if (Number.isNaN(nextValue) || nextValue < 1) {
      setQuantity(1);
      return;
    }

    if (nextValue > event.ticketsAvailable) {
      setQuantity(event.ticketsAvailable);
      return;
    }

    setQuantity(nextValue);
  };

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const increaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.min(event.ticketsAvailable, currentQuantity + 1),
    );
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
            <span>{event.venue}, {event.city}</span>
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
