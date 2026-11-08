
import { UrlState } from "@/context";
import { Navigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

function RequiredAuth({ children }) {
  const { loading, isAuthenticated } = UrlState();

  // Wait for authentication check
  if (loading) {
    return <BarLoader width="100%" color="#36d7d7" />;
  }

  // Redirect only after authentication check finishes
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

export default RequiredAuth;
