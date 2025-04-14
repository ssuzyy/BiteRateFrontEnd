export default function SubmitReview() {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Write a Review</h1>
      <form className="space-y-4">
        <textarea
          placeholder="What did you think?"
          rows={5}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select className="w-full p-2 border border-gray-300 rounded">
          <option value="">Select Rating</option>
          <option value="5">★★★★★</option>
          <option value="4">★★★★</option>
          <option value="3">★★★</option>
          <option value="2">★★</option>
          <option value="1">★</option>
        </select>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full">
          Submit Review
        </button>
      </form>
    </div>
  );
}
