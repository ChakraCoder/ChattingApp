import Spinner from "./Spinner";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Spinner size="lg" className="text-black" />
    </div>
  );
};

export default LoadingScreen;
