// Importaciones necesarias
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useCallback } from "react";
import LogoLight from "../components/common/LogoLight";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación */}
      <nav className="bg-amadeus-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo y título */}
            <div className="flex items-center">
              <LogoLight className="h-8" />
            </div>

            {/* Información de usuario y botón de logout */}
            {user && (
              <div className="flex items-center">
                <span className="text-white mr-4">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-200 transition-colors">
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

// Validación de props
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
