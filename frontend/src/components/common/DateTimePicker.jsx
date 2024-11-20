import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

const DateTimePicker = ({
  selectedDate,
  onChange,
  label,
  error,
  minDate,
  maxDate,
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="dd/MM/yyyy HH:mm"
        className="w-full p-2 border rounded-md focus:ring-1 focus:ring-amadeus-primary"
        locale={es}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText="Seleccione fecha y hora"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

DateTimePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
};

export default DateTimePicker;
