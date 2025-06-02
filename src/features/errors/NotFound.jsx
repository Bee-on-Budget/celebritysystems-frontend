import ErrorPage from "./ErrorPage";

const NotFound = () => (
  <ErrorPage
    code="404"
    message="Oops! Page not found."
    redirectTo="/"
    buttonText="Back to Dashboard"
  />
);

export default NotFound;
