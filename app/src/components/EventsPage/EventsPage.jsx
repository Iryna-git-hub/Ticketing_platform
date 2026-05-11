import { useEffect, useState } from "react";
import EventList from "../EventList/EventList.jsx";
import { SearchIcon } from "../EventIcons/EventIcons.jsx";
import api from "../../api.js";
import "./EventsPage.css";

const sortOptions = [
  { value: "date-asc", label: "Earliest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "available", label: "Most available" },
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 8;

  const totalPages = Math.ceil(totalCount / limit) || 1;
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ||
    "Earliest first";

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSortBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsSortOpen(false);
    }
  }

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
      <div className="content-width">
        <h1>Find your next event</h1>
      </div>

      <div className="events-toolbar content-width panel-card">
        <div className="events-toolbar-controls">
          <label className="events-toolbar-field">
            <span>Search</span>
            <div className="events-toolbar-search">
              <SearchIcon />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => {
                  setFilterQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by event, category, or city"
              />
            </div>
          </label>

          <div className="events-toolbar-field">
            <span id="sort-by-label">Sort by</span>
            <div className="events-toolbar-sort" onBlur={handleSortBlur}>
              <button
                type="button"
                className="events-sort-trigger"
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                aria-labelledby="sort-by-label"
                onClick={() => setIsSortOpen((isOpen) => !isOpen)}
              >
                <span>{selectedSortLabel}</span>
                <span
                  className={`events-sort-chevron ${isSortOpen ? "is-open" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {isSortOpen && (
                <ul
                  className="events-sort-menu"
                  role="listbox"
                  aria-labelledby="sort-by-label"
                >
                  {sortOptions.map((option) => (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={sortBy === option.value}
                    >
                      <button
                        type="button"
                        className={`events-sort-option ${sortBy === option.value ? "is-active" : ""}`}
                        onClick={() => {
                          setSortBy(option.value);
                          setPage(1);
                          setIsSortOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
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
        <div className="content-width pagination">
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
