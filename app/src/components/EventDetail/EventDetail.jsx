import events from "../../data/events.js";
import { useParams } from "react-router-dom";

// TODO: fetch the event from GET /events/:id instead of using mock data

export default function EventDetail() {
  const { id } = useParams();
  const event = events.find((item) => String(item.id) === id);

    if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div>
      <h2>{event.name}</h2>
      <p>
        {event.date} at {event.time}
      </p>
      <p>
        {event.venue}, {event.city}
      </p>
      <p>{event.category}</p>
      <p>{event.description}</p>
      <p>{event.price === 0 ? "Free" : `€${event.price}`}</p>
      <p>
        {event.ticketsAvailable === 0
          ? "Sold out"
          : `${event.ticketsAvailable} tickets left`}
      </p>
      <button disabled={event.ticketsAvailable === 0}>Buy Ticket</button>
    </div>
  );
}
