import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

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

    fetchOrderDetail();
  }, [token, user]);

  return (
    <section className="content-width panel-card">
      <h1>Order #{id}</h1>
      <p>Order details are not available yet.</p>
      <Link to="/orders">Back to orders</Link>
    </section>
  );
}
