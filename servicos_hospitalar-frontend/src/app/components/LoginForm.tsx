'use client';

import { useState } from 'react';

interface LoginFormProps {
  onLogin: (cpf: string, password: string) => void;
  loading?: boolean;
  error?: string | null;
}

export default function LoginForm({ onLogin, loading = false, error }: LoginFormProps) {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  // Função simples para formatar CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    setCpf(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(cpf, password);
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistema Hospitalar
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Faça login para acessar os sistemas
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="cpf" className="sr-only">
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="CPF"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                inputMode="numeric"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-sm text-center">
            <p className="text-gray-600">
              Usuários de teste:
            </p>
            <p className="text-gray-500 text-xs mt-1">
              CPF: 00000000000 / Senha: admin123
            </p>
            <p className="text-gray-500 text-xs">
              CPF: 11111111111 / Senha: admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 