'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { UserProvider, useUser } from './contexts/UserContext';

const inter = Inter({ subsets: ["latin"] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Verificar se o usuário é administrador (nível 3 ou superior)
  const isAdmin = user?.permissoes?.some(permissao => permissao.perfil.nivel >= 3);

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Serviços Hospitalares</h1>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="text-sm text-right">
                    <div className="font-medium">{user.funcionario.nome}</div>
                    <div className="text-blue-200">{user.funcionario.setor?.nome}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-blue-600"
                    onClick={() => window.location.href = '/perfil'}
                  >
                    Meu Perfil
                  </Button>
                  {isAdmin && (
                    <a
                      href="/admin/permissions"
                      className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm font-medium"
                    >
                      Admin
                    </a>
                  )}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-blue-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLogin(true)}
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </nav>
        
        {showLogin && !user && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Login</h2>
                <Button
                  onClick={() => setShowLogin(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <LoginModal onLogin={() => {
                setShowLogin(false);
              }} />
            </div>
          </div>
        )}

        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}

// Componente de login modal
function LoginModal({ onLogin }: { onLogin: () => void }) {
  const { setUser } = useUser();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const cpfLimpo = cpf.replace(/\D/g, '');
      
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf: cpfLimpo, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no login');
      }

      const data = await response.json();
      
      // Salvar dados do usuário e token no localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.access_token);
      
      setUser(data.user);
      onLogin();
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
          CPF
        </label>
        <input
          type="text"
          id="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="000.000.000-00"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite sua senha"
          required
        />
      </div>
      
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  );
}
