// Importaciones de React y React Router
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importaciones de estado y servicios
import useAuthStore from "../../store/authStore";
import authService from "../../services/authService";

// Importaciones de componentes
import LoginForm from "../../components/auth/LoginForm";
import Card from "../../components/common/Card";
import Alert from "../../components/common/Alert";
import { LogoDark } from "../../components/common/LogoDark";
import Modal from "../../components/common/Modal";

function LoginPage() {
  // Estados para el manejo del formulario
  const [userId, setUserId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("id"); // 'id' para cédula, 'code' para código de verificación
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Hooks para navegación y manejo de autenticación
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Manejador para el envío de cédula
  const handleIdSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.sendVerificationCode(userId);
      setShowSuccessModal(true);
      setStep("code");
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Usuario no encontrado");
      console.error("Error al enviar código:", error);
    }
  };

  // Manejador para la verificación del código
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.verifyCode(userId, verificationCode);
      setAuth(response.token, {
        id: userId,
        name: response.userName,
        role: response.userRole,
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Código inválido");
      console.error("Error al verificar código:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amadeus-primary to-amadeus-secondary">
      <Card className="w-96">
        {/* Logo */}
        <div className="flex justify-center items-center w-32 h-16 mx-auto mb-8">
          <LogoDark className="w-full h-full" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === "id" ? "Bienvenido a ExtraHours" : "Ingresa el código"}
        </h2>

        {/* Mensajes de error */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Formularios */}
        {step === "id" ? (
          <LoginForm
            onSubmit={handleIdSubmit}
            buttonText="Continuar"
            inputValue={userId}
            onInputChange={(e) => setUserId(e.target.value)}
            placeholder="Ingresa solo números"
            label="Número de cédula"
            isCodeInput={false}
          />
        ) : (
          <LoginForm
            onSubmit={handleCodeSubmit}
            buttonText="Verificar"
            inputValue={verificationCode}
            onInputChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Ingresa el código de 6 dígitos"
            maxLength="6"
            label="Código de verificación"
            isCodeInput={true}
          />
        )}
      </Card>

      {/* Modal de confirmación */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Código Enviado">
        <p className="text-sm text-gray-500">
          Se ha enviado un código de verificación al correo electrónico
          registrado. Por favor, revisa tu bandeja de entrada.
        </p>
      </Modal>
    </div>
  );
}

export default LoginPage;
