import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/extra-hours/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./components/auth/PrivateRoute";
import useAuthStore from "./store/authStore";

/**
 * Componente principal de la aplicación
 * Maneja el enrutamiento y la protección de rutas
 */
function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Ruta raíz - Redirige según autenticación */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Ruta de login - Accesible solo si no está autenticado */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Rutas protegidas - Requieren autenticación */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="extra-hours/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
