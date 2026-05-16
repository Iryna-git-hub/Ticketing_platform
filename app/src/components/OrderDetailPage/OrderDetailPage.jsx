import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../../api";

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

  if (loading) return <p>Loading order...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <section className="content-width panel-card">
      <h1>Order #{order.id}</h1>

      <p>
        <strong>Created date:</strong>{" "}
        {new Date(order.createdAt).toLocaleDateString()}
      </p>

      <h2>Customer details</h2>
      <p>{order.customer.fullName}</p>
      <p>{order.customer.email}</p>
      {order.customer.phoneNumber && <p>{order.customer.phoneNumber}</p>}

      <h2>Payment method</h2>
      <p>{order.paymentMethod}</p>

      <h2>Items</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Subtotal: {item.price * item.quantity} kr.</p>
          </li>
        ))}
      </ul>

      <h2>Total</h2>
      <p>{order.totalPrice} kr.</p>

      <Link to="/orders">Back to orders</Link>
    </section>
  );
}
