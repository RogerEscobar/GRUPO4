import PropTypes from "prop-types";

const Loading = ({ size = "medium", fullScreen = false }) => {
  // Clases para diferentes tamaños del spinner
  const sizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  // Componente base del spinner
  const Spinner = () => (
    <div className={`${sizes[size]} animate-spin`}>
      <div className="h-full w-full border-4 border-amadeus-primary border-t-transparent rounded-full" />
    </div>
  );

  // Si es pantalla completa, centramos en la pantalla
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <Spinner />
      </div>
    );
  }

  // Si no es pantalla completa, solo mostramos el spinner
  return <Spinner />;
};

Loading.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  fullScreen: PropTypes.bool,
};

export default Loading;
