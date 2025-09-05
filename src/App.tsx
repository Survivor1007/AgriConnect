import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Signup from "./pages/Signup";
import Weather from "./pages/Weather";
import Updates from "./pages/Updates";
import AskAI from "./pages/AskAI";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <Router>
      <AuthProvider> {/* Correct placement: Wrap the Routes */}
        <div className="flex flex-col min-h-screen">
          <Navbar />

          {/* Main Page Content */}
          <main className="flex-grow p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path ="/weather" element={<Weather />}></Route>
              <Route path = "/updates" element={<Updates />}></Route>
              <Route path = "/ask-ai" element={<AskAI/>}></Route>
              <Route path = "/dashboard" element={<Dashboard/>}></Route>
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;