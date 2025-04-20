import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import productService from "../services/product.service";
import { authService } from "../services/api";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [numReviews, setNumReviews] = useState();
  const [avgRating, setAvgRating] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  // Load product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Get product details
        const productData = await productService.getProductById(id);
        setProduct(productData);
        
        // Get product reviews
        const reviewsData = await productService.getProductReviews(id);
        setReviews(reviewsData.reviews);
        console.log(reviewsData);
        setNumReviews(reviewsData.totalReviews);
        setAvgRating(reviewsData.averageRating);
        
        // Get related products (same category)
        // if (productData && productData.category) {
        //   const categoryProducts = await productService.getProductsByCategory(productData.category);
        //   // Filter out the current product and limit to 4 related products
        //   const filtered = categoryProducts
        //     .filter(p => p.productID !== productData.productID)
        //     .slice(0, 4);
        //   setRelatedProducts(filtered);
        // }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to load product information. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);

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

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    try {
      await productService.toggleFavorite(id, currentUser.userID);
      // You might want to update the UI to show the product is favorited
      // This would require adding a "isFavorited" state and toggling it
    } catch (err) {
      console.error("Error toggling favorite:", err);
      // Show error message to user
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <Link to="/search" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg">
          Browse Products
        </Link>
      </div>
    );
  }
  
  // Not found state
  if (!product) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Product Not Found</h1>
        <p className="text-gray-700 mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <Link to="/search" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg">
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Bite<span className="text-green-500">Rate</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
              <Link to="/search" className="text-gray-700 hover:text-blue-500">Products</Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
              {currentUser ? (
                <Link to="/profile" className="text-gray-700 hover:text-blue-500">Profile</Link>
              ) : (
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Login</Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-500">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/search" className="hover:text-blue-500">Products</Link>
            {product.category && (
              <>
                <span className="mx-2">›</span>
                <Link to={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-500">
                  {product.category}
                </Link>
              </>
            )}
            <span className="mx-2">›</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={product.imageUrl || `https://via.placeholder.com/500?text=${encodeURIComponent(product.name)}`} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="p-6 md:w-1/2">
              <p className="text-blue-600 font-medium mb-1">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {renderStarRating(avgRating || 0)}
                </div>
                <span className="text-gray-600">({numReviews} reviews)</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-6">
                ${product.price ? product.price.toFixed(2) : "N/A"}
              </p>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Category</h2>
                {product.category && (
                  <Link 
                    to={`/search?category=${encodeURIComponent(product.category)}`}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                  >
                    {product.category}
                  </Link>
                )}
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">
                  {product.description || `A premium gluten-free ${product.name.toLowerCase()} made with high-quality ingredients. Perfect for those with celiac disease or gluten sensitivity.`}
                </p>
              </div>
              {product.ingredients && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Ingredients</h2>
                  <p className="text-gray-700">{product.ingredients}</p>
                </div>
              )}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleToggleFavorite}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex-1 font-medium"
                >
                  Add to Favorites
                </button>
                <Link 
                  to={`/review?productId=${product.productID}`}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg flex-1 font-medium text-center"
                >
                  Write a Review
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            <Link 
              to={`/review?productId=${product.productID}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
            >
              Write a Review
            </Link>
          </div>
          
          {numReviews === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
              <Link 
                to={`/review?productId=${product.productID}`}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium"
              >
                Write a Review
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.reviewID} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900">{review.username || "User"}</div>
                      <div className="flex text-yellow-400 text-sm">
                        {renderStarRating(review.productRating || 0)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.datePosted).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{review.description}</p>
                  {review.storePurchasedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      Purchased at: {review.storePurchasedAt}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <Link 
                  to={`/product/${p.productID}`} 
                  key={p.productID}
                  className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img 
                    src={p.image || `https://via.placeholder.com/300?text=${encodeURIComponent(p.name)}`} 
                    alt={p.name} 
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <div className="text-sm text-blue-600 font-medium">{p.brand}</div>
                    <h3 className="font-medium text-gray-900 mb-1">{p.name}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex text-yellow-400 text-xs">
                        {renderStarRating(p.rating || 0)}
                      </div>
                      <div className="text-blue-600 font-bold">
                        ${p.price ? p.price.toFixed(2) : "N/A"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="text-xl font-bold mb-2">
              Bite<span className="text-green-400">Rate</span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 BiteRate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}