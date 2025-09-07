import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface DashboardData {
  username: string;
  email: string;
  is_farmer: boolean;
  is_buyer: boolean;
  products_count: number;
  orders_count: number;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("Not logged in");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/users/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load dashboard data");

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // Mock buyer orders (replace with API when available)
  const buyerOrders = [
    { date: "2025-09-01", orders: 2 },
    { date: "2025-09-02", orders: 5 },
    { date: "2025-09-03", orders: 1 },
    { date: "2025-09-04", orders: 3 },
    { date: "2025-09-07", orders: 3 },
  ];

  // Data for farmer bar chart
  const farmerData = [
    { name: "Products", count: data?.products_count || 0 },
    { name: "Orders", count: data?.orders_count || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          User Dashboard
        </h1>

        {/* User Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="p-4 bg-green-50 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-700">👤 Username</h2>
            <p className="text-gray-900">{data?.username}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-700">📧 Email</h2>
            <p className="text-gray-900">{data?.email}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-700">🌱 Role</h2>
            <p className="text-gray-900">
              {data?.is_farmer ? "Farmer" : ""}
              {data?.is_buyer ? (data?.is_farmer ? " & Buyer" : "Buyer") : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-100 rounded-lg text-center shadow-md">
              <h3 className="text-lg font-semibold text-green-900">Products</h3>
              <p className="text-2xl font-bold text-green-700">
                {data?.products_count}
              </p>
            </div>

            <div className="p-4 bg-green-100 rounded-lg text-center shadow-md">
              <h3 className="text-lg font-semibold text-green-900">Orders</h3>
              <p className="text-2xl font-bold text-green-700">
                {data?.orders_count}
              </p>
            </div>
          </div>
        </div>

        {/* Farmer Graph */}
        {data?.is_farmer && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              📊 Farmer Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={farmerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Buyer Graph */}
        {data?.is_buyer && (
          <div>
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              📈 Buyer Order History
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={buyerOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
