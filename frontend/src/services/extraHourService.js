import axios from "axios";

const API_URL = "http://localhost:8080/api/extrahours";

const extraHourService = {
  // Registrar nuevas horas extra
  register: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error("Error en registro de horas extra:", error.response?.data);
      throw error;
    }
  },

  // Obtener todas las horas extra del usuario
  getAll: async (filters = {}) => {
    try {
      const response = await axios.get(API_URL, { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error al obtener horas extra:", error.response?.data);
      throw error;
    }
  },

  // Obtener resumen de horas extra
  getSummary: async (employeeId, startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/summary`, {
        params: { employeeId, startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener resumen:", error.response?.data);
      throw error;
    }
  },
};

export default extraHourService;
