import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import Loading from "../components/common/Loading";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Simulamos carga inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Tarjeta de bienvenida */}
      <Card>
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-gray-600 mt-2">Sistema de gestión de horas extra</p>
      </Card>

      {/* Contenido según el rol */}
      {user?.role === "EMPLEADO" && (
        <Card title="Mis Horas Extra">
          {/* Aquí irá el contenido específico para empleados */}
          <p>Contenido para empleados</p>
        </Card>
      )}

      {user?.role === "TEAM_LEADER" && (
        <Card title="Solicitudes Pendientes">
          {/* Aquí irá el contenido específico para líderes */}
          <p>Contenido para líderes</p>
        </Card>
      )}

      {user?.role === "MASTER" && (
        <Card title="Panel de Administración">
          {/* Aquí irá el contenido específico para administradores */}
          <p>Contenido para administradores</p>
        </Card>
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
};

export default DashboardPage;
