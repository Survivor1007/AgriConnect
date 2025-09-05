import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { setupInterceptors } from '../api/axios';
import {  useNavigate } from 'react-router-dom';

// Main App component which acts as the entire application
// All logic and components are contained within this single file
const Login = () => {
  // State hooks to manage the input values for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(auth);
  },[auth]);

  useEffect(() => {
    if(auth.isAuthenticated){
      navigate('/products',{replace:true});
    }
  },[auth.isAuthenticated,navigate]);

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await auth.login(username, password);
      navigate('/products', { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      // Display a user-friendly error message
      setError('Login failed. Please check your username and password.');
    }
  };

  // If the user is authenticated, render the products page
  

  // Otherwise, render the login page
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-sans"
      style={{ backgroundImage: "url('https://placehold.co/1920x1080/4F6F52/ffffff?text=AgriConnect')" }}
    >
      <div className="bg-white/90 p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#3B5249] mb-6">
          Welcome to the AgriConnect
        </h1>
        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-[#6B8E23]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0a2 2 0 01-2 2H7a2 2 0 01-2-2m7 2v4m-4-4v4"
            />
          </svg>
        </div>

        {error && <div className="mb-4 text-center text-red-500 font-semibold">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#3B5249] text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-[#3B5249] bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9C6A]"
              placeholder="e.g., Farmer John"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#3B5249] text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-[#3B5249] bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B9C6A]"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#6B8E23] text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-[#5A7A1C] transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-[#8B9C6A]"
          >
            Harvest Your Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
