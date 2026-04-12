import React, { createContext, ReactNode, useContext, useState } from 'react';
import { api } from '../services/api';

export type UserRole = 'admin' | null;

export interface AuthUser {
  id:    string;
  name:  string;
  email: string;
  role:  UserRole;
}

interface AuthContextType {
  user:            AuthUser | null;
  isAuthenticated: boolean;
  role:            UserRole;
  login:           (email: string, password: string) => Promise<void>;
  logout:          () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Ingresa tus credenciales.');
    const { data } = await api.login(email, password);
    if (!data.success) throw new Error('Credenciales inválidas.');
    setUser({ id: String(data.admin_id), name: data.name, email: data.email, role: 'admin' });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, role: user?.role ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
