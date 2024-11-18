import { create } from "zustand";
import { persist } from "zustand/middleware";

// Crear store para manejo de autenticación
const useAuthStore = create(
  persist(
    (set) => ({
      // Estado inicial
      token: null,
      user: null,
      isAuthenticated: false,

      // Acción para establecer autenticación
      setAuth: (token, userData) =>
        set({
          token,
          user: userData,
          isAuthenticated: true,
        }),

      // Acción para cerrar sesión
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      // Configuración de persistencia
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
