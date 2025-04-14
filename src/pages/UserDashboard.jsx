export default function UserDashboard() {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Welcome, User!</h1>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Your Badges</h2>
          <div className="flex gap-4">
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow w-32 text-center">🎖️ Reviewer</div>
            <div className="bg-purple-100 text-purple-800 p-4 rounded shadow w-32 text-center">🧠 Expert</div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Rating</h2>
          <div className="flex gap-4">
            <div className="bg-green-100 text-purple-800 p-4 rounded shadow w-32 text-center">★★★★☆</div>
          </div>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mb-2">Favorite Products</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Sample Product A</li>
            <li>Sample Product B</li>
          </ul>
        </section>
      </div>
    );
  }