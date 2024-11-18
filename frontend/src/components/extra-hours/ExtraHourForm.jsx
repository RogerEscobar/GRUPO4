import { useState } from "react";
import PropTypes from "prop-types";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";

const ExtraHourForm = ({ onSubmit, loading, employeeName }) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    startDateTime: "",
    endDateTime: "",
    observations: "",
  });
  const [error, setError] = useState(null);

  // Manejador de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error cuando el usuario modifica algún campo
    setError(null);
  };

  // Validaciones del formulario
  const validateForm = () => {
    // Validar que ambas fechas estén presentes
    if (!formData.startDateTime || !formData.endDateTime) {
      setError("Debes seleccionar fecha y hora de inicio y fin");
      return false;
    }

    const start = new Date(formData.startDateTime);
    const end = new Date(formData.endDateTime);
    const now = new Date();

    // Validar que las fechas no sean futuras
    if (start > now || end > now) {
      setError("No se pueden registrar horas extra futuras");
      return false;
    }

    // Validar que la fecha fin sea posterior a la de inicio
    if (end <= start) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return false;
    }

    // Calcular diferencia en horas
    const diffHours = (end - start) / (1000 * 60 * 60);

    // Validar máximo de horas
    if (diffHours > 2) {
      setError("No se pueden registrar más de 2 horas extra por día");
      return false;
    }

    // Validar mínimo de tiempo
    if (diffHours < 0.5) {
      setError("El registro debe ser de mínimo 30 minutos");
      return false;
    }

    return true;
  };

  // Manejador de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mostrar nombre del empleado si está disponible */}
      {employeeName && (
        <div className="text-gray-600">Empleado: {employeeName}</div>
      )}

      {/* Mensajes de error */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="space-y-4">
        {/* Campo fecha y hora inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha y hora inicio
          </label>
          <Input
            type="datetime-local"
            name="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
            required
            max={new Date().toISOString().slice(0, 16)}
          />
        </div>

        {/* Campo fecha y hora fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha y hora fin
          </label>
          <Input
            type="datetime-local"
            name="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
            required
            max={new Date().toISOString().slice(0, 16)}
          />
        </div>

        {/* Campo observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-amadeus-primary"
            rows="3"
            maxLength="500"
            placeholder="Describe brevemente el trabajo realizado..."
          />
        </div>
      </div>

      {/* Botón submit */}
      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Registrando..." : "Registrar Horas Extra"}
      </Button>
    </form>
  );
};

ExtraHourForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  employeeName: PropTypes.string,
};

export default ExtraHourForm;
