import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import PropTypes from "prop-types";

/**
 * Componente para proteger rutas que requieren autenticación
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos a renderizar si está autenticado
 * @returns {JSX.Element} Componente renderizado
 */
const PrivateRoute = ({ children }) => {
  // Obtener estado de autenticación del store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si hay children específicos, renderizarlos
  // Si no, usar Outlet para rutas anidadas
  return children || <Outlet />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
