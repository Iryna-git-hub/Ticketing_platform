import { useEffect, useState } from "react";
import EventList from "../EventList/EventList.jsx";
import api from "../../api.js";
import "./EventsPage.css";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 6;

  const totalPages = Math.ceil(totalCount / limit) || 1;

  useEffect(() => {
    async function fetchEvents() {
      const params = new URLSearchParams({
        _page: String(page),
        _limit: String(limit),
      });

      setLoading(true);
      setError("");

      if (filterQuery.trim()) {
        params.set("q", filterQuery.trim());
      }

      if (sortBy === "date-asc") {
        params.set("_sort", "date");
        params.set("_order", "asc");
      }

      if (sortBy === "price-asc") {
        params.set("_sort", "price");
        params.set("_order", "asc");
      }

      if (sortBy === "price-desc") {
        params.set("_sort", "price");
        params.set("_order", "desc");
      }

      if (sortBy === "available") {
        params.set("_sort", "ticketsAvailable");
        params.set("_order", "desc");
      }

      try {
        const response = await fetch(api(`/events?${params.toString()}`));

        if (!response.ok) {
          throw new Error("Could not load events. Please try again.");
        }

        const data = await response.json();
        setTotalCount(Number(response.headers.get("X-Total-Count")) || 0);

        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [filterQuery, page, sortBy]);

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
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by event, category, or city"
            />
          </label>

          <label className="events-toolbar-field">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <option value="date-asc">Earliest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="available">Most available</option>
            </select>
          </label>
        </div>
      </div>

      {loading && <p className="content-width">Loading events...</p>}
      {error && (
        <p className="content-width" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && <EventList events={events} />}
      {!loading && !error && (
        <div className="content-width">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            &lsaquo;
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            &rsaquo;
          </button>
        </div>
      )}
    </section>
  );
}
