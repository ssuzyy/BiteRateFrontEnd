import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    AOS.init({ duration: 800 });
    // test api get
    api.get("/health")
      .then((res) => {
        console.log("Backend connected:", res.data);
        setBackendStatus("online");
      })
      .catch((err) => {
        console.error("Backend failed:", err);
        setBackendStatus("offline");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center py-5">
            <div className="text-2xl font-extrabold text-blue-600">
              Bite<span className="text-green-500">Rate</span>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a href="/" className="text-gray-700 hover:text-blue-500 font-medium transition">
                Home
              </a>
              <a href="/dashboard" className="text-gray-700 hover:text-blue-500 font-medium transition">
                Dashboard
              </a>
              <a
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition"
              >
                Login
              </a>
            </nav>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="md:hidden bg-white px-6 py-4 shadow-md">
            <a href="/" className="block py-2 text-gray-700 hover:text-blue-500">
              Home
            </a>
            <a href="/dashboard" className="block py-2 text-gray-700 hover:text-blue-500">
              Dashboard
            </a>
            <a href="/login" className="block py-2 bg-blue-500 text-white text-center rounded-md">
              Login
            </a>
          </nav>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* Hero */}
        <section
          className="relative z-0 mb-16 bg-gradient-to-br from-blue-100 via-green-100 to-blue-50 rounded-3xl shadow-lg p-12 sm:p-16 text-center"
          data-aos="fade-up"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-6 tracking-tight leading-tight">
            Discover Gluten-Free Foods
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10">
            Find and review the best gluten-free products rated by people like you.
          </p>
          <div className="bg-white shadow-lg rounded-2xl px-6 py-5 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto -mt-4">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-grow px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg">
              Search
            </button>
          </div>
        </section>

        {/* Products */}
        <section className="mb-16" data-aos="fade-up">
          <div className="flex justify-between items-center mb-10 px-2">
            <h2 className="text-3xl font-bold text-gray-800">Top-Rated Products</h2>
            <a href="/products" className="text-blue-500 hover:text-blue-700 font-medium flex items-center">
              View all
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={`https://via.placeholder.com/400x300?text=Gluten+Free+${id}`}
                    alt="Product"
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-bold">
                    Certified GF
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Gluten-Free {id}</h3>
                      <p className="text-sm text-gray-500 mb-3">Natural Organics</p>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                      <span className="text-yellow-500 font-bold mr-1">4.{id + 5}</span>
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292..." />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-5">
                    <span className="text-blue-600 font-bold text-lg">$12.9{id}</span>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16 bg-white rounded-2xl shadow-sm p-10 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Browse Categories</h2>
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

        {/* Testimonials */}
        <section
          className="mb-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-10 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-10">What Our Community Says</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto text-left">
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-700 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Jane Doe</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-lg">
                "BiteRate has completely changed how I shop for gluten-free products. The reviews are honest and have
                saved me from wasting money on disappointing foods!"
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-green-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-700 font-bold">MS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Mike Smith</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-lg">
                "As someone new to a gluten-free diet, this app has been a lifesaver. I've discovered so many delicious
                alternatives I never would have found otherwise."
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="mb-16 bg-blue-600 text-white rounded-2xl p-10 text-center" data-aos="fade-up">
          <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our newsletter to get notified about new gluten-free products and exclusive discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-5 py-3 w-full rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none"
            />
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-bold transition">
              Subscribe
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Bite<span className="text-green-400">Rate</span>
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Helping the gluten-free community find the best foods since 2024.
              </p>
              <p className="text-gray-400">Made with ♥ for the gluten-free community</p>
            </div>
            <div className="md:pl-10">
              <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <a href="/about" className="text-gray-300 hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-300 hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-300 hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-gray-300 hover:text-white transition">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">Stay Connected</h4>
              <div className="flex space-x-6 mb-8">
                {["facebook", "instagram", "twitter"].map((platform) => (
                  <a key={platform} href="#" className="text-gray-300 hover:text-white">
                    <span className="sr-only">{platform}</span>
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </a>
                ))}
              </div>
              <a
                href="/contact"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2024 BiteRate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
