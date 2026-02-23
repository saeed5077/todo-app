import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If not logged in, redirect to login page
  if (!user) return <Navigate to="/login" />;

  // If logged in, render the actual page
  return children;
};

export default ProtectedRoute;