import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { api, TOKEN_KEY } from "../services/api";
import { isTokenExpired } from "../utils/jwtUtils";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      hasRole: (role) => get().user?.roles.includes(role) ?? false,

      login: async (email, password) => {
        const { data } = await api.login(email, password);
        if (!data.success) throw new Error("Credenciales inválidas.");

        const user: AuthUser = {
          id: String(data.usuario_id),
          name: data.name,
          email: data.email,
          roles: data.roles ?? [],
        };

        set({ token: data.access_token, user, isAuthenticated: true });
      },

      logout: async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "sentinel-auth",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          if (isTokenExpired(state.token)) {
            SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
            useAuthStore.setState({
              token: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } else {
            useAuthStore.setState({
              isAuthenticated: !!state.user,
              isLoading: false,
            });
          }
        } else {
          useAuthStore.setState({ isLoading: false });
        }
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
