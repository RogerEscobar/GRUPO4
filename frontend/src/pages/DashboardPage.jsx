import { useState } from "react";
import ExtraHourForm from "../components/extra-hours/ExtraHourForm";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import useAuthStore from "../store/authStore";
import extraHourService from "../services/extraHourService";
import ExtraHoursSummaryCard from "../components/extra-hours/ExtraHoursSummaryCard";

const DashboardPage = () => {
  // Estado global
  const user = useAuthStore((state) => state.user);

  // Estados locales para manejo de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Maneja el registro de horas extra
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Registrar horas extra
      await extraHourService.register(formData);

      // Mostrar mensaje de éxito
      setSuccessMessage("Horas extra registradas correctamente");

      // Recargar después de 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al registrar horas extra:", error);
      setError(error.message || "Error al registrar las horas extra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mensajes de estado */}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Card de Registro de Horas Extra */}
      <Card className="w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-amadeus-primary mb-4">
            Registrar Horas Extra
          </h2>
          <p className="text-gray-600 mb-6">
            Registra tus horas extra trabajadas. Recuerda que el máximo
            permitido es de 2 horas por día.
          </p>
          <ExtraHourForm
            onSubmit={handleSubmit}
            loading={loading}
            employeeName={user?.name}
          />
        </div>
      </Card>

      {/* Card de Historial */}
      <Card className="w-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-amadeus-primary mb-4">
            Mis Registros
          </h2>
          <p className="text-gray-600 mb-6">
            Consulta tu historial de horas extra registradas y su estado de
            aprobación.
          </p>
          <div className="space-y-6">
            <ExtraHoursSummaryCard />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
