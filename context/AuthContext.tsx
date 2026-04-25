import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface AuthUser {
  id:    string;
  name:  string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user:            AuthUser | null;
  isAuthenticated: boolean;
  hasRole:         (role: string) => boolean;
  login:           (email: string, password: string) => Promise<void>;
  logout:          () => void;
}

const VALID_CREDENTIALS = [
  { email: 'admin@sentinel.com',    password: 'admin123',    name: 'Admin Sentinel',   id: '1', roles: ['admin'] },
  { email: 'director@sentinel.com', password: 'director123', name: 'Director General', id: '2', roles: ['admin'] },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Ingresa tus credenciales.');
    await new Promise(res => setTimeout(res, 900));
    const match = VALID_CREDENTIALS.find(
      c => c.email === email.toLowerCase().trim() && c.password === password
    );
    if (!match) throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
    setUser({ id: match.id, name: match.name, email: match.email, roles: match.roles });
  };

  const hasRole = (role: string) => user?.roles.includes(role) ?? false;

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, hasRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
