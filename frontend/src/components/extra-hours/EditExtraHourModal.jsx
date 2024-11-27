import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../common/Modal";
import Alert from "../common/Alert";
import Button from "../common/Button";
import DateTimePicker from "../common/DateTimePicker";
import extraHourService from "../../services/extraHourService";

const EditExtraHourModal = ({ isOpen, onClose, record, onSuccess }) => {
  const [startDateTime, setStartDateTime] = useState(
    record?.startDateTime
      ? new Date(record.startDateTime).toISOString().slice(0, 16)
      : ""
  );
  const [endDateTime, setEndDateTime] = useState(
    record?.endDateTime
      ? new Date(record.endDateTime).toISOString().slice(0, 16)
      : ""
  );
  const [observations, setObservations] = useState(record?.observations || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDateRange()) return;

    try {
      setLoading(true);
      setError(null);

      await extraHourService.update(record.id, {
        startDateTime,
        endDateTime,
        observations,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error en actualización:", error);
      // Mostrar el mensaje de error que viene del servicio
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Editar Registro de Horas Extra"
      onClose={onClose}>
      <div className="p-4">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-4"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selectores de fecha/hora */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Fecha y hora de inicio
              </label>
              <DateTimePicker
                value={startDateTime}
                onChange={(value) => setStartDateTime(value)}
                max={new Date().toISOString()}
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
                max={new Date().toISOString()}
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

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} loading={loading}>
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

EditExtraHourModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  record: PropTypes.shape({
    id: PropTypes.number.isRequired,
    startDateTime: PropTypes.string.isRequired,
    endDateTime: PropTypes.string.isRequired,
    observations: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
};

export default EditExtraHourModal;
