// Importaciones de React y PropTypes
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";

const TimeRangeSelector = ({ onTimeChange }) => {
  // Estados para fecha y hora de inicio
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startPeriod, setStartPeriod] = useState("AM");

  // Estados para fecha y hora de fin
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endPeriod, setEndPeriod] = useState("AM");

  // Generar opciones de hora (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return hour < 10 ? `0${hour}` : hour.toString();
  });

  // Generar opciones de minutos (00-59, intervalos de 15)
  const minutes = ["00", "15", "30", "45"];

  // Memoizar la función de cambio para evitar warnings de dependencias
  const handleTimeChange = useCallback(() => {
    if (startDate && startTime && endDate && endTime) {
      onTimeChange({
        start: {
          date: startDate,
          time: startTime,
          period: startPeriod,
        },
        end: {
          date: endDate,
          time: endTime,
          period: endPeriod,
        },
      });
    }
  }, [
    startDate,
    startTime,
    startPeriod,
    endDate,
    endTime,
    endPeriod,
    onTimeChange,
  ]);

  // Efecto para notificar cambios al componente padre
  useEffect(() => {
    handleTimeChange();
  }, [handleTimeChange]);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        {/* Selector de fecha y hora de inicio */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Inicio</label>
          <div className="flex gap-2">
            {/* Input para fecha */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered flex-1"
            />
            {/* Select para hora */}
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="select select-bordered">
              <option value="">Hora</option>
              {hours.map((hour) =>
                minutes.map((minute) => (
                  <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
                    {`${hour}:${minute}`}
                  </option>
                ))
              )}
            </select>
            {/* Select para AM/PM */}
            <select
              value={startPeriod}
              onChange={(e) => setStartPeriod(e.target.value)}
              className="select select-bordered w-24">
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>

        {/* Selector de fecha y hora de fin */}
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium text-gray-700">Fin</label>
          <div className="flex gap-2">
            {/* Input para fecha */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered flex-1"
            />
            {/* Select para hora */}
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="select select-bordered">
              <option value="">Hora</option>
              {hours.map((hour) =>
                minutes.map((minute) => (
                  <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
                    {`${hour}:${minute}`}
                  </option>
                ))
              )}
            </select>
            {/* Select para AM/PM */}
            <select
              value={endPeriod}
              onChange={(e) => setEndPeriod(e.target.value)}
              className="select select-bordered w-24">
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Definición de PropTypes
TimeRangeSelector.propTypes = {
  onTimeChange: PropTypes.func.isRequired,
};

export default TimeRangeSelector;
