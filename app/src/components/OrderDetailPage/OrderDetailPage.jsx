import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../../api";
import "./OrderDetailPage.css";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrderDetail() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(api(`/orders/${id}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Could not load order details.");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetail();
  }, [token, id]);

  if (loading) {
    return (
      <section className="order-detail-page content-width">
        <div className="order-detail-card panel-card">
          <p className="order-detail-message">Loading order...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="order-detail-page content-width">
        <div className="order-detail-card panel-card">
          <p className="order-detail-message" role="alert">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="order-detail-page content-width">
        <div className="order-detail-card panel-card">
          <p className="order-detail-message">Order not found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="order-detail-page content-width">
      <article className="order-detail-card panel-card">
        <header className="order-detail-header">
          <h1>Order #{order.id}</h1>
          <p>
            <span>Created date</span>
            <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
          </p>
        </header>

        <section className="order-detail-section">
          <h2>Customer details</h2>
          <div className="order-detail-info">
            <p>
              <span>Name</span>
              <strong>{order.customer.fullName}</strong>
            </p>
            <p>
              <span>Email</span>
              <strong>{order.customer.email}</strong>
            </p>
            {order.customer.phoneNumber && (
              <p>
                <span>Phone</span>
                <strong>{order.customer.phoneNumber}</strong>
              </p>
            )}
          </div>
        </section>

        <section className="order-detail-section">
          <h2>Payment method</h2>
          <p className="order-detail-payment">{order.paymentMethod}</p>
        </section>

        <section className="order-detail-section">
          <h2>Items</h2>
          <ul className="order-detail-items">
            {order.items.map((item) => (
              <li key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <strong>{item.price * item.quantity} kr.</strong>
              </li>
            ))}
          </ul>
        </section>

        <div className="order-detail-total">
          <span>Total</span>
          <strong>{order.totalPrice} kr.</strong>
        </div>

        <div className="order-detail-actions">
          <Link className="order-detail-back-link" to="/orders">
            Back to orders
          </Link>
        </div>
      </article>
    </section>
  );
}
