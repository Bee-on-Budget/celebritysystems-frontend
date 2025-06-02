import ErrorPage from "./ErrorPage";

const ServerError = () => (
  <ErrorPage
    code="500"
    message="Oops! Something went wrong on our end."
    redirectTo="/"
    onClick={() => window.location.reload()}
    buttonText="Back to Dashboard"
  />
);

export default ServerError;
