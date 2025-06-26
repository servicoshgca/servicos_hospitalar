'use client';

import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Building, IdCard, Shield, Settings, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import LogsViewer from '../sistemas/gp/components/LogsViewer';

interface Sistema {
  id: string;
  nome: string;
  descricao?: string;
  nivel: number;
}

export default function PerfilPage() {
  const { user } = useUser();
  const router = useRouter();
  const [sistemas, setSistemas] = useState<Sistema[]>([]);

  useEffect(() => {
    // Converter permissões do usuário em sistemas disponíveis
    if (user && user.permissoes) {
      const sistemasDisponiveis = user.permissoes.map(permissao => ({
        id: permissao.sistema.id,
        nome: permissao.sistema.nome,
        descricao: permissao.sistema.descricao,
        nivel: permissao.perfil.nivel
      }));
      setSistemas(sistemasDisponiveis);
    } else {
      setSistemas([]);
    }
  }, [user]);

  const handleSistemaClick = (sistema: Sistema) => {
    const nome = sistema.nome.toLowerCase();
    if (nome.includes('gp')) {
      window.location.href = '/sistemas/gp';
    } else if (nome.includes('ascom')) {
      window.location.href = '/sistemas/ascom';
    } else if (nome.includes('refeitório') || nome.includes('refeitorio')) {
      window.location.href = '/sistemas/refeitorio';
    } else {
      alert(`Acessando ${sistema.nome} com nível ${sistema.nivel}`);
    }
  };

  const getNivelText = (nivel: number) => {
    switch (nivel) {
      case 1: return 'Usuário';
      case 2: return 'Gestor';
      case 3: return 'Administrador';
      default: return 'Nível ' + nivel;
    }
  };

  const getNivelColor = (nivel: number) => {
    switch (nivel) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Verificar se o usuário é administrador (nível 3 ou superior)
  const isAdmin = user?.permissoes?.some(permissao => permissao.perfil.nivel >= 3);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado para acessar esta página.</p>
          <Button onClick={() => router.push('/')}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do Usuário */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.funcionario.nome}</h3>
                    <p className="text-sm text-gray-600">Funcionário</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <IdCard className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">CPF:</span>
                    <span>{user.funcionario.cpf}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <IdCard className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Matrícula:</span>
                    <span>{user.funcionario.matricula}</span>
                  </div>

                  {user.funcionario.setor && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">Setor:</span>
                      <span>{user.funcionario.setor.nome}</span>
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-800">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium text-sm">Administrador do Sistema</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sistemas Disponíveis */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Meus Sistemas ({sistemas.length})
                </CardTitle>
                <p className="text-gray-600">
                  Sistemas disponíveis para você baseado em suas permissões
                </p>
              </CardHeader>
              <CardContent>
                {sistemas.length === 0 ? (
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum sistema disponível
                    </h3>
                    <p className="text-gray-600">
                      Entre em contato com o administrador para solicitar acesso aos sistemas.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sistemas.map((sistema) => (
                      <Card
                        key={sistema.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300"
                        onClick={() => handleSistemaClick(sistema)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {sistema.nome}
                              </h3>
                              {sistema.descricao && (
                                <p className="text-gray-600 text-sm">
                                  {sistema.descricao}
                                </p>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNivelColor(sistema.nivel)}`}>
                              {getNivelText(sistema.nivel)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Nível de acesso: {sistema.nivel}
                            </div>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Acessar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Permissões Detalhadas */}
            {user.permissoes && user.permissoes.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Permissões Detalhadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user.permissoes.map((permissao) => (
                      <div
                        key={permissao.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{permissao.sistema.nome}</div>
                          <div className="text-sm text-gray-600">
                            Perfil: {permissao.perfil.nome}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNivelColor(permissao.perfil.nivel)}`}>
                          {getNivelText(permissao.perfil.nivel)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Seção de Logs do Sistema - Apenas para Administradores */}
        {isAdmin && (
          <div className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Logs do Sistema</h2>
              <p className="text-gray-600">
                Como administrador, você tem acesso a todos os logs do sistema. Esta seção mostra todas as atividades realizadas pelos usuários.
              </p>
            </div>
            <LogsViewer showAllLogs={true} />
          </div>
        )}
      </div>
    </div>
  );
} 