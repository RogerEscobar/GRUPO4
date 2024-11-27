import PropTypes from "prop-types";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showDefaultButton = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          <div className="mt-2">{children}</div>
          {showDefaultButton && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-amadeus-primary bg-white border border-transparent rounded-md hover:bg-gray-50 focus:outline-none"
                onClick={onClose}>
                Entendido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showDefaultButton: PropTypes.bool,
};

export default Modal;
