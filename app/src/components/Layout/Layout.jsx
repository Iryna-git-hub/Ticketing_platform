import { Link, Outlet } from "react-router-dom";
import GoEventLogo from "../../assets/GoEvent_logo.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { CartIcon } from "../EventIcons/EventIcons.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const { totalQuantity } = useCart();

  return (
    <div className="app-shell">
      <header>
        <nav className="site-nav content-width">
          <div className="site-nav-left">
            <a href="/" className="link">
              <img
                src={GoEventLogo}
                alt="GoEvent logo"
                className="logo"
                width={100}
              />
            </a>
            <Link to="/events" className="nav-link nav-link-primary">
              Events
            </Link>
          </div>

          <div className="site-nav-right">
            {user ? (
              <>
                <span>{user.email}</span>
                <Link to="/cart" className="nav-cart-link" aria-label={`Cart with ${totalQuantity} items`}>
                  <CartIcon />
                  <span className="nav-cart-count">{totalQuantity}</span>
                </Link>
                <button className="nav-action secondary-button" onClick={logout}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-action primary-button">
                  Login
                </Link>
                <Link to="/register" className="nav-action secondary-button">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="site-footer content-width">
        Copyright &copy; 2026 GoEvent
      </footer>
    </div>
  );
}
