import PropTypes from "prop-types";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  error,
  maxLength,
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "w-full p-3 border rounded-lg transition-colors focus:outline-none focus:border-amadeus-primary";
  const errorStyles = error ? "border-red-500" : "";

  return (
    <div className="space-y-1">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={disabled}
        className={`${baseStyles} ${errorStyles} ${className}`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  error: PropTypes.string,
  maxLength: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
