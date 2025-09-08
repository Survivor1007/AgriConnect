import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react"; // nice icons

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

  // track which sections are open
  const [openSections, setOpenSections] = useState({
    news: true,
    tips: false,
    technology: false,
  });

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

  // Group updates by category
  const groupedUpdates = {
    new: updates.filter((u) => u.category.toLowerCase() === "news"),
    tips: updates.filter((u) => u.category.toLowerCase() === "tips"),
    technology: updates.filter((u) => u.category.toLowerCase() === "technology"),
  };

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSection = (
    key: keyof typeof openSections,
    title: string,
    items: Update[],
    color: string
  ) => (
    <div className="mb-6">
      {/* Header with toggle button */}
      <button
        onClick={() => toggleSection(key)}
        className={`w-full flex justify-between items-center px-4 py-3 rounded-lg shadow-sm border ${color} bg-white hover:shadow-md transition`}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        {openSections[key] ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Collapsible content */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          openSections[key] ? "max-h-[2000px] mt-4" : "max-h-0"
        }`}
      >
        {items.length === 0 ? (
          <p className="text-gray-500 px-2">No {title.toLowerCase()} updates yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((update) => (
              <div
                key={update.id}
                className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 border-l-4 border-green-600"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {update.title}
                </h3>
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
    </div>
  );

return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 py-12 px-6">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-green-900 mb-12 text-center drop-shadow-sm">
        🌾 Latest Farmer Updates
      </h1>

      <div className="space-y-8">
        {renderSection("news", "🆕 New", groupedUpdates.new, "border-blue-600 text-blue-700 bg-blue-50/60")}
        {renderSection("tips", "💡 Tips", groupedUpdates.tips, "border-green-600 text-green-700 bg-green-50/60")}
        {renderSection(
          "technology",
          "⚙️ Technology",
          groupedUpdates.technology,
          "border-purple-600 text-purple-700 bg-purple-50/60"
        )}
      </div>
    </div>
  </div>
);

};

export default Updates;
