import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterPage from "./pages/extra-hours/RegisterPage";
import HistoryPage from "./pages/extra-hours/HistoryPage";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./components/auth/PrivateRoute";
import useAuthStore from "./store/authStore";

function App() {
  // Obtener estado de autenticación del store
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
            {/* Página principal del dashboard */}
            <Route index element={<DashboardPage />} />

            {/* Rutas de horas extra */}
            <Route path="extra-hours">
              {/* Ruta para registro de horas extra */}
              <Route path="register" element={<RegisterPage />} />
              {/* Nueva ruta para historial de horas extra */}
              <Route path="history" element={<HistoryPage />} />
            </Route>
          </Route>
        </Route>

        {/* Ruta para manejar páginas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
