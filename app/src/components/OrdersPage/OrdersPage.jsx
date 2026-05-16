import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./OrderPage.css";

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
      <section className="content-width panel-card">
        <h1>Login required</h1>
        <p>You must be logged in to view your orders.</p>
        <Link to="/login">Login</Link>
      </section>
    );
  }

  return (
    <section className="content-width panel-card">
      <h1>Orders</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders yet.</p>}
      {!loading && !error && orders.length > 0 && (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`}>Order #{order.id}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
