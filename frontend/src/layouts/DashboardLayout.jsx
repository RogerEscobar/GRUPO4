import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useCallback } from "react";
import LogoLight from "../components/common/LogoLight";
import { Outlet } from "react-router-dom";

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
      {/* Barra de navegación superior */}
      <nav className="bg-amadeus-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo y marca */}
            <div className="flex items-center space-x-4">
              <LogoLight className="h-8" />
              <span className="text-white font-medium hidden sm:block">
                Sistema de Horas Extra
              </span>
            </div>

            {/* Información del usuario y logout */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-white text-sm">
                  <span className="hidden sm:inline-block mr-1">
                    Bienvenido,
                  </span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-200 transition-colors text-sm px-3 py-1 rounded-md hover:bg-amadeus-secondary">
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Contenedor principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Sistema de Gestión de Horas Extra
          </p>
        </div>
      </footer>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
