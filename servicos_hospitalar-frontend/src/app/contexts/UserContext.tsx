'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  matricula: string;
  setor?: {
    id: string;
    nome: string;
    descricao?: string;
  } | null;
}

interface Permissao {
  id: string;
  sistema: {
    id: string;
    nome: string;
    descricao?: string;
  };
  perfil: {
    id: string;
    nome: string;
    nivel: number;
  };
}

interface User {
  id: string;
  funcionario: Funcionario;
  permissoes: Permissao[];
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 