import PropTypes from "prop-types";
import Button from "../common/Button";

const ExtraHoursTable = ({ extraHours, onApprove, onReject }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-powder-blue">
          {" "}
          {/* Cambia el color de fondo aquí */}
          <th className="p-4 border-b text-left">ID</th>
          <th className="p-4 border-b text-left">Empleado</th>
          <th className="p-4 border-b text-left">Horas</th>
          <th className="p-4 border-b text-left">Estado</th>
          <th className="p-4 border-b text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {extraHours.map((extraHour) => (
          <tr key={extraHour.id} className="hover:bg-gray-50">
            <td className="p-4 border-b text-left">{extraHour.id}</td>
            <td className="p-4 border-b text-left">{extraHour.employeeId}</td>
            <td className="p-4 border-b text-left">{extraHour.hours}</td>
            <td className="p-4 border-b text-left">{extraHour.status}</td>
            <td className="p-4 border-b text-center">
              <Button onClick={() => onApprove(extraHour.id)} className="mx-2">
                Aprobar
              </Button>
              <Button onClick={() => onReject(extraHour.id)} className="mx-2">
                Rechazar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
ExtraHoursTable.propTypes = {
  extraHours: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      employeeName: PropTypes.string.isRequired,
      startDateTime: PropTypes.string.isRequired,
      endDateTime: PropTypes.string.isRequired,
    })
  ).isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default ExtraHoursTable;
