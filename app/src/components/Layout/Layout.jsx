import { Link, Outlet } from "react-router-dom";
import GoEventLogo from "../../assets/GoEvent_logo.png";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header>
        <nav
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <a
              href="/"
              className="link"
            >
              <img
                src={GoEventLogo}
                alt="GoEvent logo"
                className="logo"
                width={130}
                style={{ padding: "20px" }}
              />
            </a>
          {/* Navigation links go here — e.g. link to event list, cart, login */}
            <Link to="/events" className="link">
              Events
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {user && (
              <>
                <span>{user.email}</span>
                <button onClick={logout}>Sign out</button>
              </>
            )}

            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>©GoEvent</footer>
    </div>
  );
}
