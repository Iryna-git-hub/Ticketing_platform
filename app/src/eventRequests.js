import api from "./api.js";

const eventsCache = new Map();
const eventDetailsCache = new Map();

export async function getEvents(route) {
  if (eventsCache.has(route)) {
    return eventsCache.get(route);
  }

  const response = await fetch(api(route));

  if (!response.ok) {
    throw new Error("Could not load events. Please try again.");
  }

  const result = {
    events: await response.json(),
    totalCount: Number(response.headers.get("X-Total-Count")) || 0,
  };

  eventsCache.set(route, result);
  return result;
}

export function prefetchEvents(route) {
  getEvents(route).catch(() => {});
}

export async function getEventDetail(id) {
  if (eventDetailsCache.has(id)) {
    return eventDetailsCache.get(id);
  }

  const response = await fetch(api(`/events/${id}`));

  if (response.status === 404) {
    throw new Error("Event not found.");
  }

  if (!response.ok) {
    throw new Error("Could not load event details.");
  }

  const event = await response.json();
  eventDetailsCache.set(id, event);
  return event;
}

export function prefetchEventDetail(id) {
  getEventDetail(id).catch(() => {});
}
