import { useState } from "react";
import PropTypes from "prop-types";
import Card from "../common/Card";
import Alert from "../common/Alert";
import Button from "../common/Button";
import TimeRangeSelector from "./TimeRangeSelector";
import { formatExtraHourType } from "../../utils/formatUtils";

const ExtraHourForm = ({ onSubmit, loading, employeeName }) => {
  // Estados para el formulario
  const [timeRange, setTimeRange] = useState(null);
  const [observations, setObservations] = useState("");
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Manejador de cambios en el rango de tiempo
  const handleTimeChange = (range) => {
    setTimeRange(range);
    setError(null);
  };

  // Manejador de cambios en observaciones
  const handleObservationsChange = (e) => {
    setObservations(e.target.value);
  };

  // Validación antes de mostrar confirmación
  const handleContinue = () => {
    if (!timeRange) {
      setError("Por favor selecciona el rango de tiempo");
      return;
    }
    setShowConfirmation(true);
  };

  // Manejador de envío final
  const handleSubmit = () => {
    if (!timeRange) return;

    onSubmit({
      ...timeRange,
      observations,
    });
  };

  // Si estamos en modo confirmación
  if (showConfirmation) {
    return (
      <Card className="max-w-2xl mx-auto">
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-center">Confirmar Registro</h2>
          <div className="space-y-4">
            <p className="text-lg">
              {employeeName}, vas a registrar las siguientes horas extra:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p>
                <span className="font-medium">Inicio:</span>{" "}
                {timeRange.start.date} {timeRange.start.time}{" "}
                {timeRange.start.period}
              </p>
              <p>
                <span className="font-medium">Fin:</span> {timeRange.end.date}{" "}
                {timeRange.end.time} {timeRange.end.period}
              </p>

              {timeRange.type && (
                <p>
                  <span className="font-medium">Tipo:</span>{" "}
                  {formatExtraHourType(timeRange.type)}
                </p>
              )}
              {observations && (
                <p>
                  <span className="font-medium">Observaciones:</span>{" "}
                  {observations}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowConfirmation(false)}>
              Regresar
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Confirmar Registro
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Formulario principal
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-amadeus-primary">
            Registrar Horas Extra
          </h2>
          <p className="text-gray-600 mt-2">
            Registra tus horas extra trabajadas. Recuerda que el máximo
            permitido es de 2 horas por día.
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <TimeRangeSelector onTimeChange={handleTimeChange} />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Observaciones
          </label>
          <textarea
            value={observations}
            onChange={handleObservationsChange}
            className="textarea textarea-bordered w-full h-24"
            placeholder="Describe brevemente el trabajo realizado..."
            maxLength={500}
          />
        </div>

        <Button
          onClick={handleContinue}
          fullWidth
          disabled={!timeRange || loading}>
          Continuar
        </Button>
      </div>
    </Card>
  );
};

ExtraHourForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  employeeName: PropTypes.string,
};

export default ExtraHourForm;
