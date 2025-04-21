import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../services/product.service";
import { authService } from "../services/api";

export default function SubmitProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    SKU: "",
    brand: "",
    category: "",
    ingredients: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate("/login", {
        state: {
          redirectUrl: "/submit-product",
          message: "Please login to submit a product",
        },
      });
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const { name, SKU, brand, category, ingredients, imageUrl } = formData;
    if (!name || !SKU || !brand || !category || !ingredients || !imageUrl) {
      setError("Please fill in all required fields.");
      return;
    }

    const productData = {
      ...formData,
      createdByUserID: user.id,
    };

    try {
      setLoading(true);
      setError(null);
      await productService.createProduct(productData);
      navigate("/dashboard", {
        state: { message: "Product submitted successfully!" },
      });
    } catch (err) {
      console.error("Error submitting product:", err);
      setError("Failed to submit product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-blue-600">Submit a Product</h1>
      <h2 className="text-lg text-gray-600 mb-6">Add a new product to the catalog</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Chocolate Chip Cookies"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="SKU" className="block text-sm font-medium text-gray-700 mb-1">
            SKU *
          </label>
          <input
            id="SKU"
            name="SKU"
            type="text"
            value={formData.SKU}
            onChange={handleChange}
            placeholder="e.g. CHOCO123"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand *
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. Sweet Treats Co."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Category</option>
            <option value="Breads">Breads</option>
            <option value="Snacks">Snacks</option>
            <option value="Desserts">Desserts</option>
            <option value="Pastas">Pastas</option>
          </select>
        </div>

        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
            Ingredients *
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="List ingredients separated by commas"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL *
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Product"}
        </button>
      </form>
    </div>
  );
}
