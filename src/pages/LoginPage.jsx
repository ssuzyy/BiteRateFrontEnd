import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Step 1: Sign in with Firebase
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Step 2: Get the Google ID token
      const token = await user.getIdToken();
      
      // Step 3: Send token to your backend for verification and user creation/retrieval
      await authService.loginWithGoogle(token);
      
      // Step 4: Redirect to dashboard on success
      navigate('/dashboard');
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login to BiteRate</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <button 
          onClick={handleGoogleSignIn} 
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium transition"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        
        <p className="text-sm text-center text-gray-500 mt-4">
          No account needed—just sign in with Google!
        </p>
        
        <a href="/" className="block text-center text-xs mt-6 text-gray-500 hover:text-blue-500 font-large transition">
          No Thanks!
        </a>
      </div>
    </div>
  );
}