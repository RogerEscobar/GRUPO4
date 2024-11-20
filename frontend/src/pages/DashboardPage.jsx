import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Card from "../components/common/Card";

const DashboardPage = () => {
  // Hooks para navegación y estado global
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Manejadores de navegación
  const handleRegisterClick = () => {
    navigate("/extra-hours/register");
  };

  const handleHistoryClick = () => {
    navigate("/extra-hours/history");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Encabezado con bienvenida */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-gray-600">Sistema de gestión de horas extra</p>
      </div>

      {/* Tarjetas de acciones */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tarjeta de Registro de Horas */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-amadeus-primary mb-3">
              Registrar Horas Extra
            </h2>
            <p className="text-gray-600 mb-6">
              Registra tus horas extra trabajadas. Recuerda que el máximo
              permitido es de 2 horas por día.
            </p>
            <button
              onClick={handleRegisterClick}
              className="btn btn-primary w-full"
              disabled={user?.role !== "EMPLEADO"}>
              Registrar Horas
            </button>
          </div>
        </Card>

        {/* Tarjeta de Historial */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-amadeus-primary mb-3">
              Mis Registros
            </h2>
            <p className="text-gray-600 mb-6">
              Consulta tu historial de horas extra registradas y su estado de
              aprobación.
            </p>
            <button
              onClick={handleHistoryClick}
              className="btn btn-outline btn-primary w-full">
              Ver Historial
            </button>
          </div>
        </Card>
      </div>

      {/* Zona de Aprobaciones (solo para TEAM_LEADER y MASTER) */}
      {(user?.role === "TEAM_LEADER" || user?.role === "MASTER") && (
        <div className="mt-8">
          <Card className="bg-white shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-amadeus-primary mb-3">
                Aprobaciones Pendientes
              </h2>
              <p className="text-gray-600 mb-6">
                Revisa y gestiona las solicitudes de horas extra pendientes de
                aprobación.
              </p>
              <button
                onClick={() => navigate("/extra-hours/approvals")}
                className="btn btn-primary w-full">
                Ver Solicitudes
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
