import { useState } from "react";
import Card from "../../components/common/Card";
import ExtraHourForm from "../../components/extra-hours/ExtraHourForm";
import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import useAuthStore from "../../store/authStore";
// Importar el servicio
import extraHourService from "../../services/extraHourService";

const RegisterPage = () => {
  // Estados para manejar la carga y mensajes
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  // Obtener información del usuario autenticado
  const user = useAuthStore((state) => state.user);

  // Manejador del registro de horas extra
  const handleSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Preparar datos para el envío
      const submitData = {
        employeeId: user.id,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        observations: data.observations,
        // El tipo se calculará en el backend según la fecha/hora
      };

      // Llamada al servicio
      const response = await extraHourService.register(submitData);

      setSuccessMessage("Horas extra registradas correctamente");

      // Log de respuesta exitosa
      console.log("Registro exitoso:", response);
    } catch (error) {
      // Manejo específico de errores según el tipo
      if (error.response?.status === 400) {
        setError("Datos inválidos. Verifica las fechas y horas ingresadas.");
      } else if (error.response?.status === 403) {
        setError("No tienes permisos para registrar horas extra.");
      } else {
        setError(
          error.response?.data?.message || "Error al registrar las horas extra"
        );
      }
      console.error("Error en registro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Renderizado del componente
  return (
    <div className="max-w-2xl mx-auto">
      {loading ? (
        <Loading fullScreen />
      ) : (
        <Card title="Registrar Horas Extra">
          {/* Mensajes de éxito o error */}
          {successMessage && (
            <Alert
              type="success"
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          )}

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {/* Formulario de registro */}
          <ExtraHourForm
            onSubmit={handleSubmit}
            loading={loading}
            employeeName={user?.name}
          />
        </Card>
      )}
    </div>
  );
};

export default RegisterPage;
