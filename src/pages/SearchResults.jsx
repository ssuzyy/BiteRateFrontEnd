import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let endpoint = '/products/search';
        let params = {};
        
        if (query) {
          params.q = query;
        }
        
        if (category) {
          endpoint = `/products/category/${category}`;
        }
        
        const response = await api.get(endpoint, { params });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, category]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        {category 
          ? `${category} Products` 
          : `Search Results: ${query}`}
      </h1>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">
            No products found for "{query || category}".
          </p>
          <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
            Return to homepage
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.productID}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.imageUrl || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="w-full h-52 object-cover"
                />
                {product.glutenFree && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-bold">
                    Certified GF
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{product.brand}</p>
                  </div>
                  {product.rating && (
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                      <span className="text-yellow-500 font-bold mr-1">{product.rating.toFixed(1)}</span>
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Link
                    to={`/product/${product.productID}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full inline-block text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}