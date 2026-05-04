import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { logActionToSheet } from '../services/googleSheetsService';

export type Role = 'admin' | 'production' | 'livreur' | null;

export interface User {
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('darkom_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch(e) {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('darkom_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('darkom_user');
    }
  }, [user]);

  const login = (name: string, role: Role) => {
    setUser({ name, role });
    logActionToSheet(name, 'LOGIN', { role });
  };

  const logout = () => {
    if (user) {
      logActionToSheet(user.name, 'LOGOUT', { role: user.role });
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
