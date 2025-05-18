import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-color">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-dashed rounded-full animate-spin"></div>
        <p className="text-dark font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
