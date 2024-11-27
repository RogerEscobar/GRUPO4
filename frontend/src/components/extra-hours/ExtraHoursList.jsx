import PropTypes from "prop-types"; // Para validación de props
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useCallback, useState } from "react";
import Alert from "../common/Alert";
import EditExtraHourModal from "./EditExtraHourModal";

// Componente para mostrar el estado con diferentes estilos
const StatusBadge = ({ status }) => {
  const styles = {
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    APROBADA: "bg-green-100 text-green-800",
    RECHAZADA: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

// Validación de props para StatusBadge
StatusBadge.propTypes = {
  status: PropTypes.oneOf(["PENDIENTE", "APROBADA", "RECHAZADA"]).isRequired,
};

// Componente principal para listar las horas extra
const ExtraHoursList = ({
  records,
  showEditButton = true,
  compact = false,
  onUpdate,
}) => {
  // Estados locales para manejar el modal de edición y mensajes
  const [editingRecord, setEditingRecord] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Función que maneja el éxito de la edición
  const handleEditSuccess = useCallback(() => {
    setSuccessMessage("Registro actualizado existosamente");
    setEditingRecord(null);
    if (onUpdate) onUpdate();
    setTimeout(() => setSuccessMessage(null), 3000);
  }, [onUpdate]);

  return (
    <>
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
          className="mb-4"
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              {!compact && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observaciones
                </th>
              )}
              {showEditButton && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(
                    new Date(record.startDateTime),
                    "d 'de' MMMM yyyy, HH:mm",
                    { locale: es }
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.hours.toFixed(1)} horas
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={record.status} />
                </td>
                {!compact && (
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {record.observations}
                    </p>
                  </td>
                )}
                {showEditButton && record.status === "PENDIENTE" && (
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    {console.log("Record a editar:", record)}
                    <button
                      className="text-amadeus-primary hover:text-amadeus-secondary"
                      onClick={() => setEditingRecord(record)}>
                      Editar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {editingRecord && (
        <EditExtraHourModal
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          record={editingRecord}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};

// Validación de props para ExtraHoursList
ExtraHoursList.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      startDateTime: PropTypes.string.isRequired,
      hours: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      observations: PropTypes.string,
    })
  ).isRequired,
  showEditButton: PropTypes.bool,
  compact: PropTypes.bool,
  onUpdate: PropTypes.func,
};

export default ExtraHoursList;
