import { useState } from "react";
import PropTypes from "prop-types";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";

const HourRegistrationForm = ({ onSubmit, loading }) => {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    startDateTime: "",
    endDateTime: "",
    observations: "",
  });
  const [error, setError] = useState(null);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validación y envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!formData.startDateTime || !formData.endDateTime) {
      setError("Las fechas son obligatorias");
      return;
    }

    // Convertir strings a Date para comparar
    const start = new Date(formData.startDateTime);
    const end = new Date(formData.endDateTime);

    if (end <= start) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    // Calcular diferencia en horas
    const diffHours = (end - start) / (1000 * 60 * 60);
    if (diffHours > 2) {
      setError("No se pueden registrar más de 2 horas extra por día");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="space-y-4">
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
          />
        </div>

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
          />
        </div>

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

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Registrando..." : "Registrar Horas Extra"}
      </Button>
    </form>
  );
};

HourRegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default HourRegistrationForm;
