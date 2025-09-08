import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface WeatherReport {
  location: string;
  report_data: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  conditions: string;
}

const Weather = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle fetch weather
  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setWeather(null);
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/weatherreports/fetch/", {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ location }),
      });

      if (!res.ok) throw new Error("Failed to fetch weather");

      const data = await res.json();
      setWeather(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
        🌦 Weather Updates
      </h1>

      {/* Form */}
      <form
        onSubmit={fetchWeather}
        className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 mb-8"
      >
        <label className="block text-gray-700 font-semibold mb-2">
          Enter your location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Delhi"
          className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-green-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Fetching..." : "Get Weather"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-center text-red-500 font-medium">{error}</p>
      )}

      {/* Weather Card */}
      {weather && (
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-green-700 text-center">
            {weather.location}
          </h2>
          <p className="text-gray-600 italic text-center">
            {weather.report_data}
          </p>

          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div className="bg-green-50 rounded-lg p-3 text-center shadow-sm">
              <p className="font-semibold text-lg">{weather.temperature}°C</p>
              <p className="text-sm">Temperature</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center shadow-sm">
              <p className="font-semibold text-lg">{weather.humidity}%</p>
              <p className="text-sm">Humidity</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center shadow-sm">
              <p className="font-semibold text-lg">{weather.rainfall} mm</p>
              <p className="text-sm">Rainfall</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center shadow-sm">
              <p className="font-semibold text-lg">{weather.conditions}</p>
              <p className="text-sm">Conditions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
