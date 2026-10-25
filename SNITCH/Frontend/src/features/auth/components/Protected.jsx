import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const Protected = ({ children, role }) => {
  const location = useLocation();

  const user = useSelector((state) => state.authReducer.user);
  const loading = useSelector((state) => state.authReducer.loading);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  const allowedRoles = role ? [].concat(role):null

  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace/>;
  return children;
};

export default Protected;
