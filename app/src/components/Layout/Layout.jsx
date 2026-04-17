import { Link, Outlet } from "react-router-dom";
import GoEventLogo from "../../assets/GoEvent_logo.png";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header>
        <nav className="site-nav">
          <div className="site-nav-left">
            <a href="/" className="link">
              <img
                src={GoEventLogo}
                alt="GoEvent logo"
                className="logo"
                width={130}
              />
            </a>
            <Link to="/events" className="nav-link nav-link-primary">
              Events
            </Link>
          </div>

          <div className="site-nav-right">
            {user && (
              <>
                <span>{user.email}</span>
                <button onClick={logout}>Sign out</button>
              </>
            )}

            <Link to="/login" className="nav-link nav-link-light">Login</Link>
            <Link to="/register" className="nav-link nav-link-light">Register</Link>
          </div>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        &copy;GoEvent
      </footer>
    </div>
  );
}
