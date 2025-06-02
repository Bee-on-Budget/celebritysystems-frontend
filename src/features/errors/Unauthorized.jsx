import React from "react";
import ErrorPage from "./ErrorPage";

const Unauthorized = () => (
  <ErrorPage
    code="401"
    message="You are not authorized to view this page."
    redirectTo="/"
    buttonText="Go to Home"
  />
);

export default Unauthorized;
