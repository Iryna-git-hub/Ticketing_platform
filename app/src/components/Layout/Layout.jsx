import { Link, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import GoEventLogo from "../../assets/GoEvent_logo.png";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { CartIcon, UserIcon } from "../EventIcons/EventIcons.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const { totalQuantity } = useCart();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const username =
    user?.username || user?.name || user?.email?.split("@")[0] || "there";

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleLogout() {
    setProfileMenuOpen(false);
    logout();
  }

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
                <Link to="/cart" className="nav-cart-link" aria-label={`Cart with ${totalQuantity} items`}>
                  <CartIcon />
                  <span className="nav-cart-count">{totalQuantity}</span>
                </Link>
                <div className="nav-profile" ref={profileMenuRef}>
                  <button
                    className="nav-profile-button"
                    type="button"
                    aria-label="Open profile menu"
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu"
                    onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
                  >
                    <UserIcon />
                  </button>

                  {profileMenuOpen && (
                    <div className="profile-menu panel-card" role="menu">
                      <div className="profile-menu-header">
                        <span className="profile-avatar">
                          <UserIcon />
                        </span>
                        <div>
                          <p>Hi, {username}</p>
                          <span>{user.email}</span>
                        </div>
                      </div>

                      <Link
                        to="/orders"
                        className="profile-menu-item"
                        role="menuitem"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        My orders
                      </Link>
                      <button
                        className="profile-menu-item"
                        type="button"
                        role="menuitem"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Settings
                      </button>
                      <button
                        className="profile-menu-item"
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
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
