import { Navigate, redirect } from "react-router-dom";
import { isAuthenticated } from "../util/auth_utils";

interface ProtectedRouteProps {
  component: JSX.Element;
}

const ProtectedRoute = ({ component }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return component;
};

export default ProtectedRoute;
