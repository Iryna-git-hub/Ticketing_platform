import EventCard from "../EventCard/EventCard.jsx";
import "./EventList.css";

// TODO: replace the mock data import with a fetch call to GET /events

export default function EventList({ events }) {
  if (events.length === 0) {
    return (
      <div className="events-empty-state content-width panel-card">
        <h2>No matching events</h2>
        <p>Try a different search or sort option.</p>
      </div>
    );
  }

  return (
    <ul className="events-list content-width">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </ul>
  );
}
