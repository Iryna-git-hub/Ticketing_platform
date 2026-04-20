import { useParams } from "react-router-dom";
import events from "../../data/events.js";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
} from "../EventIcons/EventIcons.jsx";
import "./EventDetail.css";

// TODO: fetch the event from GET /events/:id instead of using mock data

export default function EventDetail() {
  const { id } = useParams();
  const event = events.find((item) => String(item.id) === id);

  if (!event) {
    return <p className="event-detail-not-found">Event not found.</p>;
  }

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
          <p className="event-detail-price">
            <TicketIcon />
            <span>{event.price === 0 ? "Free" : `${event.price} DKK`}</span>
          </p>
        </div>

        <p className="event-detail-description">{event.description}</p>

        <div className="event-detail-footer">
          <p
            className={`event-detail-availability availability ${
              event.ticketsAvailable === 0 ? "availability-sold-out" : ""
            }`}
          >
            {event.ticketsAvailable === 0
              ? "Sold out"
            : event.ticketsAvailable === 1
              ? "1 ticket left"
              : `${event.ticketsAvailable} tickets left`}
          </p>

          <button
            className="event-detail-button primary-button"
            disabled={event.ticketsAvailable === 0}
          >
            Buy ticket
          </button>
        </div>
      </article>
    </section>
  );
}
