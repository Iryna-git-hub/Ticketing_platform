import { Link } from "react-router-dom";
import { useEffect } from "react";
import heroVideo from "../../assets/home-hero-video.mp4";
import { prefetchEvents } from "../../eventRequests.js";
import "./HomePage.css";

function HomePage() {
  useEffect(() => {
    prefetchEvents("/events?_page=1&_limit=8&_sort=date&_order=asc");
  }, []);

  return (
    <section className="home-page">
      <div className="home-hero">
        <video
          className="home-hero-video"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="home-hero-overlay">
          <div className="home-hero-content content-width">
            <h1>Find your next tech event in Copenhagen</h1>
            <p>
              Discover workshops, meetups, conferences, and hands-on sessions
              for frontend developers, product teams, and curious builders.
            </p>
            <Link className="home-cta" to="/events">
              Browse events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
