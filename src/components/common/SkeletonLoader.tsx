const SkeletonLoader = () => (
  <div className="space-y-4">
    {[1, 2].map((i) => (
      <div key={i} className="bg-white p-6 rounded-3xl animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded mt-4"></div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
