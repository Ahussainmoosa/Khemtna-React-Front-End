import { useContext } from "react";
import { Navigate } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const RequireRole = ({ allowedRoles, children }) => {
  const { user } = useContext(UserContext);

  // Not logged in → go to sign-in
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Logged in but wrong role → forbidden page
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render page
  return children;
};

export default RequireRole;
