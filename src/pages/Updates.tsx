import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Update {
  id: number;
  title: string;
  content: string;
  category: string;
  published_at: string;
}

const Updates = () => {
  const navigate = useNavigate();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth & fetch updates
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    const fetchUpdates = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/updates/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch updates");
        }

        const data = await res.json();
        setUpdates(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading updates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
        Latest Farmer Updates 🌾
      </h1>

      {updates.length === 0 ? (
        <p className="text-center text-gray-600">No updates available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map((update) => (
            <div
              key={update.id}
              className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-600 hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {update.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(update.published_at).toLocaleDateString()} •{" "}
                <span className="font-medium text-green-700">
                  {update.category}
                </span>
              </p>
              <p className="text-gray-700">{update.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Updates;
