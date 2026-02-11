import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner size="lg" />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
