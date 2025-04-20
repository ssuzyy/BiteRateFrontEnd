import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import reviewService from "../services/review.service";
import authService from "../services/auth.service";

export default function SubmitReview() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const location = useLocation();
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [store, setStore] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // Get product info from location state or set default
  const product = location.state?.product || { name: "Product" };

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate("/login", { 
        state: { 
          redirectUrl: `/review/${productId}`,
          message: "Please login to submit a review" 
        } 
      });
    } else {
      setUser(currentUser);
    }
  }, [navigate, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!rating) {
      setError("Please select a rating");
      return;
    }
    
    // Prepare review data
    const reviewData = {
      userID: user.id,
      productID: productId,
      productRating: Number(rating),
      description: description,
      storePurchasedAt: store
    };
    
    try {
      setLoading(true);
      setError(null);
      
      // Submit the review
      await reviewService.createReview(reviewData);
      
      // Redirect to product page
      navigate(`/product/${productId}`, { 
        state: { message: "Review submitted successfully!" } 
      });
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-blue-600">Write a Review</h1>
      <h2 className="text-lg text-gray-600 mb-6">for {product.name}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating *
          </label>
          <select 
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Rating</option>
            <option value="5">★★★★★ (5/5) Excellent</option>
            <option value="4">★★★★☆ (4/5) Good</option>
            <option value="3">★★★☆☆ (3/5) Average</option>
            <option value="2">★★☆☆☆ (2/5) Poor</option>
            <option value="1">★☆☆☆☆ (1/5) Terrible</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you think about this product? How does it taste? Would you recommend it?"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        
        <div>
          <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1">
            Where did you purchase it?
          </label>
          <input
            id="store"
            type="text"
            value={store}
            onChange={(e) => setStore(e.target.value)}
            placeholder="Store name (optional)"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        
        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}