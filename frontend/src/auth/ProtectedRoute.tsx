import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if(isLoading) {
    return null
  }

  if (isAuthenticated) {
    // Outlet: is the location where the child routes that are connected to this protected route are displayed.
    return <Outlet />;
  }

  // Navigate Redirects the user to the home page (/).
  // replace: Deletes the current path from the navigation history stack, so that the user cannot return to the protected page using the browser's back button.
  return <Navigate to="/" replace />;

};

export default ProtectedRoute;
