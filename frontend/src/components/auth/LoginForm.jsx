import PropTypes from "prop-types";
import Button from "../common/Button";
import Input from "../common/Input";
import Alert from "../common/Alert";
import { useState } from "react";

const LoginForm = ({
  onSubmit,
  buttonText,
  inputValue,
  onInputChange,
  maxLength,
  isCodeInput = false,
}) => {
  const [error, setError] = useState(null);

  //Validar que solo se ingresen números
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      onInputChange(e);
      setError(null);
    } else {
      setError("Solo se permiten números en este campo");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {isCodeInput ? "Código de veriicación" : "Número de cédula"}
        </label>
        <Input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={
            isCodeInput
              ? "Ingresa el código de 6 digitos"
              : "Ingresa solo números"
          }
          maxLength={maxLength}
        />
        {error && <Alert type="error" message="{error}" />}
      </div>
      <Button type="submit" fullWidth className="mt-4">
        {buttonText}
      </Button>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  maxLength: PropTypes.string,
  isCodeInput: PropTypes.bool,
};

export default LoginForm;
