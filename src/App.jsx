import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import ProductPage from "./pages/ProductPage";
import SubmitReview from "./pages/SubmitReview";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/review" element={<SubmitReview />} />
      </Routes>
    </Router>
  );
}

export default App;
