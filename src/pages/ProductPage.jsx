import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import productService from "../services/product.service";
import reviewService from "../services/review.service";
import authService from "../services/auth.service";

export default function ProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || null);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    // Fetch product and reviews data
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productData = await productService.getProductById(id);
        setProduct(productData);
        
        // Fetch reviews for this product
        const reviewsData = await reviewService.getReviewsByProduct(id);
        setReviews(reviewsData);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load product information");
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Clear message after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [id, message]);
  
  // Handle voting on a review
  const handleVote = async (reviewId, voteType) => {
    if (!currentUser) {
      setMessage("Please log in to vote on reviews");
      return;
    }
    
    try {
      await reviewService.voteOnReview(reviewId, currentUser.id, voteType);
      
      // Refresh reviews to update vote counts
      const updatedReviews = await reviewService.getReviewsByProduct(id);
      setReviews(updatedReviews);
      
      setMessage(`Marked review as ${voteType}`);
    } catch (err) {
      console.error("Error voting on review:", err);
      setMessage(err.response?.data?.message || "Failed to record vote");
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Render star rating
  const renderStarRating = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>★</span>
    ));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}
      
      <h1 className="text-3xl font-bold text-blue-700 mb-4">{product.name}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <img 
          src={`https://via.placeholder.com/250?text=${encodeURIComponent(product.name)}`}
          alt={product.name} 
          className="rounded shadow"
        />
        <div>
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-600">{product.brand} • {product.category}</p>
          <div className="flex items-center mt-2">
            <span className="text-xl mr-2">
              {renderStarRating(product.avgRating || 0)}
            </span>
            <span className="text-gray-600">
              ({product.avgRating ? product.avgRating.toFixed(1) : "No ratings"})
            </span>
          </div>
          <p className="mt-4 text-gray-700">
            <strong>Ingredients:</strong> {product.ingredients || "Not specified"}
          </p>
          
          <div className="mt-6">
            <Link 
              to={`/review/${product.productID}`}
              state={{ product }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Write a Review
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h3 className="text-xl font-bold mb-4">Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            <Link 
              to={`/review/${product.productID}`}
              state={{ product }}
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Write a Review
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.reviewID} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStarRating(review.productRating)}
                    </div>
                    <p className="text-gray-700 mb-4">{review.description}</p>
                    <div className="text-sm text-gray-500">
                      <span>By {review.User?.email || "Anonymous"}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(review.datePosted)}</span>
                      {review.storePurchasedAt && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Purchased at {review.storePurchasedAt}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Show edit/delete options if this is the user's review */}
                  {currentUser && currentUser.id === review.userID && (
                    <div className="flex space-x-2">
                      <Link 
                        to={`/review/edit/${review.reviewID}`}
                        state={{ review, product }}
                        className="text-sm text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this review?")) {
                            reviewService.deleteReview(review.reviewID, currentUser.id)
                              .then(() => {
                                setReviews(reviews.filter(r => r.reviewID !== review.reviewID));
                                setMessage("Review deleted successfully");
                              })
                              .catch(err => {
                                console.error("Error deleting review:", err);
                                setMessage("Failed to delete review");
                              });
                          }
                        }}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Review voting section */}
                <div className="mt-4 flex items-center space-x-4">
                  <button 
                    onClick={() => handleVote(review.reviewID, 'helpful')}
                    className="flex items-center text-sm text-gray-600 hover:text-green-600"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905v.714L7.5 9h-3a2 2 0 00-2 2v.5" />
                    </svg>
                    Helpful ({review.helpfulCount || 0})
                  </button>
                  <button 
                    onClick={() => handleVote(review.reviewID, 'unhelpful')}
                    className="flex items-center text-sm text-gray-600 hover:text-red-600"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905v-.714l-.501-.501-3.5-3.5-4 4z" />
                    </svg>
                    Not helpful ({review.unhelpfulCount || 0})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}