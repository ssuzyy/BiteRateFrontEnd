import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Product #{id}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <img src="https://via.placeholder.com/250" alt="Product" className="rounded shadow" />
        <div>
          <h2 className="text-xl font-semibold">Product Name</h2>
          <p className="text-gray-600">Brand • Category</p>
          <p className="text-yellow-400 text-lg mt-2">★★★★☆</p>
          <p className="mt-4 text-gray-700">
            Ingredients: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h3 className="text-xl font-bold mb-2">Reviews</h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-700">“Amazing product!”</p>
            <p className="text-sm text-gray-500 mt-1">– User123, ★★★★★</p>
          </div>
        </div>
      </section>
    </div>
  );
}
