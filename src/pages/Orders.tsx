// src/pages/Orders.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: number;
  product: {
    id: number;
    name: string;
    price_per_unit: number;
    unit: string;
  };
  quantity: number;
  total_price: number;
  ordered_at: string;
}

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => (
            <li
              key={o.id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <h2 className="text-lg font-semibold">{o.product.name}</h2>
              <p>
                Quantity: {o.quantity} {o.product.unit}
              </p>
              <p>
                Price per unit: ₹{o.product.price_per_unit} / {o.product.unit}
              </p>
              <p className="font-medium">Total: ₹{o.total_price}</p>
              <p className="text-sm text-gray-500">
                Ordered on {new Date(o.ordered_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
