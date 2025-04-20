import { useState, useEffect } from "react";
import { authService } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberSince] = useState("April 2023");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Redirect to login if no user is found
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return null; // This should not render as we navigate away
  }
  
  // Sample data for dashboard
  const topRatedProducts = [
    { id: 1, name: "Udi's Whole Grain Bread", brand: "Udi's", rating: 4.5, certifiedGF: true, image: "https://via.placeholder.com/400x300?text=Udi's+Bread" },
    { id: 2, name: "Siete Tortilla Chips", brand: "Siete Foods", rating: 4, certifiedGF: true, image: "https://via.placeholder.com/400x300?text=Siete+Chips" },
    { id: 3, name: "Bob's Red Mill Flour", brand: "Bob's Red Mill", rating: 5, certifiedGF: true, image: "https://via.placeholder.com/400x300?text=Bobs+Flour" }
  ];
  
  const recentReviews = [
    { id: 1, productName: "Canyon Bakehouse Bread", rating: 5, date: "2 days ago", comment: "Excellent texture and taste!" },
    { id: 2, productName: "Barilla Gluten-Free Pasta", rating: 3.5, date: "1 week ago", comment: "Good alternative but gets mushy if overcooked." }
  ];
  
  const badges = [
    { name: "Reviewer", count: 24, color: "bg-yellow-100 text-yellow-800" },
    { name: "GF Expert", count: 142, color: "bg-blue-100 text-blue-800" },
    { name: "Trendsetter", count: 8, color: "bg-green-100 text-green-800" }
  ];

  // Render star rating based on rating value (matching the homepage implementation)
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
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* Back to Homepage Button */}
        <div className="mb-6">
          <a href="/" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Homepage
          </a>
        </div>
        {/* Dashboard Header */}
        <section className="mb-8 bg-gradient-to-br from-blue-100 via-green-100 to-blue-50 rounded-3xl shadow-lg p-8 sm:p-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mr-6">
                {user.email.split('@')[0][0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-blue-700">{user.email.split('@')[0]}</h1>
                <p className="text-gray-600">Member since {memberSince}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Badges Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Badges</h2>
            <div className="space-y-4">
              {badges.map((badge, index) => (
                <div key={index} className={`${badge.color} rounded-lg p-4 flex justify-between items-center`}>
                  <span className="font-semibold">{badge.name}</span>
                  <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-gray-700 shadow-sm">
                    {badge.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats and Reviews Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Your Activity</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-blue-600">24</p>
                  <p className="text-gray-600">Reviews</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-600">142</p>
                  <p className="text-gray-600">Products Tried</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-yellow-600">89</p>
                  <p className="text-gray-600">Helpful Votes</p>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Recent Reviews</h2>
                <button className="text-blue-500 hover:text-blue-700 font-medium flex items-center">
                  View all
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{review.productName}</h3>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex mb-2">
                      {renderStarRating(review.rating)}
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Products */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Top-Rated Products</h2>
            <button className="text-blue-500 hover:text-blue-700 font-medium flex items-center">
              View all
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.certifiedGF && (
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
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                      <span className="text-yellow-500 font-bold mr-1">
                        {product.rating.toFixed(1)}
                      </span>
                      <div className="flex">
                        {renderStarRating(product.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Product
                    </button>
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discover Section */}
        <section className="mt-12 bg-white rounded-2xl shadow-sm p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Discover New Products</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Based on your reviews and preferences, we think you might like these gluten-free options:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {["Breads", "Pastas", "Snacks", "Desserts"].map((category) => (
              <div
                key={category}
                className="bg-blue-50 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 p-6 text-center cursor-pointer"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-500 text-xl font-bold">{category[0]}</span>
                </div>
                <h3 className="font-medium text-gray-800">{category}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
