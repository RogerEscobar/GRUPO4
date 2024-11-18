import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const authService = {
  sendVerificationCode: async (userId) => {
    try {
      console.log("Intentando enviar código a:", userId);

      const response = await axios.post(
        `${API_URL}/send-code`,
        { userId }, // Enviado como JSON
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Código enviado exitosamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al enviar código:", {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  verifyCode: async (userId, verificationCode) => {
    try {
      const response = await axios.post(
        `${API_URL}/verify`,
        {
          userId,
          verificationCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al verificar código:", error.response?.data);
      throw error;
    }
  },
};

export default authService;
