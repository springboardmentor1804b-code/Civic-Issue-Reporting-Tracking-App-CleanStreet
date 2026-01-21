const Loader = ({ message = "Loading...", size = "md" }) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className={`relative ${sizes[size]} mx-auto mb-4`}>
          <div className="absolute inset-0 rounded-full border-4 border-emerald-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          <div
            className="absolute inset-2 rounded-full border-4 border-green-300 border-b-transparent animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
