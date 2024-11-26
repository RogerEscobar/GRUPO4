import axios from "axios";
import useAuthStore from "../store/authStore";

const API_URL = "http://localhost:8080/api/extrahours";

// Configuración base de axios
axios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const extraHourService = {
  // Registrar nuevas horas extra
  register: async (data) => {
    try {
      const token = useAuthStore.getState().token;
      const employeeId = useAuthStore.getState().user?.id;

      const response = await axios.post(
        API_URL,
        { ...data, employeeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error(
          "Ya existe un registro de horas extra para este periodo"
        );
      }
      throw new Error("Error al registrar las horas extra");
    }
  },

  // Obtener todas las horas extra con paginación y filtros
  getAll: async (params = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        status,
        sortDirection = "desc",
        sortBy = "startDateTime",
      } = params;

      // Log para depuración
      console.log("Fetching extra hours with params:", {
        page,
        size,
        status,
        sort: `${sortBy},${sortDirection}`,
        employeeId: useAuthStore.getState().user?.id,
      });

      const response = await axios.get(API_URL, {
        params: {
          page,
          size,
          status: status?.toUpperCase(),
          sort: `${sortBy},${sortDirection}`,
          employeeId: useAuthStore.getState().user?.id,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener horas extra:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });

      if (error.response?.status === 403) {
        throw new Error("No tienes permisos para realizar esta acción");
      }

      throw new Error(
        error.response?.data?.message || "Error al obtener las horas extra"
      );
    }
  },

  // Obtener últimos 5 registros
  getLatest: async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: 0,
          size: 5,
          sort: "startDateTime,desc",
          employeeId: useAuthStore.getState().user?.id,
        },
      });
      return response.data.content;
    } catch (error) {
      console.error("Error al obtener últimos registros:", error);
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener los últimos registros"
      );
    }
  },

  // Obtener resumen de horas extra
  getSummary: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/summary`, {
        params: {
          employeeId: useAuthStore.getState().user?.id,
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener resumen:", error);
      throw new Error(
        error.response?.data?.message || "Error al obtener el resumen"
      );
    }
  },
};

export default extraHourService;
