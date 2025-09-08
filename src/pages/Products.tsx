// src/pages/Products.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  id?: number;
  user: string;
  name: string;
  quantity: number;
  description: string;
  price_per_unit: number;
  unit: string;
  available: boolean;
  created_at: string;
}

interface UserData {
  username: string;
  email: string;
  is_farmer: boolean;
  is_buyer: boolean;
}

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state (only for farmers)
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    description: "",
    price_per_unit: 0,
    unit: "",
  });

  // Buyer order state
  const [orderQuantity, setOrderQuantity] = useState<{ [key: number]: number }>({});

  // Check auth & fetch products + user
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user info
        const userRes = await fetch("http://127.0.0.1:8000/api/users/dashboard/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const user = await userRes.json();
        setUserData(user);

        // Fetch products
        const res = await fetch("http://127.0.0.1:8000/api/products/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Handle product input change (farmer)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add product (farmer only)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add product");

      const newProduct = await res.json();
      setProducts([...products, newProduct]);

      // Reset form
      setFormData({
        name: "",
        quantity: 0,
        description: "",
        price_per_unit: 0,
        unit: "",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle order input (buyer)
  const handleOrderChange = (productId: number, value: number) => {
    setOrderQuantity({ ...orderQuantity, [productId]: value });
  };

  // Place order (buyer only)
const handleOrder = async (productId: number, quantity: number) => {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  // ✅ Prevent ordering more than available
  if (quantity > product.quantity) {
    alert(`You can only order up to ${product.quantity} ${product.unit}`);
    return;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/orders/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.detail || JSON.stringify(errorData) || "Failed to place order"
      );
    }

    const newOrder = await res.json();
    console.log("Order placed:", newOrder);

    // ✅ reduce product quantity safely
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity - quantity } : p
      )
    );

    // ✅ reset input field for that product
    setOrderQuantity((prev) => ({ ...prev, [productId]: 0 }));
  } catch (err: any) {
    setError(err.message);
  }
};



  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

   return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight">
        Products
      </h1>

      {/* Product List */}
      <div className="mb-12">
        {products.length === 0 ? (
          <p className="text-gray-500 text-lg">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded-2xl shadow-sm hover:shadow-lg transition bg-white p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{p.name}</h2>
                  <p className="text-gray-600 mt-2">{p.description}</p>

                  <div className="mt-4 space-y-1">
                    <p className="text-gray-700">
                      <span className="font-medium">Quantity:</span>{" "}
                      {p.quantity} {p.unit}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Price:</span> ₹
                      {p.price_per_unit} per {p.unit}
                    </p>
                    <p className="text-sm text-gray-400">
                      Added on {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Buyer can order */}
                {userData?.is_buyer && (
                  <div className="mt-5 flex items-center">
                    <input
                      type="number"
                      min="1"
                      max={p.quantity}
                      value={orderQuantity[p.id!] || ""}
                      onChange={(e) =>
                        handleOrderChange(p.id!, parseInt(e.target.value))
                      }
                      className="w-24 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mr-3"
                      placeholder="Qty"
                    />
                    <button
                      onClick={() =>
                        handleOrder(p.id!, orderQuantity[p.id!] || 1)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                    >
                      Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Button & Form (Farmer only) */}
      {userData?.is_farmer && (
        <div className="max-w-lg mx-auto">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
            >
              + Add Product
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-2xl shadow-lg border"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Product
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: Tomatoes, Rice, Milk
                  </p>
                </div>

                <div>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Enter available quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter how much stock you have (e.g., 100)
                  </p>
                </div>

                <div>
                  <textarea
                    name="description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: Freshly harvested organic tomatoes
                  </p>
                </div>

                <div>
                  <input
                    type="number"
                    name="price_per_unit"
                    placeholder="Enter price per unit"
                    value={formData.price_per_unit}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: 50 (for ₹50 per kg/litre)
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    name="unit"
                    placeholder="Enter unit (kg, litre, etc.)"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: kg, litre, dozen
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
                >
                  ✅ Submit Product
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;