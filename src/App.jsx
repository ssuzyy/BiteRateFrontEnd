import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import ProductPage from "./pages/ProductPage";
import SubmitReview from "./pages/SubmitReview";
import SearchResults from "./pages/SearchResults";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/review" element={<SubmitReview />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="*" element={<div className="flex h-screen justify-center items-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Page Not Found</h1>
            <p className="text-lg text-gray-700 mb-6">Sorry, the page you are looking for doesn't exist.</p>
            <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg">
              Go to Homepage
            </a>
          </div>
        </div>} />
      </Routes>
    </Router>
  );
}

export default App;
