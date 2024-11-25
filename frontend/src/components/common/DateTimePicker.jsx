import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Alert from "./Alert";

const DateTimePicker = ({
  value,
  onChange,
  min,
  max,
  placeholder = "Seleccione fecha y hora",
  required = false,
}) => {
  // Estados base
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );
  const [validationMessage, setValidationMessage] = useState("");

  // Estados para tiempo en formato 12h
  const [hours, setHours] = useState(
    value ? new Date(value).getHours() % 12 || 12 : 12
  );
  const [minutes, setMinutes] = useState(
    value ? new Date(value).getMinutes() : 0
  );
  const [period, setPeriod] = useState(
    value ? (new Date(value).getHours() >= 12 ? "PM" : "AM") : "AM"
  );

  const pickerRef = useRef(null);

  // Constantes para el calendario
  const DAYS_OF_WEEK = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
  const MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Actualizar estados cuando cambia el valor externo
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setHours(date.getHours() % 12 || 12);
      setMinutes(date.getMinutes());
      setPeriod(date.getHours() >= 12 ? "PM" : "AM");
    }
  }, [value]);

  // Cerrar el picker al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
        setValidationMessage("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validación de rango de fechas
  const validateRange = (date) => {
    const maxDate = max ? new Date(max) : new Date();
    const minDate = min ? new Date(min) : null;

    if (date > maxDate) {
      return {
        isValid: false,
        message: "No se pueden seleccionar fechas futuras",
      };
    }

    if (minDate && date < minDate) {
      return {
        isValid: false,
        message: "La fecha debe ser posterior a la fecha de inicio",
      };
    }

    return { isValid: true, message: "" };
  };

  // Funciones de calendario
  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDay = date.getDay();

    // Días del mes anterior
    for (let i = 0; i < firstDay; i++) {
      const prevDate = new Date(year, month, -i);
      days.unshift({
        date: prevDate.getDate(),
        month: "prev",
        full: prevDate,
      });
    }

    // Días del mes actual
    while (date.getMonth() === month) {
      days.push({
        date: date.getDate(),
        month: "current",
        full: new Date(date),
      });
      date.setDate(date.getDate() + 1);
    }

    // Completar mes
    while (days.length < 42) {
      const nextDate = new Date(date);
      days.push({
        date: nextDate.getDate(),
        month: "next",
        full: nextDate,
      });
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const changeMonth = (increment) => {
    const newDate = new Date(selectedDate || new Date());
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  // Manejadores de eventos
  const handleDateSelect = (day) => {
    const rangeValidation = validateRange(day.full);
    if (!rangeValidation.isValid) {
      setValidationMessage(rangeValidation.message);
      return;
    }

    const newDate = new Date(day.full);
    const hours24 =
      period === "PM"
        ? hours === 12
          ? 12
          : hours + 12
        : hours === 12
        ? 0
        : hours;

    newDate.setHours(hours24, minutes);
    setSelectedDate(newDate);
    setValidationMessage("");
    onChange(newDate.toISOString());
  };

  const handleTimeChange = (type, increment) => {
    let newHours = hours;
    let newMinutes = minutes;
    let newPeriod = period;
    let newDate = selectedDate ? new Date(selectedDate) : new Date();

    switch (type) {
      case "hours":
        newHours = hours + increment;
        if (newHours > 12) newHours = 1;
        if (newHours < 1) newHours = 12;
        break;
      case "minutes":
        newMinutes = (minutes + increment + 60) % 60;
        break;
      case "period":
        newPeriod = period === "AM" ? "PM" : "AM";
        break;
      default:
        break;
    }

    const hours24 =
      newPeriod === "PM"
        ? newHours === 12
          ? 12
          : newHours + 12
        : newHours === 12
        ? 0
        : newHours;

    newDate.setHours(hours24, newMinutes);

    setHours(newHours);
    setMinutes(newMinutes);
    setPeriod(newPeriod);

    if (selectedDate) {
      setSelectedDate(newDate);
      onChange(newDate.toISOString());
    }

    setValidationMessage("");
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div className="relative">
        <input
          type="text"
          className={`input input-bordered w-full pr-10 ${
            required && !value ? "input-error" : ""
          }`}
          value={
            selectedDate
              ? selectedDate.toLocaleString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""
          }
          placeholder={placeholder}
          onClick={() => setShowPicker(!showPicker)}
          readOnly
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <i className="fa fa-calendar"></i>
        </div>
      </div>

      {validationMessage && (
        <div className="mt-1">
          <Alert
            type="warning"
            message={validationMessage}
            onClose={() => setValidationMessage("")}
          />
        </div>
      )}

      {showPicker && (
        <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-64">
          <div className="flex justify-between items-center p-3 border-b">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded">
              ‹
            </button>
            <span className="font-medium">
              {selectedDate
                ? `${
                    MONTHS[selectedDate.getMonth()]
                  } ${selectedDate.getFullYear()}`
                : `${
                    MONTHS[new Date().getMonth()]
                  } ${new Date().getFullYear()}`}
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-gray-100 rounded">
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 p-2 text-center">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 p-2">
            {getDaysInMonth(
              selectedDate?.getFullYear() || new Date().getFullYear(),
              selectedDate?.getMonth() || new Date().getMonth()
            ).map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDateSelect(day)}
                className={`
                  p-2 text-sm rounded-full
                  ${day.month === "current" ? "text-gray-900" : "text-gray-400"}
                  ${
                    !validateRange(day.full).isValid
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-amadeus-primary hover:text-white"
                  }
                  ${
                    selectedDate &&
                    day.full.toDateString() === selectedDate.toDateString()
                      ? "bg-amadeus-primary text-white"
                      : ""
                  }
                `}
                disabled={!validateRange(day.full).isValid}>
                {day.date}
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-4">
              {/* Horas */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleTimeChange("hours", 1)}
                  className="p-2 hover:bg-gray-100 rounded text-amadeus-primary">
                  ▲
                </button>
                <span className="w-10 text-center font-mono text-lg">
                  {hours.toString().padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => handleTimeChange("hours", -1)}
                  className="p-2 hover:bg-gray-100 rounded text-amadeus-primary">
                  ▼
                </button>
              </div>

              <span className="text-xl font-bold">:</span>

              {/* Minutos */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleTimeChange("minutes", 1)}
                  className="p-2 hover:bg-gray-100 rounded text-amadeus-primary">
                  ▲
                </button>
                <span className="w-10 text-center font-mono text-lg">
                  {minutes.toString().padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => handleTimeChange("minutes", -1)}
                  className="p-2 hover:bg-gray-100 rounded text-amadeus-primary">
                  ▼
                </button>
              </div>

              {/* AM/PM */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleTimeChange("period", 1)}
                  className="p-2 hover:bg-gray-100 rounded text-amadeus-primary">
                  ▲
                </button>
                <span className="w-16 text-center font-mono text-lg">
                  {period}
                </span>
                <button
                  type="button"
                  onClick={() => handleTimeChange("period", -1)}
                  className="p-2 hover:bg-gray-100 rounded text-amadeus-primary">
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DateTimePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.string,
  max: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default DateTimePicker;
