import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import PropTypes from "prop-types";
import { useCallback } from "react";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(
    useCallback((state) => state.isAuthenticated, [])
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Agregar la validación de PropTypes
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
