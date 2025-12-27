import { useContext } from 'react';
import { Navigate } from 'react-router';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(UserContext);

  if (!user) return <Navigate to="/sign-in" />;

  if (roles && !roles.includes(user.role))
    return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;

