import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
import useAuthStore from "../store/authStore";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuthStore();

  if (!auth) return <Navigate to="/login" />; // not logged in
  if (!allowedRoles.includes(auth.role)) return <Navigate to="/unauthorized" />; // role mismatch

  return children;
};

export default PrivateRoute;
