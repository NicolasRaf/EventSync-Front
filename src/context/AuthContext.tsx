import { createContext, useCallback, useState, type ReactNode } from 'react';
import api from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@EventSync:token');
    const user = localStorage.getItem('@EventSync:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await api.post('/sessions', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('@EventSync:token', token);
    localStorage.setItem('@EventSync:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@EventSync:token');
    localStorage.removeItem('@EventSync:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, isAuthenticated: !!data.user }}>
      {children}
    </AuthContext.Provider>
  );
}
