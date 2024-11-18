import PropTypes from "prop-types";
import Button from "../common/Button";
import Input from "../common/Input";

const LoginForm = ({
  onSubmit,
  buttonText,
  inputValue,
  onInputChange,
  placeholder,
  maxLength,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        value={inputValue}
        onChange={onInputChange}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      <Button type="submit" fullWidth>
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
  placeholder: PropTypes.string.isRequired,
  maxLength: PropTypes.string,
};

export default LoginForm;
