import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { setupInterceptors } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [isFarmer, setIsFarmer] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [error, setError] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(auth);
  }, [auth]);

 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await auth.signup(username, password, email, phone, location, isFarmer, isBuyer);
      navigate('/products', { replace: true });
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Signup failed. Please check your details and try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080/4F6F52/ffffff?text=AgriConnect')" }}
    >
      <div className="bg-white/90 p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#3B5249] mb-6">
          Create Your AgriConnect Account
        </h1>

        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-[#6B8E23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0v1c0 1.105-.895 2-2 2H8m4-3h4m-2-7h.01M5 20h14a2 2 0 002-2v-6a2 2 0 00-2-2h-1a2 2 0 01-2-2H9a2 2 0 01-2 2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        </div>

        {error && <div className="mb-4 text-center text-red-500 font-semibold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#3B5249] text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B9C6A]"
              placeholder="e.g., FarmerJohn"
              required
            />
          </div>
          <div>
            <label className="block text-[#3B5249] text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B9C6A]"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-[#3B5249] text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B9C6A]"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[#3B5249] text-sm font-semibold mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B9C6A]"
              placeholder="+91 9876543210"
              required
            />
          </div>
          <div>
            <label className="block text-[#3B5249] text-sm font-semibold mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B9C6A]"
              placeholder="Village / City"
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isFarmer}
                onChange={() => setIsFarmer(!isFarmer)}
                className="h-4 w-4 text-[#6B8E23] border-gray-300 rounded"
              />
              <span className="text-[#3B5249] text-sm">Farmer</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isBuyer}
                onChange={() => setIsBuyer(!isBuyer)}
                className="h-4 w-4 text-[#6B8E23] border-gray-300 rounded"
              />
              <span className="text-[#3B5249] text-sm">Buyer</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#6B8E23] text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-[#5A7A1C] transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-[#8B9C6A]"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
