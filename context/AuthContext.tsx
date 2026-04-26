import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api, TOKEN_KEY } from '../services/api';

export interface AuthUser {
  id:    string;
  name:  string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user:            AuthUser | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  hasRole:         (role: string) => boolean;
  login:           (email: string, password: string) => Promise<void>;
  logout:          () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al arrancar la app, verifica si hay un token guardado y restaura la sesión
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const raw   = await SecureStore.getItemAsync('sentinel_user');
        if (token && raw) {
          setUser(JSON.parse(raw));
        }
      } catch {
        // Token corrupto o expirado — sesión limpia
        await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
        await SecureStore.deleteItemAsync('sentinel_user').catch(() => {});
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Ingresa tus credenciales.');

    const { data } = await api.login(email, password);

    if (!data.success) throw new Error('Credenciales inválidas.');

    const authUser: AuthUser = {
      id:    String(data.usuario_id),
      name:  data.name,
      email: data.email,
      roles: data.roles ?? [],
    };

    // Persiste el token y los datos del usuario de forma segura
    await SecureStore.setItemAsync(TOKEN_KEY, data.access_token);
    await SecureStore.setItemAsync('sentinel_user', JSON.stringify(authUser));

    setUser(authUser);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    await SecureStore.deleteItemAsync('sentinel_user').catch(() => {});
    setUser(null);
  };

  const hasRole = (role: string) => user?.roles.includes(role) ?? false;

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading, hasRole, login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
