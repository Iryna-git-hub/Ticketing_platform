import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./OrderPage.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isCanceledOrder(order) {
  return ["canceled", "cancelled"].includes(order.status?.toLowerCase());
}

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    async function fetchOrders() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(api("/orders"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Could not load your orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [token, user]);

  if (!user) {
    return (
      <section className="orders-page content-width">
        <div className="orders-empty panel-card">
          <h1>Login required</h1>
          <p>You must be logged in to view your orders.</p>
          <Link className="orders-button primary-button" to="/login">
            Login
          </Link>
        </div>
      </section>
    );
  }

  const visibleOrders = orders
    .filter((order) => !isCanceledOrder(order))
    .toSorted((firstOrder, secondOrder) => {
      return new Date(secondOrder.createdAt) - new Date(firstOrder.createdAt);
    });

  return (
    <section className="orders-page content-width">
      <header className="orders-header">
        <h1>My orders</h1>
      </header>

      {loading && (
        <div className="orders-empty panel-card">
          <p>Loading orders...</p>
        </div>
      )}

      {error && (
        <div className="orders-empty panel-card">
          <p role="alert">{error}</p>
        </div>
      )}

      {!loading && !error && visibleOrders.length === 0 && (
        <div className="orders-empty panel-card">
          <p>You have no orders yet.</p>
          <Link className="orders-button secondary-button" to="/events">
            Find events
          </Link>
        </div>
      )}

      {!loading && !error && visibleOrders.length > 0 && (
        <ul className="orders-list">
          {visibleOrders.map((order) => (
            <li key={order.id}>
              <Link
                className="order-card panel-card"
                to={`/orders/${order.id}`}
              >
                <div className="order-card-header">
                  <div className="order-card-main">
                    <div className="order-title-row">
                      <h2>Order #{order.id}</h2>
                      <span className="order-status">
                        {order.status || "Placed"}
                      </span>
                    </div>
                  </div>
                  <p className="order-card-date">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="order-events">
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        <div>
                          <h3>
                            {item.name}{" "}
                            <span className="order-item-quantity">
                              x {item.quantity}{" "}
                              {item.quantity === 1 ? "ticket" : "tickets"}
                            </span>
                          </h3>
                        </div>
                        <strong>{item.price * item.quantity} kr.</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-card-footer">
                  <p>
                    <span>Total:</span>
                    <strong>{order.totalPrice} kr.</strong>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
