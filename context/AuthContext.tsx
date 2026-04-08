import React, { createContext, ReactNode, useContext, useState } from 'react';
 
export type UserRole = 'admin' | 'user' | null;
 
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
  login:           (email: string, password: string, role: UserRole) => Promise<void>;
  logout:          () => void;
}
 
const AuthContext = createContext<AuthContextType | null>(null);
 
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
 
  const login = async (email: string, _password: string, role: UserRole) => {
    // Ruta backend: POST /api/auth/login
    await new Promise(res => setTimeout(res, 800));
    if (!email) throw new Error('Credenciales inválidas');
    setUser({
      id:    role === 'admin' ? '1' : '2',
      name:  role === 'admin' ? 'Admin Sentinel' : 'Sarai Díaz',
      email,
      role,
    });
  };
 
  const logout = () => setUser(null);
 
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, role: user?.role ?? null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}