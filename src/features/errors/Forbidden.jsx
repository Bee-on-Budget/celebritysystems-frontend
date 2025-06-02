import ErrorPage from "./ErrorPage";

const Forbidden = () => (
  <ErrorPage
    code="403"
    message="Access to this resource is forbidden."
    redirectTo="/dashboard"
    buttonText="Back to Dashboard"
  />
);

export default Forbidden;
