import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Hero Section */}
      <section className="bg-green-700 text-white w-full py-20 px-6">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to AgriConnect 🌾</h1>
        <p className="text-lg max-w-3xl mx-auto mb-6">
          AgriConnect bridges the gap between farmers and buyers, empowering agriculture
          by removing middlemen, offering direct trade opportunities, and providing 
          farmers with the tools and information they need to succeed.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/signup"
            className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg shadow hover:bg-gray-100"
          >
            Start Your Journey
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow hover:bg-yellow-300"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-5xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Why AgriConnect?</h2>
        <div className="grid md:grid-cols-2 gap-10 text-left">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-700">🌱 Direct Farmer-to-Buyer</h3>
            <p className="text-gray-600">
              We eliminate middlemen by allowing farmers to list their crops and products 
              directly for buyers, ensuring fair pricing and transparency.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-700">🌦 Weather Updates</h3>
            <p className="text-gray-600">
              Stay prepared with accurate, real-time weather forecasts tailored for farmers, 
              helping you plan your sowing, harvesting, and irrigation schedules better.
              <Link to="/weather" className="text-green-600 hover:underline ml-1">Check Weather</Link>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-700">📢 Government Schemes</h3>
            <p className="text-gray-600">
              Get the latest updates on government subsidies, loan programs, and policies 
              designed to support farmers and promote sustainable agriculture.
              <Link to="/updates" className="text-green-600 hover:underline ml-1">See Updates</Link>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-700">🤖 AskAI Support</h3>
            <p className="text-gray-600">
              Use our smart AI assistant to get answers to farming-related queries — from 
              crop care tips to market trends, all in your local language.
              <Link to="/ask-ai" className="text-green-600 hover:underline ml-1">Ask AI</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-gray-100 py-12 px-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Links</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <Link to="/orders" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
            Orders
          </Link>
          <Link to="/products" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
            Products
          </Link>
          <Link to="/weather" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
            Weather
          </Link>
          <Link to="/updates" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
            Updates
          </Link>
          <Link to="/ask-ai" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
            Ask AI
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
