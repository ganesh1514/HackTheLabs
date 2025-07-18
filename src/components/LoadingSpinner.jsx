const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange mx-auto"></div>
        <p className="mt-2 text-white">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
