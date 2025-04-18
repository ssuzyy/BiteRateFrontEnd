import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import productService from "../services/product.service";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState(query);
  const navigate = useNavigate();

  // Fetch products based on search parameters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        if (query) {
          // Search by query
          data = await productService.searchProducts(query);
        } else if (category) {
          // Filter by category
          data = await productService.getProductsByCategory(category);
        } else {
          // Get all products
          data = await productService.getAllProducts();
        }
        
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [query, category]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInputValue.trim())}`);
    }
  };

  // Render star rating based on rating value
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }
    
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with search bar */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Link to="/" className="text-2xl font-extrabold text-blue-600">
              Bite<span className="text-green-500">Rate</span>
            </Link>
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative flex w-full md:max-w-lg">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 text-blue-500 hover:text-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            <nav className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {category 
              ? `Category: ${category}` 
              : query 
                ? `Search results for "${query}"` 
                : "All Products"
            }
          </h1>
          <p className="text-gray-600 mt-2">
            {loading 
              ? "Loading products..." 
              : `Found ${products.length} products`
            }
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link 
            to="/search" 
            className={`px-4 py-2 rounded-full text-sm font-medium ${!category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            All
          </Link>
          {["Breads", "Pastas", "Snacks", "Desserts"].map((cat) => (
            <Link
              key={cat}
              to={`/search?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category === cat 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Results grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-xl">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product.productID}`}
                key={product.productID}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
              >
                <img 
                  src={product.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-grow flex flex-col">
                  <div className="text-sm text-blue-600 font-semibold mb-1">{product.brand}</div>
                  <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                  <div className="text-sm text-gray-500 mb-2">Category: {product.category}</div>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">
                      {product.rating ? product.rating.toFixed(1) : "N/A"}
                    </span>
                    <div className="flex">
                      {renderStarRating(product.rating || 0)}
                    </div>
                  </div>
                  <div className="text-blue-600 font-bold mt-auto">
                    ${product.price ? product.price.toFixed(2) : "N/A"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No results message */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching your criteria.
            </p>
            <Link 
              to="/search" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg inline-block"
            >
              View all products
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="text-xl font-bold mb-2">
              Bite<span className="text-green-400">Rate</span>
            </div>
            <p className="text-gray-400 text-sm">© 2025 BiteRate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}