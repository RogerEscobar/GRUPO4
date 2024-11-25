import { useState } from "react";
import Card from "../../components/common/Card";
import ExtraHourForm from "../../components/extra-hours/ExtraHourForm";
import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import useAuthStore from "../../store/authStore";
import extraHourService from "../../services/extraHourService";

const RegisterPage = () => {
  // Estados para manejar la UI
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  // Obtener información del usuario del store
  const user = useAuthStore((state) => state.user);

  /**
   * Calcula el tipo de hora extra basado en la fecha y hora
   * @param {string} dateTimeStr - Fecha y hora en formato ISO
   * @returns {string} Tipo de hora extra
   */
  const calculateExtraHourType = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const hour = date.getHours();
    const day = date.getDay(); // 0 es domingo

    if (day === 0) {
      // Domingo
      return hour >= 6 && hour < 21 ? "DOMINICAL_DIURNA" : "DOMINICAL_NOCTURNA";
    } else {
      // Lunes a Sábado
      return hour >= 6 && hour < 21 ? "DIURNA" : "NOCTURNA";
    }
  };

  /**
   * Maneja el envío del formulario de horas extra
   * @param {Object} data - Datos del formulario
   * @param {string} data.startDateTime - Fecha y hora de inicio
   * @param {string} data.endDateTime - Fecha y hora de fin
   * @param {string} data.observations - Observaciones
   */
  const handleSubmit = async (data) => {
    // Reiniciar estados
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
        type: calculateExtraHourType(data.startDateTime), // Calculamos el tipo aquí
      };

      // Registro en el backend
      const response = await extraHourService.register(submitData);

      // Mostrar mensaje de éxito
      setSuccessMessage("Horas extra registradas correctamente");

      // Log de respuesta exitosa (útil para debugging)
      console.log("Registro exitoso:", response);

      // Aquí podrías agregar redirección o actualización de lista
    } catch (error) {
      // Manejo específico de errores según el código HTTP
      switch (error.response?.status) {
        case 400:
          setError("Datos inválidos. Verifica las fechas y horas ingresadas.");
          break;
        case 403:
          setError("No tienes permisos para registrar horas extra.");
          break;
        case 409:
          setError("Ya existe un registro para el periodo seleccionado.");
          break;
        default:
          setError(
            error.response?.data?.message ||
              "Error al registrar las horas extra"
          );
      }

      // Log del error para debugging
      console.error("Error en registro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Si está cargando, mostrar indicador de carga
  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <div className="space-y-4">
          {/* Título de la página */}
          <h1 className="text-2xl font-bold text-gray-900">
            Registrar Horas Extra
          </h1>

          {/* Mensajes de estado */}
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
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
