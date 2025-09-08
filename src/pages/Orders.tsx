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
  buyer?: {
    id: number;
    username: string;
  };
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface UserData {
  username: string;
  email: string;
  is_farmer: boolean;
  is_buyer: boolean;
}

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // fetch user info
        const userRes = await fetch("http://127.0.0.1:8000/api/users/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const user = await userRes.json();
        setUserData(user);

        // fetch orders
        const orderRes = await fetch("http://127.0.0.1:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!orderRes.ok) throw new Error("Failed to fetch orders");
        const data = await orderRes.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Update order status (farmer only)
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update order status");

      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders to display.</p>
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
                Ordered on {new Date(o.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Status:{" "}
                <span className="font-semibold capitalize">{o.status}</span>
              </p>

              {/* Buyer sees their own orders */}
              {userData?.is_buyer && (
                <p className="text-sm text-gray-600">
                  You ordered this item.
                </p>
              )}

              {/* Farmer sees orders for their products */}
              {userData?.is_farmer && o.buyer && (
                <div className="mt-3">
                  <p className="text-sm">
                    Buyer: <span className="font-medium">{o.buyer.username}</span>
                  </p>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                    className="mt-2 border p-2 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
