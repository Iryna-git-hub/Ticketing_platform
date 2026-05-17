import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { prefetchEventDetail } from "../../eventRequests.js";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "../EventIcons/EventIcons.jsx";
import TicketAddedModal from "../TicketAddedModal/TicketAddedModal.jsx";

export default function EventCard({ event }) {
  const { addItem } = useCart();
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const getWholePrice = (price) => String(Math.trunc(Number(price)));

  const renderPrice = (price) => {
    const whole = getWholePrice(price);

    return (
      <>
        <span className="event-money-whole">{whole}</span>
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

  function handleAddToCart() {
    addItem(event, 1);
    setIsCartModalOpen(true);
  }

  function handlePrefetch() {
    prefetchEventDetail(event.id);
  }

  return (
    <li className="event-card panel-card">
      <div className="event-card-top">
        <span className="category-badge">{event.category}</span>
      </div>

      <h2 className="event-title">{event.name}</h2>
      <div className="ticket-divider" aria-hidden="true" />

      <div className="event-details">
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

      <div className="event-card-bottom">
        <div className="ticket-divider" aria-hidden="true" />
        <p className="event-price-row">
          <span
            className={event.ticketsAvailable === 0 && "event-price-sold-out"}
          >
            {renderEventPrice(event.price)}
          </span>
        </p>

        <p
          className={`event-availability availability ${
            event.ticketsAvailable === 0 ? "availability-sold-out" : ""
          }`}
        >
          {event.ticketsAvailable === 0
            ? "Sold out"
            : event.ticketsAvailable === 1
              ? "1 ticket left"
              : `${event.ticketsAvailable} tickets left`}
        </p>

        <div className="event-card-actions">
          {event.ticketsAvailable === 0 ? (
            <button className="event-card-link primary-button" disabled>
              Add to cart
            </button>
          ) : (
            <button
              type="button"
              className="event-card-link primary-button"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          )}
          <Link
            className="event-card-link secondary-button"
            to={`/events/${event.id}`}
            onMouseEnter={handlePrefetch}
            onFocus={handlePrefetch}
          >
            View details
          </Link>
        </div>
      </div>

      <TicketAddedModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />
    </li>
  );
}
