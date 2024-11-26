import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ExtraHoursList from "../../components/extra-hours/ExtraHoursList";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import extraHourService from "../../services/extraHourService";

const HistoryPage = () => {
  // Hook de navegación
  const navigate = useNavigate();

  // Estados para manejar los datos y la UI
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    sortBy: "startDateTime",
    sortDirection: "desc",
  });

  // Función para cargar los registros
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Log para depuración
      console.log("Solicitando registros con filtros:", {
        page: currentPage,
        size: 10,
        ...filters,
      });

      const response = await extraHourService.getAll({
        page: currentPage,
        size: 10,
        ...filters,
      });

      // Log de respuesta
      console.log("Registros recibidos:", response);

      setRecords(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error al cargar registros:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  // Efecto para cargar los datos cuando cambian los filtros o la página
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // Manejador de cambios en los filtros
  const handleFilterChange = useCallback((newFilters) => {
    console.log("Cambiando filtros:", newFilters);
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      console.log("Nuevos filtros:", updated);
      return updated;
    });
    setCurrentPage(0);
  }, []);

  // Manejador para volver al dashboard
  const handleBack = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <div className="p-6">
          {/* Encabezado con título y botón de regreso */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-amadeus-primary">
              Historial de Horas Extra
            </h2>
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Volver al Registro
            </Button>
          </div>

          {/* Mostrar errores si existen */}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}

          {/* Filtros */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <select
                className="form-select rounded-md border-gray-300"
                value={filters.status}
                onChange={(e) =>
                  handleFilterChange({ status: e.target.value })
                }>
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="APROBADO">Aprobado</option>
                <option value="RECHAZADO">Rechazado</option>
              </select>

              <select
                className="form-select rounded-md border-gray-300"
                value={filters.sortDirection}
                onChange={(e) =>
                  handleFilterChange({ sortDirection: e.target.value })
                }>
                <option value="desc">Más recientes primero</option>
                <option value="asc">Más antiguas primero</option>
              </select>
            </div>
          </div>

          {/* Contenido principal */}
          {loading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : (
            <>
              <ExtraHoursList records={records} showEditButton={false} />

              {/* Paginación */}
              <div className="flex justify-center space-x-2 mt-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                  className="px-4 py-2 border rounded-md disabled:opacity-50">
                  Anterior
                </button>
                <span className="px-4 py-2">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50">
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HistoryPage;
