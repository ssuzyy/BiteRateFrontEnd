import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase"; // make sure path is correct

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Signed in as:", user.displayName);
      // You could redirect, store user, etc.
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login to BiteRate</h2>
        <button onClick={handleGoogleSignIn} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium transition">
          Sign in with Google
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
