import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import extraHourService from "../../services/extraHourService";
import ExtraHoursList from "./ExtraHoursList";
import Alert from "../common/Alert";

const ExtraHoursSummaryCard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [latestRecords, setLatestRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Obtener los últimos registros primero
      const latestData = await extraHourService.getLatest();
      setLatestRecords(latestData);

      try {
        // Intentar obtener el resumen
        const summaryData = await extraHourService.getSummary(
          startDate.toISOString(),
          endDate.toISOString()
        );
        setSummary(summaryData);
      } catch (summaryError) {
        console.error("Error al cargar el resumen:", summaryError);
        // No establecer error general si solo falla el resumen
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError("Error al cargar los datos. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  const handleHistoryClick = () => {
    console.log("Navegando al historial");
    navigate("/dashboard/extra-hours/history");
  };

  return (
    <div>
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {summary ? (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Resumen del Mes Actual
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Horas</p>
              <p className="text-lg font-semibold">
                {summary.totalHours.toFixed(2)} hrs
              </p>
            </div>
            <div className="flex items-centrer justify-beteen">
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-lg font-semibold">
                  {summary.pendingHours.toFixed(2)}{" "}
                </p>
              </div>
              {summary.pendingCount > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {summary.pendingCount}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aprobadas</p>
                <p className="text-lg font-semibold">
                  {summary.approvedHours.toFixed(2)} hrs
                </p>
              </div>
              {summary.approvedCount > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {summary.approvedCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          Últimos Registros
        </h3>
        {latestRecords.length > 0 ? (
          <ExtraHoursList
            records={latestRecords}
            showEditButton={true}
            compact={true}
          />
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay registros disponibles
          </p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleHistoryClick}
          className="w-full bg-amadeus-primary text-white py-2 px-4 rounded-md hover:bg-amadeus-secondary transition-colors">
          Ver Historial
        </button>
      </div>
    </div>
  );
};

export default ExtraHoursSummaryCard;
