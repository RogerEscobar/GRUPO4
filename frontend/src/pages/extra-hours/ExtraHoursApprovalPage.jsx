import { useEffect, useState } from "react";
import ExtraHoursTable from "../../components/extra-hours/ExtraHoursTable";
import Card from "../../components/common/Card";
import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import extraHourService from "../../services/extraHourService"; // Importa el servicio

const ExtraHoursApprovalPage = () => {
  const [extraHours, setExtraHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExtraHours = async () => {
      try {
        const data = await extraHourService.getAllExtraHours(); // Llama al servicio
        setExtraHours(data); // Asigna los datos obtenidos al estado
        setLoading(false);
      } catch {
        setError("Error al cargar las horas extras.");
        setLoading(false);
      }
    };

    fetchExtraHours();
  }, []);

  const handleApprove = async (id) => {
    try {
      // Lógica para aprobar la hora extra (puedes agregar un servicio para esto)
      await extraHourService.approveExtraHour(id); // Asegúrate de tener este método en tu servicio
      setExtraHours((prevHours) => prevHours.filter((hour) => hour.id !== id));
      setMessage(`Horas extra con ID: ${id} aprobadas.`);
    } catch {
      setError("Error al aprobar la hora extra.");
    }
  };

  const handleReject = async (id) => {
    try {
      // Lógica para rechazar la hora extra (puedes agregar un servicio para esto)
      await extraHourService.rejectExtraHour(id); // Asegúrate de tener este método en tu servicio
      setExtraHours((prevHours) => prevHours.filter((hour) => hour.id !== id));
      setMessage(`Horas extra con ID: ${id} rechazadas.`);
    } catch {
      setError("Error al rechazar la hora extra.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amadeus-primary to-amadeus-secondary">
      <Card className="w-full max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Gestión de Horas Extras
        </h1>
        {loading && <Loading fullScreen />}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
        {message && (
          <Alert
            type="success"
            message={message}
            onClose={() => setMessage(null)}
          />
        )}
        <ExtraHoursTable
          extraHours={extraHours}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </Card>
    </div>
  );
};

export default ExtraHoursApprovalPage;
