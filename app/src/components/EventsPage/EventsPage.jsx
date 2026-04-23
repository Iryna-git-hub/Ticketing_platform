import { useMemo, useState } from "react";
import EventList from "../EventList/EventList.jsx";
import events from "../../data/events.js";
import "./EventsPage.css";

export default function EventsPage() {
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");

  const visibleEvents = useMemo(() => {
    const normalizedQuery = filterQuery.trim().toLowerCase();

    const filteredEvents = events.filter((event) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        event.name.toLowerCase().includes(normalizedQuery) ||
        event.category.toLowerCase().includes(normalizedQuery) ||
        event.city.toLowerCase().includes(normalizedQuery)
      );
    });

    const sortedEvents = [...filteredEvents].sort((firstEvent, secondEvent) => {
      switch (sortBy) {
        case "price-asc":
          return firstEvent.price - secondEvent.price;
        case "price-desc":
          return secondEvent.price - firstEvent.price;
        case "available":
          return secondEvent.ticketsAvailable - firstEvent.ticketsAvailable;
        case "date-asc":
        default:
          return new Date(firstEvent.date) - new Date(secondEvent.date);
      }
    });

    return sortedEvents;
  }, [filterQuery, sortBy]);

  return (
    <section className="events-page">
      <div className="events-toolbar content-width panel-card">
        <div className="events-toolbar-copy">
          <h1>Find your next event</h1>
          <p>Search events and sort by date, price, or ticket availability.</p>
        </div>

        <div className="events-toolbar-controls">
          <label className="events-toolbar-field">
            <span>Search</span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by event, category, or city"
            />
          </label>

          <label className="events-toolbar-field">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-asc">Earliest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="available">Most available</option>
            </select>
          </label>
        </div>
      </div>

      <EventList events={visibleEvents} />
    </section>
  );
}
