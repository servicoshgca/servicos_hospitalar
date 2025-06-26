"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useUser } from "@/app/contexts/UserContext";

interface ConfiguracaoRefeitorio {
  id: string;
  valorCafe: number;
  valorAlmoco: number;
  valorJantar: number;
  valorCeia: number;
  
  // Horários do refeitório por tipo de refeição
  horarioInicioCafe: string;
  horarioFimCafe: string;
  horarioInicioAlmoco: string;
  horarioFimAlmoco: string;
  horarioInicioJantar: string;
  horarioFimJantar: string;
  horarioInicioCeia: string;
  horarioFimCeia: string;
  
  // Horários para pedidos por tipo de refeição
  horarioInicioPedidosCafe: string;
  horarioFimPedidosCafe: string;
  horarioInicioPedidosAlmoco: string;
  horarioFimPedidosAlmoco: string;
  horarioInicioPedidosJantar: string;
  horarioFimPedidosJantar: string;
  horarioInicioPedidosCeia: string;
  horarioFimPedidosCeia: string;
  
  // Horários para dietas
  horarioInicioDietas: string;
  horarioFimDietas: string;
  
  ativo: boolean;
}

interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  informacoesFuncionais: {
    matricula: string;
    setor: {
      nome: string;
    };
  }[];
}

interface PedidoEntregue {
  id: string;
  funcionarioId: string;
  pedidoRefeicaoId?: string;
  tipoRefeicao: string;
  dataRefeicao: string;
  dataEntrega: string;
  observacoes?: string;
  funcionario: Funcionario;
}

interface ResumoPedidos {
  cafe: number;
  almoco: number;
  jantar: number;
  ceia: number;
  total: number;
}

export default function RefeitorioSelfServicePage() {
  const { user } = useUser();
  const [config, setConfig] = useState<ConfiguracaoRefeitorio | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [cpfBusca, setCpfBusca] = useState('');
  const [funcionarioEncontrado, setFuncionarioEncontrado] = useState<Funcionario | null>(null);
  const [resumoPedidos, setResumoPedidos] = useState<ResumoPedidos>({
    cafe: 0,
    almoco: 0,
    jantar: 0,
    ceia: 0,
    total: 0
  });
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);

  // Função para checar permissão nível 2+ no sistema 'refeitorio'
  const hasPermission = user?.permissoes?.some(
    (p) => (p.sistema.nome.toLowerCase() === 'refeitório' || p.sistema.nome.toLowerCase() === 'refeitorio') && p.perfil.nivel >= 2
  );

  useEffect(() => {
    carregarDados();
  }, []);

  // Timer para atualizar o horário a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Debug: log das permissões do usuário
  useEffect(() => {
    if (user) {
      console.log('Usuário:', user);
      console.log('Permissões:', user.permissoes);
      console.log('Tem permissão para self-service:', hasPermission);
    }
  }, [user, hasPermission]);

  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded text-center">
          <div className="font-bold text-2xl mb-2">Acesso restrito</div>
          <div className="text-lg">Apenas administradores e gestores do refeitório podem acessar esta página.</div>
        </div>
      </div>
    );
  }

  const carregarDados = async () => {
    try {
      // Carregar configurações do refeitório
      const configResponse = await api.get('/refeitorio/configuracao');
      setConfig(configResponse.data);
      
      // Carregar resumo de pedidos do dia
      const hoje = new Date().toISOString().split('T')[0];
      await carregarResumoPedidos(hoje);
      
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarResumoPedidos = async (data: string) => {
    try {
      const [cafeResponse, almocoResponse, jantarResponse, ceiaResponse] = await Promise.all([
        api.get(`/refeitorio/pedidos/entregues/tipo/CAFE/data/${data}`),
        api.get(`/refeitorio/pedidos/entregues/tipo/ALMOCO/data/${data}`),
        api.get(`/refeitorio/pedidos/entregues/tipo/JANTAR/data/${data}`),
        api.get(`/refeitorio/pedidos/entregues/tipo/CEIA/data/${data}`)
      ]);

      setResumoPedidos({
        cafe: cafeResponse.data.length,
        almoco: almocoResponse.data.length,
        jantar: jantarResponse.data.length,
        ceia: ceiaResponse.data.length,
        total: cafeResponse.data.length + almocoResponse.data.length + jantarResponse.data.length + ceiaResponse.data.length
      });
    } catch (error) {
      console.error("Erro ao carregar resumo de pedidos:", error);
    }
  };

  const getRefeicaoAtual = () => {
    if (!config) return null;
    
    const horaAtual = currentTime.getHours().toString().padStart(2, '0') + ':' + currentTime.getMinutes().toString().padStart(2, '0');
    
    // Verifica cada tipo de refeição
    const refeicoes = [
      { tipo: 'CAFE', nome: 'Café da Manhã', inicio: config.horarioInicioCafe, fim: config.horarioFimCafe },
      { tipo: 'ALMOCO', nome: 'Almoço', inicio: config.horarioInicioAlmoco, fim: config.horarioFimAlmoco },
      { tipo: 'JANTAR', nome: 'Jantar', inicio: config.horarioInicioJantar, fim: config.horarioFimJantar },
      { tipo: 'CEIA', nome: 'Ceia', inicio: config.horarioInicioCeia, fim: config.horarioFimCeia }
    ];
    
    for (const refeicao of refeicoes) {
      const [inicioHora, inicioMin] = refeicao.inicio.split(':').map(Number);
      const [fimHora, fimMin] = refeicao.fim.split(':').map(Number);
      const [atualHora, atualMin] = horaAtual.split(':').map(Number);
      
      const inicioMinutos = inicioHora * 60 + inicioMin;
      const fimMinutos = fimHora * 60 + fimMin;
      const atualMinutos = atualHora * 60 + atualMin;
      
      if (atualMinutos >= inicioMinutos && atualMinutos <= fimMinutos) {
        return refeicao;
      }
    }
    
    return null;
  };

  const buscarFuncionario = async () => {
    if (!cpfBusca.trim()) {
      alert('Digite um CPF válido');
      return;
    }

    try {
      const response = await api.get(`/refeitorio/funcionario/cpf/${cpfBusca.trim()}`);
      if (response.data) {
        setFuncionarioEncontrado(response.data);
      } else {
        setFuncionarioEncontrado(null);
        alert('Funcionário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      setFuncionarioEncontrado(null);
      alert('Erro ao buscar funcionário');
    }
  };

  const fazerCheckin = async () => {
    if (!funcionarioEncontrado) {
      alert('Funcionário não encontrado');
      return;
    }

    const refeicaoAtual = getRefeicaoAtual();
    if (!refeicaoAtual) {
      alert('Fora do horário de funcionamento do refeitório');
      return;
    }

    setCheckinLoading(true);
    try {
      const hoje = new Date().toISOString().split('T')[0];
      
      const checkinData = {
        funcionarioId: funcionarioEncontrado.id,
        tipoRefeicao: refeicaoAtual.tipo,
        dataRefeicao: hoje,
        observacoes: 'Check-in realizado no self-service'
      };

      await api.post('/refeitorio/pedidos/entregues', checkinData);
      
      setCheckinSuccess(true);
      setCpfBusca('');
      setFuncionarioEncontrado(null);
      
      // Recarregar resumo de pedidos
      await carregarResumoPedidos(hoje);
      
      // Resetar sucesso após 3 segundos
      setTimeout(() => {
        setCheckinSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao fazer check-in:', error);
      alert('Erro ao fazer check-in');
    } finally {
      setCheckinLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!funcionarioEncontrado) {
        buscarFuncionario();
      } else {
        fazerCheckin();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const refeicaoAtual = getRefeicaoAtual();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Refeitório</h1>
        {refeicaoAtual ? (
          <div className="text-xl text-green-700 font-semibold">
            {refeicaoAtual.nome} - {refeicaoAtual.inicio} às {refeicaoAtual.fim}
          </div>
        ) : (
          <div className="text-xl text-red-700 font-semibold">
            Fora do Horário de Funcionamento
          </div>
        )}
        
        {/* Relógio */}
        <div className="mt-4 text-2xl font-mono font-bold text-gray-600">
          {currentTime.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
        <div className="text-sm text-gray-500">
          {currentTime.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Resumo de Pedidos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Café da Manhã</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{resumoPedidos.cafe}</div>
            <div className="text-xs text-gray-500">pedidos</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Almoço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{resumoPedidos.almoco}</div>
            <div className="text-xs text-gray-500">pedidos</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Jantar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{resumoPedidos.jantar}</div>
            <div className="text-xs text-gray-500">pedidos</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Ceia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{resumoPedidos.ceia}</div>
            <div className="text-xs text-gray-500">pedidos</div>
          </CardContent>
        </Card>
      </div>

      {/* Total */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gray-100 rounded-lg px-6 py-3">
          <div className="text-2xl font-bold text-gray-800">Total do Dia: {resumoPedidos.total}</div>
          <div className="text-sm text-gray-600">refeições servidas</div>
        </div>
      </div>

      {/* Check-in */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Check-in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cpf">CPF do Funcionário</Label>
            <Input
              id="cpf"
              type="text"
              placeholder="Digite o CPF..."
              value={cpfBusca}
              onChange={(e) => setCpfBusca(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg"
              disabled={checkinLoading}
            />
          </div>

          {!funcionarioEncontrado ? (
            <Button 
              onClick={buscarFuncionario} 
              className="w-full"
              disabled={checkinLoading || !cpfBusca.trim()}
            >
              Buscar Funcionário
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Funcionário encontrado */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-800">{funcionarioEncontrado.nome}</div>
                  <div className="text-sm text-green-600">CPF: {funcionarioEncontrado.cpf}</div>
                  {funcionarioEncontrado.informacoesFuncionais[0] && (
                    <div className="text-sm text-green-600">
                      Matrícula: {funcionarioEncontrado.informacoesFuncionais[0].matricula}
                    </div>
                  )}
                  {funcionarioEncontrado.informacoesFuncionais[0] && (
                    <div className="text-sm text-green-600">
                      Setor: {funcionarioEncontrado.informacoesFuncionais[0].setor.nome}
                    </div>
                  )}
                </div>
              </div>

              <Button 
                onClick={fazerCheckin} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={checkinLoading || !refeicaoAtual}
              >
                {checkinLoading ? 'Processando...' : 'Confirmar Check-in'}
              </Button>

              <Button 
                onClick={() => {
                  setFuncionarioEncontrado(null);
                  setCpfBusca('');
                }} 
                variant="outline"
                className="w-full"
                disabled={checkinLoading}
              >
                Cancelar
              </Button>
            </div>
          )}

          {/* Mensagem de sucesso */}
          {checkinSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <div className="text-center">
                <div className="font-bold">✓ Check-in realizado com sucesso!</div>
                <div className="text-sm">Bom apetite!</div>
              </div>
            </div>
          )}

          {/* Status do refeitório */}
          {!refeicaoAtual && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              <div className="font-bold">⏰ Fora do Horário de Funcionamento</div>
              <div className="text-sm">O refeitório está fechado no momento</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botão de atualizar */}
      <div className="text-center mt-6">
        <Button 
          onClick={carregarDados} 
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar Dados
        </Button>
      </div>
    </div>
  );
} 