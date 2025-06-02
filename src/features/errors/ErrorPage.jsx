import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = ({ code = "404", message = "Oops! Something went wrong.", onClick, redirectTo, buttonText }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-bg-color text-dark">
      <h1 className="text-6xl font-bold text-primary mb-4">{code}</h1>
      <p className="text-xl mb-6 text-center">{message}</p>
      <Link
        to={redirectTo}
        onClick={onClick}
        className="inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-base h-10 bg-primary text-white hover:bg-primary-hover focus:ring-primary-focus rounded-md"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default ErrorPage;
