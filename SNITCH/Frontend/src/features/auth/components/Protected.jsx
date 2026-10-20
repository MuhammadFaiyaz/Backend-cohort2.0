import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const Protected = ({children, role="buyer"}) => {

  const location = useLocation();

  const user = useSelector((state) => state.authReducer.user);
  const loading = useSelector((state) => state.authReducer.loading);

  if (loading) return <div>Loading...</div>;

  if (!user)
    return <Navigate to="/login" replace state={{ from: location }} />;

  if (user.role !== role) return <Navigate to="/" />;
  return <div>{children}</div>;
};

export default Protected;
