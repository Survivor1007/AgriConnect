import { useEffect, useState } from "react";

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
        console.log(result);
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          User Dashboard
        </h1>

        <div className="space-y-4">
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
              <p className="text-2xl font-bold text-green-700">{data?.products_count}</p>
            </div>

            <div className="p-4 bg-green-100 rounded-lg text-center shadow-md">
              <h3 className="text-lg font-semibold text-green-900">Orders</h3>
              <p className="text-2xl font-bold text-green-700">{data?.orders_count}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
