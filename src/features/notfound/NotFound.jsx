import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bg-color text-dark">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <Link
        to="/dashboard"
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover focus:ring-4 focus:ring-primary/50 transition duration-200"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
