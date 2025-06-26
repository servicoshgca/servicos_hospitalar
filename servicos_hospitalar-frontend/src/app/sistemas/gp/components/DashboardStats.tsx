"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { 
  Users, 
  Building, 
  Tag, 
  FileText, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  UserCheck,
  UserX,
  Clock,
  Award
} from 'lucide-react';

interface DashboardStats {
  totalFuncionarios: number;
  totalSetores: number;
  totalVinculos: number;
  totalTiposEtiquetas: number;
  totalEtiquetas: number;
  etiquetasPorTipo: Array<{
    tipo: string;
    quantidade: number;
    cor: string;
  }>;
  funcionariosPorSetor: Array<{
    setor: string;
    quantidade: number;
  }>;
  licencasAtestados: {
    total: number;
    ativos: number;
    vencidos: number;
  };
  turnover: {
    admissoes: number;
    demissoes: number;
    taxa: number;
  };
  funcionariosAtivos: number;
  funcionariosInativos: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      
      // Carregar dados básicos
      const [funcionarios, setores, vinculos, tiposEtiquetas, etiquetas] = await Promise.all([
        api.get('/funcionarios'),
        api.get('/setores'),
        api.get('/vinculos'),
        api.get('/tipos-etiquetas'),
        api.get('/funcionario-etiquetas')
      ]);

      // Processar estatísticas
      const funcionariosData = funcionarios.data;
      const setoresData = setores.data;
      const vinculosData = vinculos.data;
      const tiposEtiquetasData = tiposEtiquetas.data;
      const etiquetasData = etiquetas.data;

      // Calcular estatísticas
      const totalFuncionarios = funcionariosData.length;
      const totalSetores = setoresData.length;
      const totalVinculos = vinculosData.length;
      const totalTiposEtiquetas = tiposEtiquetasData.length;
      const totalEtiquetas = etiquetasData.length;

      // Funcionários por setor
      const funcionariosPorSetor = setoresData.map(setor => ({
        setor: setor.nome,
        quantidade: funcionariosData.filter(f => f.setorId === setor.id).length
      })).filter(item => item.quantidade > 0);

      // Etiquetas por tipo
      const etiquetasPorTipo = tiposEtiquetasData.map(tipo => ({
        tipo: tipo.nome,
        quantidade: etiquetasData.filter(e => e.tipoEtiquetaId === tipo.id).length,
        cor: tipo.cor || 'blue'
      })).filter(item => item.quantidade > 0);

      // Licenças e atestados (etiquetas ativas)
      const hoje = new Date();
      const etiquetasAtivas = etiquetasData.filter(e => {
        const dataFim = e.dataFim ? new Date(e.dataFim) : null;
        return !dataFim || dataFim >= hoje;
      });

      const etiquetasVencidas = etiquetasData.filter(e => {
        const dataFim = e.dataFim ? new Date(e.dataFim) : null;
        return dataFim && dataFim < hoje;
      });

      // Funcionários ativos/inativos
      const funcionariosAtivos = funcionariosData.filter(f => f.ativo).length;
      const funcionariosInativos = totalFuncionarios - funcionariosAtivos;

      // Simular turnover (dados fictícios para demonstração)
      const turnover = {
        admissoes: Math.floor(totalFuncionarios * 0.15), // 15% do total
        demissoes: Math.floor(totalFuncionarios * 0.08), // 8% do total
        taxa: 8.5 // taxa de turnover
      };

      setStats({
        totalFuncionarios,
        totalSetores,
        totalVinculos,
        totalTiposEtiquetas,
        totalEtiquetas,
        etiquetasPorTipo,
        funcionariosPorSetor,
        licencasAtestados: {
          total: totalEtiquetas,
          ativos: etiquetasAtivas.length,
          vencidos: etiquetasVencidas.length
        },
        turnover,
        funcionariosAtivos,
        funcionariosInativos
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Erro ao carregar estatísticas</p>
        </div>
      </div>
    );
  }

  const getCorClass = (cor: string) => {
    switch (cor) {
      case 'red': return 'bg-red-100 text-red-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Funcionários</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFuncionarios}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Setores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSetores}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Etiquetas Cadastradas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEtiquetas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tipos de Etiquetas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTiposEtiquetas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Licenças e Atestados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Licenças e Atestados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total de Etiquetas:</span>
                <span className="font-semibold">{stats.licencasAtestados.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ativas:</span>
                <span className="font-semibold text-green-600">{stats.licencasAtestados.ativos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vencidas:</span>
                <span className="font-semibold text-red-600">{stats.licencasAtestados.vencidos}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Turnover */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Turnover
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Admissões (último ano):</span>
                <span className="font-semibold text-green-600">{stats.turnover.admissoes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Demissões (último ano):</span>
                <span className="font-semibold text-red-600">{stats.turnover.demissoes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxa de Turnover:</span>
                <span className="font-semibold">{stats.turnover.taxa}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status dos Funcionários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Status dos Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  Ativos:
                </span>
                <span className="font-semibold text-green-600">{stats.funcionariosAtivos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center gap-2">
                  <UserX className="w-4 h-4 text-red-600" />
                  Inativos:
                </span>
                <span className="font-semibold text-red-600">{stats.funcionariosInativos}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Etiquetas por Tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Etiquetas por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.etiquetasPorTipo.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.tipo}:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCorClass(item.cor)}`}>
                    {item.quantidade}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funcionários por Setor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Funcionários por Setor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.funcionariosPorSetor.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{item.setor}</span>
                <span className="text-lg font-bold text-blue-600">{item.quantidade}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 