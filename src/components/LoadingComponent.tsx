const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const LoadingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <img src={`${basePath}/iconanim.svg`} className="w-40 m-10" />
      <p className="text-4xl font-bold text-gray-800 mb-4">Loading Simprints AI</p>
      <p className="text-lg text-gray-600 mb-8">This may take a few moments...</p>
    </div>
  );
};

export default LoadingComponent;