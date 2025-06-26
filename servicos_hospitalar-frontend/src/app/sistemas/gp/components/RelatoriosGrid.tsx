'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RelatoriosService, RelatorioParams } from '../services/relatoriosService';

interface Relatorio {
  id: string;
  titulo: string;
  descricao: string;
  icon: string;
  periodo: string;
  formatos: string[];
  categoria: string;
}

export default function RelatoriosGrid() {
  const [selectedRelatorio, setSelectedRelatorio] = useState<Relatorio | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(false);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const carregarRelatorios = async () => {
    try {
      const tiposRelatorios = await RelatoriosService.listarTiposRelatorios();
      const relatoriosComIcones = tiposRelatorios.map((tipo: any) => ({
        ...tipo,
        icon: getIconForRelatorio(tipo.id),
      }));
      setRelatorios(relatoriosComIcones);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      // Fallback para relatórios estáticos se a API falhar
      setRelatorios(getRelatoriosEstaticos());
    }
  };

  const getIconForRelatorio = (id: string): string => {
    const icons: Record<string, string> = {
      turnover: '🔄',
      absenteismo: '📅',
      desempenho: '📈',
      treinamentos: '🎓',
      'custos-rh': '💰',
      diversidade: '🌍',
      acessos: '🔑',
      usuarios: '👥',
      atividades: '📝',
      auditoria: '🔍',
      'desempenho-sistema': '⚡',
      seguranca: '🔒',
    };
    return icons[id] || '📊';
  };

  const getRelatoriosEstaticos = (): Relatorio[] => [
    {
      id: 'turnover',
      titulo: 'Relatório de Turnover',
      descricao: 'Análise da taxa de rotatividade de funcionários, incluindo admissões e desligamentos por período.',
      icon: '🔄',
      periodo: 'Personalizado',
      formatos: ['PDF', 'Excel'],
      categoria: 'rh'
    },
    {
      id: 'absenteismo',
      titulo: 'Relatório de Absenteísmo',
      descricao: 'Análise de faltas e ausências dos funcionários, com indicadores de frequência e padrões.',
      icon: '📅',
      periodo: 'Personalizado',
      formatos: ['PDF', 'Excel'],
      categoria: 'rh'
    },
    {
      id: 'desempenho',
      titulo: 'Relatório de Desempenho',
      descricao: 'Avaliação de desempenho dos funcionários, incluindo metas, resultados e indicadores.',
      icon: '📈',
      periodo: 'Personalizado',
      formatos: ['PDF', 'Excel'],
      categoria: 'rh'
    },
    {
      id: 'treinamentos',
      titulo: 'Relatório de Treinamentos',
      descricao: 'Registro de treinamentos realizados, participação e avaliação de resultados.',
      icon: '🎓',
      periodo: 'Personalizado',
      formatos: ['PDF', 'Excel'],
      categoria: 'rh'
    },
    {
      id: 'custos-rh',
      titulo: 'Relatório de Custos RH',
      descricao: 'Análise de custos do departamento de RH, incluindo folha de pagamento, benefícios e investimentos.',
      icon: '💰',
      periodo: 'Personalizado',
      formatos: ['PDF', 'Excel'],
      categoria: 'rh'
    },
    {
      id: 'diversidade',
      titulo: 'Relatório de Diversidade',
      descricao: 'Análise da diversidade na empresa, incluindo gênero, idade, escolaridade e outros indicadores.',
      icon: '🌍',
      periodo: 'Atual',
      formatos: ['PDF', 'Excel'],
      categoria: 'rh'
    },
    {
      id: 'acessos',
      titulo: 'Relatório de Acessos',
      descricao: 'Análise de acessos ao sistema por usuário, incluindo horários e frequência.',
      icon: '🔑',
      periodo: 'Últimos 30 dias',
      formatos: ['PDF', 'Excel'],
      categoria: 'sistema'
    },
    {
      id: 'usuarios',
      titulo: 'Relatório de Usuários',
      descricao: 'Lista completa de usuários ativos e inativos, com seus respectivos perfis e permissões.',
      icon: '👥',
      periodo: 'Atual',
      formatos: ['PDF', 'Excel'],
      categoria: 'sistema'
    },
    {
      id: 'atividades',
      titulo: 'Relatório de Atividades',
      descricao: 'Registro de atividades realizadas no sistema, incluindo criação e edição de registros.',
      icon: '📝',
      periodo: 'Personalizado',
      formatos: ['PDF', 'Excel'],
      categoria: 'sistema'
    },
    {
      id: 'auditoria',
      titulo: 'Relatório de Auditoria',
      descricao: 'Registro detalhado de todas as alterações realizadas no sistema, incluindo quem fez e quando.',
      icon: '🔍',
      periodo: 'Personalizado',
      formatos: ['PDF', 'Excel'],
      categoria: 'sistema'
    },
    {
      id: 'desempenho-sistema',
      titulo: 'Relatório de Desempenho do Sistema',
      descricao: 'Métricas de desempenho do sistema, incluindo tempo de resposta e disponibilidade.',
      icon: '⚡',
      periodo: 'Últimos 7 dias',
      formatos: ['PDF', 'Excel'],
      categoria: 'sistema'
    },
    {
      id: 'seguranca',
      titulo: 'Relatório de Segurança',
      descricao: 'Registro de tentativas de acesso, alterações de senha e outras atividades relacionadas à segurança.',
      icon: '🔒',
      periodo: 'Personalizado',
      formatos: ['PDF', 'Excel'],
      categoria: 'sistema'
    }
  ];

  const categorias = [
    { id: 'todos', nome: 'Todos os Relatórios' },
    { id: 'rh', nome: 'Recursos Humanos' },
    { id: 'sistema', nome: 'Sistema' }
  ];

  const relatoriosFiltrados = relatorios.filter(relatorio => 
    filtroCategoria === 'todos' || relatorio.categoria === filtroCategoria
  );

  const gerarRelatorio = async (relatorio: Relatorio, formato: string) => {
    setLoading(true);
    try {
      const params: RelatorioParams = {
        formato: formato as 'PDF' | 'Excel',
      };

      // Adicionar datas se o relatório for personalizado
      if (relatorio.periodo === 'Personalizado') {
        if (dataInicio && dataFim) {
          params.dataInicio = dataInicio;
          params.dataFim = dataFim;
        } else {
          alert('Por favor, selecione as datas de início e fim para relatórios personalizados.');
          setLoading(false);
          return;
        }
      }

      // Gerar relatório usando o serviço
      const resultado = await RelatoriosService.downloadRelatorio(relatorio.id, formato as 'PDF' | 'Excel', params);
      
      alert(resultado.message);
      
      // Fechar modal se estiver aberto
      if (selectedRelatorio) {
        setSelectedRelatorio(null);
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const abrirConfiguracao = (relatorio: Relatorio) => {
    setSelectedRelatorio(relatorio);
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <select
              id="categoria"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Grid de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatoriosFiltrados.map((relatorio) => (
          <Card key={relatorio.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">{relatorio.icon}</span>
                <span className="text-lg">{relatorio.titulo}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{relatorio.descricao}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">📅 {relatorio.periodo}</span>
                <span className="text-gray-500">📄 {relatorio.formatos.join('/')}</span>
              </div>

              <div className="flex space-x-2">
                {relatorio.formatos.map((formato) => (
                  <Button
                    key={formato}
                    onClick={() => gerarRelatorio(relatorio, formato)}
                    className="flex-1 text-xs"
                    variant="outline"
                    disabled={loading}
                  >
                    {loading ? '⏳' : formato}
                  </Button>
                ))}
              </div>

              {relatorio.periodo === 'Personalizado' && (
                <Button
                  onClick={() => abrirConfiguracao(relatorio)}
                  className="w-full text-xs"
                  variant="secondary"
                  disabled={loading}
                >
                  ⚙️ Configurar Período
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Configuração */}
      {selectedRelatorio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Configurar {selectedRelatorio.titulo}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="modalDataInicio">Data Início</Label>
                <Input
                  id="modalDataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="modalDataFim">Data Fim</Label>
                <Input
                  id="modalDataFim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={() => setSelectedRelatorio(null)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (dataInicio && dataFim) {
                      gerarRelatorio(selectedRelatorio, 'PDF');
                    } else {
                      alert('Por favor, selecione as datas de início e fim.');
                    }
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Gerando...' : 'Gerar Relatório'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas dos Relatórios</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{relatorios.length}</div>
            <div className="text-sm text-gray-600">Total de Relatórios</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {relatorios.filter(r => r.categoria === 'rh').length}
            </div>
            <div className="text-sm text-gray-600">Relatórios RH</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {relatorios.filter(r => r.categoria === 'sistema').length}
            </div>
            <div className="text-sm text-gray-600">Relatórios Sistema</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-gray-600">Formatos Disponíveis</div>
          </div>
        </div>
      </div>
    </div>
  );
} 