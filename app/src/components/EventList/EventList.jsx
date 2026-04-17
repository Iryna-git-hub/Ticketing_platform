import EventCard from "../EventCard/EventCard.jsx";
import events from "../../data/events.js";
import "./EventList.css";


// TODO: replace the mock data import with a fetch call to GET /events



export default function EventList() {
  return (
    <ul className="events-list">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </ul>
  );
}
