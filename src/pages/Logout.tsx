// src/pages/Logout.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear access token
    localStorage.removeItem("accessToken");

    // Redirect to login
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // Nothing to render
};

export default Logout;
