'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FuncionariosBusca from './components/FuncionariosBusca';
import SetoresList from './components/SetoresList';
import VinculosList from './components/VinculosList';
import TiposEtiquetasList from './components/TiposEtiquetasList';
import DashboardStats from './components/DashboardStats';
import RelatoriosGrid from './components/RelatoriosGrid';
import { api } from '@/lib/api';

interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  matricula: string;
  setor?: {
    id: string;
    nome: string;
  } | null;
}

interface User {
  id: string;
  funcionario: Funcionario;
  permissoes: any[];
}

export default function SistemaGP() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [totais, setTotais] = useState({
    funcionarios: 0,
    setores: 0
  });
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        carregarTotais(); // Carregar totais após verificar usuário
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const carregarTotais = async () => {
    try {
      const [funcionariosRes, setoresRes] = await Promise.all([
        api.get('/funcionarios'),
        api.get('/setores')
      ]);

      setTotais({
        funcionarios: funcionariosRes.data.length,
        setores: setoresRes.data.length
      });
    } catch (error) {
      console.error('Erro ao carregar totais:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'funcionarios', name: 'Funcionários', icon: '👥' },
    { id: 'setores', name: 'Setores', icon: '🏢' },
    { id: 'vinculos', name: 'Vínculos', icon: '🔗' },
    { id: 'tipos-etiquetas', name: 'Tipos de Etiquetas', icon: '🏷️' },
    { id: 'usuarios', name: 'Usuários do Sistema', icon: '🔐' },
    { id: 'relatorios', name: 'Relatórios', icon: '📈' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard - Sistema GP</h2>
            <DashboardStats />
          </div>
        );
      case 'funcionarios':
        return (
          <div className="p-6">
            <FuncionariosBusca />
          </div>
        );
      case 'setores':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Setores</h2>
            <SetoresList />
          </div>
        );
      case 'vinculos':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Vínculos</h2>
            <VinculosList />
          </div>
        );
      case 'tipos-etiquetas':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestão de Tipos de Etiquetas</h2>
            <TiposEtiquetasList />
          </div>
        );
      case 'usuarios':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Usuários do Sistema</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600">Funcionalidade em desenvolvimento...</p>
            </div>
          </div>
        );
      case 'relatorios':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Relatórios</h2>
            <RelatoriosGrid />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema GP - Gestão de Pessoal
              </h1>
              <p className="text-sm text-gray-600">
                Bem-vindo, {user.funcionario.nome} {user.funcionario.setor && `(${user.funcionario.setor.nome})`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user.funcionario.cpf} | {user.funcionario.matricula}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Totais */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6 py-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">👥</span>
              <span className="text-sm text-gray-600">Total de Funcionários:</span>
              <span className="text-sm font-bold text-gray-900">{totais.funcionarios}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">🏢</span>
              <span className="text-sm text-gray-600">Total de Setores:</span>
              <span className="text-sm font-bold text-gray-900">{totais.setores}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="mt-8">
            <div className="px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md mb-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
} 