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

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    description: "",
    price_per_unit: 0,
    unit: "",
  });

  // Check auth & fetch products
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
//     if (!token) {
//       navigate("/login"); // redirect if not logged in
//       return;
    

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit (POST product)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to add product");
      }

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* Product List */}
      <div className="mb-8">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((p) => (
              <li
                key={p.id}
                className="border p-4 rounded-lg shadow-md bg-white"
              >
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p>{p.description}</p>
                <p>
                  <span className="font-medium">Quantity:</span> {p.quantity}{" "}
                  {p.unit}
                </p>
                <p>
                  <span className="font-medium">Price:</span> ₹{p.price_per_unit} per {p.unit}
                </p>
                <p className="text-sm text-gray-500">
                  Added on {new Date(p.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Product Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-gray-100 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="number"
          name="price_per_unit"
          placeholder="Price per unit"
          value={formData.price_per_unit}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <input
          type="text"
          name="unit"
          placeholder="Unit (kg, litre, etc.)"
          value={formData.unit}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Products;
