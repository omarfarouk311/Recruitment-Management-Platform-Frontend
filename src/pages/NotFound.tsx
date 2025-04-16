import notFoundImage from "../assets/not-found.png";

const NotFound = () => {
  return (
    <div className="flex md:flex-row min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <img
          src={notFoundImage}
          alt="Page not found illustration"
          className="max-w-full h-auto max-h-[60vh] object-contain"
        />
        <h2 className="text-3xl md:text-4xl text-gray-800 mt-8 text-center">
          Page not found
        </h2>
      </div>
    </div>
  );
};

export default NotFound;
