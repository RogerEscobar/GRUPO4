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

function LoginPage() {
  // Estados para el manejo del formulario
  const [userId, setUserId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("id"); // 'id' para cédula, 'code' para código de verificación
  const [error, setError] = useState(null);

  // Hooks para navegación y manejo de autenticación
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Manejador para el envío de cédula
  const handleIdSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Intentando enviar código a:", userId); // Nuevo console.log
      await authService.sendVerificationCode(userId);
      console.log("Código enviado exitosamente"); // Nuevo console.log
      setStep("code");
      setError(null);
    } catch (error) {
      console.error("Error completo:", error); // Nuevo console.log
      setError(error.response?.data?.message || "Usuario no encontrado");
    }
  };

  // Manejador para la verificación del código
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.verifyCode(userId, verificationCode);
      setAuth(response.token, response.user);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Código inválido");
      console.error("Error al verificar código:", error);
    }
  };

  return (
    // Contenedor principal con fondo degradado
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amadeus-primary to-amadeus-secondary">
      {/* Card principal de login */}
      <Card className="w-96">
        {/* Logo de Amadeus */}
        <div className="flex justify-center items-center w-32 h-16 mx-auto mb-8">
          <LogoDark className="w-full h-full" />
        </div>

        {/* Título dinámico según el paso actual */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === "id" ? "Bienvenido a ExtraHours" : "Ingresa el código"}
        </h2>

        {/* Alerta de error si existe */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Formulario condicional según el paso actual */}
        {step === "id" ? (
          // Formulario para ingresar cédula
          <LoginForm
            onSubmit={handleIdSubmit}
            buttonText="Continuar"
            inputValue={userId}
            onInputChange={(e) => setUserId(e.target.value)}
            placeholder="Número de cédula"
          />
        ) : (
          // Formulario para ingresar código de verificación
          <LoginForm
            onSubmit={handleCodeSubmit}
            buttonText="Verificar"
            inputValue={verificationCode}
            onInputChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Código de verificación"
            maxLength="6"
          />
        )}
      </Card>
    </div>
  );
}

export default LoginPage;
