import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useCallback } from "react";
import LogoLight from "../components/common/LogoLight";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación principal */}
      <nav className="bg-amadeus-primary">
        {/* Contenedor con padding lateral específico */}
        <div className="w-full px-16 md:px-24 lg:px-32">
          <div className="flex justify-between items-center h-16">
            {/* Sección izquierda - Saludo al usuario con padding */}
            <div className="flex items-center pl-4">
              <span className="text-white text-sm">
                Hola, {user?.name || "Usuario Pruebas"}
              </span>
            </div>

            {/* Sección central - Logo */}
            <div className="flex justify-center absolute left-1/2 transform -translate-x-1/2">
              <LogoLight className="h-8" />
            </div>

            {/* Sección derecha - Botón de salir con padding */}
            <div className="flex items-center pr-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors text-sm">
                <span>Salir</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal con padding lateral ajustado */}
      <main className="mx-auto px-16 md:px-24 lg:px-32 py-6">
        <Outlet />
      </main>

      {/* Pie de página con padding lateral ajustado */}
      <footer className="bg-white border-t mt-auto">
        <div className="mx-auto px-16 md:px-24 lg:px-32 py-4">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Sistema de Gestión de Horas Extra
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
