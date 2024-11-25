import { useState } from "react";
import PropTypes from "prop-types";
import Alert from "../common/Alert";
import Button from "../common/Button";
import Card from "../common/Card";
import DateTimePicker from "../common/DateTimePicker";
import { formatExtraHourType } from "../../utils/formatUtils";

const ExtraHourForm = ({ onSubmit, loading, employeeName }) => {
  // Estados del formulario
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [observations, setObservations] = useState("");
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fecha actual para validaciones
  const now = new Date().toISOString();

  // Validación del rango de fechas
  const validateDateRange = () => {
    if (!startDateTime || !endDateTime) {
      setError("Debes seleccionar fecha y hora de inicio y fin");
      return false;
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const diffHours = (end - start) / (1000 * 60 * 60);

    if (end <= start) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return false;
    }

    if (diffHours > 2) {
      setError("No se pueden registrar más de 2 horas extra por día");
      return false;
    }

    return true;
  };

  //calculo del tipo de hora extra
  const calculateHourType = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const hour = date.getHours();
    const day = date.getDay();

    if (day === 0) {
      // Domingo
      return hour >= 6 && hour < 21
        ? "EXTRA_DOMINICAL_DIURNA"
        : "EXTRA_DOMINICAL_NOCTURNA";
    } else {
      // Lunes a Sábado
      return hour >= 6 && hour < 21 ? "EXTRA_DIURNA" : "EXTRA_NOCTURNA";
    }
  };

  // Manejador de validación inicial
  const handleContinue = (e) => {
    e.preventDefault();
    if (validateDateRange()) {
      setShowConfirmation(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        startDateTime,
        endDateTime,
        observations,
        type: calculateHourType(startDateTime),
      };

      setShowConfirmation(false);
      await onSubmit(data);
    } catch (error) {
      if (error.message.includes("Ya existe un registro")) {
        setError("Ya existe un registro de horas extra para este periodo");
      } else {
        setError(error.message);
      }
    }
  };

  // Modal de confirmación en ExtraHourForm
  if (showConfirmation) {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowConfirmation(false)}
        />

        {/* Modal centrado */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="mx-auto max-w-lg w-full">
            {" "}
            {/* Contenedor con ancho máximo */}
            <Card className="m-4">
              {/* Contenido del card */}
              <div className="p-6 space-y-6">
                {/* Título */}
                <h2 className="text-xl font-bold text-amadeus-primary">
                  Confirmar Registro
                </h2>

                {/* Contenido */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="font-medium">
                    {employeeName}, confirma el registro de horas extra:
                  </p>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Inicio:</span>{" "}
                      {new Date(startDateTime).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Fin:</span>{" "}
                      {new Date(endDateTime).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Tipo:</span>{" "}
                      {formatExtraHourType(calculateHourType(startDateTime))}
                    </p>
                    {observations && (
                      <p>
                        <span className="font-medium">Observaciones:</span>{" "}
                        {observations}
                      </p>
                    )}
                  </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => setShowConfirmation(false)}>
                    Regresar
                  </Button>
                  <Button onClick={handleSubmit} loading={loading}>
                    Confirmar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Formulario principal
  return (
    <div className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleContinue} className="space-y-6">
        {/* Selectores de fecha/hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Fecha y hora de inicio
            </label>
            <DateTimePicker
              value={startDateTime}
              onChange={(value) => setStartDateTime(value)}
              max={now}
              required
              placeholder="Seleccione fecha y hora de inicio"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Fecha y hora de fin
            </label>
            <DateTimePicker
              value={endDateTime}
              onChange={(value) => setEndDateTime(value)}
              max={now}
              required
              placeholder="Seleccione fecha y hora de fin"
            />
          </div>
        </div>

        {/* Campo de observaciones */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Observaciones
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-24"
            placeholder="Describe brevemente el trabajo realizado..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            maxLength={500}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={!startDateTime || !endDateTime || loading}
          className={`
    ${
      !startDateTime || !endDateTime || loading
        ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"
        : "bg-amadeus-primary hover:bg-amadeus-secondary"
    }
  `}>
          Registrar
        </Button>
      </form>
    </div>
  );
};

ExtraHourForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  employeeName: PropTypes.string,
};

export default ExtraHourForm;
