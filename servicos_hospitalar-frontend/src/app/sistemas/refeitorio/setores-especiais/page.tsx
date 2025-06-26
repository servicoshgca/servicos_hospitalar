"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "../../../contexts/UserContext";
import { api } from "@/lib/api";

interface FuncionarioSetor {
  id: string;
  nome: string;
  cpf: string;
  matricula: string;
  pedidos: Pedido[];
}

interface Pedido {
  id: string;
  tipoRefeicao: string;
  observacoes?: string;
  dataRefeicao: string;
  status: string;
  opcoes?: string; // JSON string com as opções
  createdAt: string;
  funcionario: {
    id: string;
    nome: string;
    cpf: string;
    informacoesFuncionais: {
      matricula: string;
      setor: {
        nome: string;
      };
    }[];
  };
}

interface PedidoFuncionario {
  id: string;
  tipoRefeicao: string;
  observacoes?: string;
  dataRefeicao: string;
  status: string;
  opcoes?: string; // JSON string com as opções
  createdAt: string;
  cardapio?: {
    id: string;
    data: string;
    imagem?: string;
  };
}

interface Cardapio {
  id: string;
  data: string;
  imagem?: string;
  createdAt: string;
  updatedAt: string;
}

interface PedidoForm {
  tipoRefeicao: string;
  observacoes: string;
  setorPedidoId: string;
  opcoes: {
    // Almoço
    almoco: boolean;
    almocoDieta: boolean;
    almocoDietaTropical: boolean;
    salada: boolean;
    guarnicao: boolean;
    acompanhamento1: boolean;
    acompanhamento2: boolean;
    pratoPrincipal: boolean;
    opcao: boolean;
    sobremesa: boolean;
    suco: boolean;
    // Jantar
    jantar: boolean;
    jantarTropical: boolean;
  };
}

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

interface Setor {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export default function RefeitorioSetoresEspeciaisPage() {
  const { user } = useUser();
  const [funcionariosSetor, setFuncionariosSetor] = useState<FuncionarioSetor[]>([]);
  const [config, setConfig] = useState<ConfiguracaoRefeitorio | null>(null);
  const [cardapio, setCardapio] = useState<Cardapio | null>(null);
  const [pedidoForm, setPedidoForm] = useState<PedidoForm>({
    tipoRefeicao: '',
    observacoes: '',
    setorPedidoId: '',
    opcoes: {
      // Almoço
      almoco: false,
      almocoDieta: false,
      almocoDietaTropical: false,
      salada: false,
      guarnicao: false,
      acompanhamento1: false,
      acompanhamento2: false,
      pratoPrincipal: false,
      opcao: false,
      sobremesa: false,
      suco: false,
      // Jantar
      jantar: false,
      jantarTropical: false,
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [marcandoPedido, setMarcandoPedido] = useState<string | null>(null);
  const [pedidosEntregues, setPedidosEntregues] = useState<any[]>([]);
  const [pedidosNaoEntregues, setPedidosNaoEntregues] = useState<any[]>([]);
  const [loadingEntregas, setLoadingEntregas] = useState(false);
  const [setores, setSetores] = useState<Setor[]>([]);

  // Lista de setores especiais
  const setoresEspeciais = [
    "DIRETORIA MÉDICA",
    "DIRETORIA ADMINISTRATIVA", 
    "DIRETORIA DE ENFERMAGEM",
    "DIRETORIA GERAL",
    "UCI",
    "SEMI INTENSIVA",
    "UTI01",
    "UTI02", 
    "UTI04",
    "UTI05",
    "SALA DE ALTA",
    "ADMINISTRAÇÃO DA NEUROCIRURGIA",
    "UAVC",
    "CONFORTO MÉDICO",
    "REFEITÓRIO",
    "CENTRO CIRÚRGICO",
    "COPA",
    "CHDI",
    "CME",
    "SENUT",
    "NTIC"
  ];

  useEffect(() => {
    if (user) {
      console.log('Usuário logado:', {
        nome: user.funcionario.nome,
        setor: user.funcionario.informacoesFuncionais?.[0]?.setor?.nome,
        setorEspecial: verificarSetorEspecial()
      });
      carregarDados();
      carregarPedidosEntregas();
      carregarSetores();
    }
  }, [user]);

  const carregarDados = async () => {
    try {
      console.log('Carregando dados do refeitório...');
      
      // Carregar configurações do refeitório
      const configResponse = await api.get('/refeitorio/configuracao');
      console.log('Configurações carregadas:', configResponse.data);
      setConfig(configResponse.data);
      
      // Carregar cardápio atual
      const hoje = new Date().toISOString().split('T')[0];
      try {
        const cardapioResponse = await api.get(`/refeitorio/cardapio/${hoje}`);
        console.log('Cardápio carregado:', cardapioResponse.data);
        setCardapio(cardapioResponse.data);
      } catch (error) {
        console.log('Nenhum cardápio encontrado para hoje');
        setCardapio(null);
      }

      // Carregar pedidos do setor especial
      const pedidosResponse = await api.get(`/refeitorio/pedidos/data/${hoje}`);
      console.log('Pedidos carregados:', pedidosResponse.data);
      console.log('Total de pedidos recebidos:', pedidosResponse.data.length);
      
      // Filtrar apenas pedidos de funcionários do setor especial
      const pedidosSetorEspecial = pedidosResponse.data.filter((pedido: Pedido) => {
        const setorFuncionario = pedido.funcionario.informacoesFuncionais[0]?.setor?.nome;
        return setoresEspeciais.includes(setorFuncionario);
      });

      console.log('Pedidos filtrados por setor especial:', pedidosSetorEspecial);

      // Agrupar pedidos por funcionário
      const funcionariosMap = new Map<string, FuncionarioSetor>();
      
      pedidosSetorEspecial.forEach((pedido: Pedido) => {
        const funcionarioId = pedido.funcionario.id;
        const funcionario = pedido.funcionario;
        const informacaoFuncional = funcionario.informacoesFuncionais[0];
        
        if (!funcionariosMap.has(funcionarioId)) {
          funcionariosMap.set(funcionarioId, {
            id: funcionarioId,
            nome: funcionario.nome,
            cpf: funcionario.cpf,
            matricula: informacaoFuncional?.matricula || '',
            pedidos: []
          });
        }
        
        funcionariosMap.get(funcionarioId)!.pedidos.push(pedido);
      });

      setFuncionariosSetor(Array.from(funcionariosMap.values()));
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const carregarSetores = async () => {
    try {
      const response = await api.get('/refeitorio/setores');
      setSetores(response.data);
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
    }
  };

  const marcarPedidoEntregue = async (pedidoId: string, funcionarioId: string, tipoRefeicao: string, dataRefeicao: string) => {
    try {
      setMarcandoPedido(pedidoId);
      
      // Criar registro de pedido entregue
      await api.post('/refeitorio/pedidos/entregues', {
        funcionarioId,
        pedidoRefeicaoId: pedidoId,
        tipoRefeicao,
        dataRefeicao,
        observacoes: 'Pedido marcado como entregue após fim do horário de funcionamento'
      });

      // Remover o pedido da lista local
      setFuncionariosSetor(prev => 
        prev.map(funcionario => ({
          ...funcionario,
          pedidos: funcionario.pedidos.filter(pedido => pedido.id !== pedidoId)
        }))
      );

      // Recarregar dados de entrega
      await carregarPedidosEntregas();

      console.log('Pedido marcado como entregue com sucesso');
    } catch (error) {
      console.error('Erro ao marcar pedido como entregue:', error);
      alert('Erro ao marcar pedido como entregue');
    } finally {
      setMarcandoPedido(null);
    }
  };

  const marcarPedidoNaoEntregue = async (pedidoId: string, funcionarioId: string, tipoRefeicao: string, dataRefeicao: string) => {
    try {
      setMarcandoPedido(pedidoId);
      
      // Criar registro de pedido não entregue
      await api.post('/refeitorio/pedidos/nao-entregues', {
        funcionarioId,
        pedidoRefeicaoId: pedidoId,
        tipoRefeicao,
        dataRefeicao,
        observacoes: 'Pedido marcado como não entregue após fim do horário de funcionamento'
      });

      // Remover o pedido da lista local
      setFuncionariosSetor(prev => 
        prev.map(funcionario => ({
          ...funcionario,
          pedidos: funcionario.pedidos.filter(pedido => pedido.id !== pedidoId)
        }))
      );

      // Recarregar dados de entrega
      await carregarPedidosEntregas();

      console.log('Pedido marcado como não entregue com sucesso');
    } catch (error) {
      console.error('Erro ao marcar pedido como não entregue:', error);
      alert('Erro ao marcar pedido como não entregue');
    } finally {
      setMarcandoPedido(null);
    }
  };

  const isHorarioFuncionamentoEncerrado = (tipoRefeicao: string) => {
    if (!config) return false;
    
    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    
    let horarioFim: string;
    switch (tipoRefeicao) {
      case 'CAFE':
        horarioFim = config.horarioFimCafe;
        break;
      case 'ALMOCO':
        horarioFim = config.horarioFimAlmoco;
        break;
      case 'JANTAR':
        horarioFim = config.horarioFimJantar;
        break;
      case 'CEIA':
        horarioFim = config.horarioFimCeia;
        break;
      default:
        return false;
    }
    
    const [horas, minutos] = horarioFim.split(':').map(Number);
    const horarioFimMinutos = horas * 60 + minutos;
    
    return horaAtual > horarioFimMinutos;
  };

  const carregarPedidosEntregas = async () => {
    try {
      setLoadingEntregas(true);
      const hoje = new Date().toISOString().split('T')[0];
      
      // Carregar pedidos entregues
      const entreguesResponse = await api.get(`/refeitorio/pedidos/entregues/data/${hoje}`);
      const entreguesSetorEspecial = entreguesResponse.data.filter((pedido: any) => {
        const setorFuncionario = pedido.funcionario.informacoesFuncionais[0]?.setor?.nome;
        return setoresEspeciais.includes(setorFuncionario);
      });
      setPedidosEntregues(entreguesSetorEspecial);

      // Carregar pedidos não entregues
      const naoEntreguesResponse = await api.get(`/refeitorio/pedidos/nao-entregues/data/${hoje}`);
      const naoEntreguesSetorEspecial = naoEntreguesResponse.data.filter((pedido: any) => {
        const setorFuncionario = pedido.funcionario.informacoesFuncionais[0]?.setor?.nome;
        return setoresEspeciais.includes(setorFuncionario);
      });
      setPedidosNaoEntregues(naoEntreguesSetorEspecial);
    } catch (error) {
      console.error('Erro ao carregar pedidos de entrega:', error);
    } finally {
      setLoadingEntregas(false);
    }
  };

  const isHorarioPermitido = (tipoRefeicao: string) => {
    if (!config) return false;
    
    const agora = new Date();
    const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
    
    let horarioInicio = '';
    let horarioFim = '';
    
    switch (tipoRefeicao) {
      case 'CAFE':
        horarioInicio = config.horarioInicioPedidosCafe;
        horarioFim = config.horarioFimPedidosCafe;
        break;
      case 'ALMOCO':
        horarioInicio = config.horarioInicioPedidosAlmoco;
        horarioFim = config.horarioFimPedidosAlmoco;
        break;
      case 'JANTAR':
        horarioInicio = config.horarioInicioPedidosJantar;
        horarioFim = config.horarioFimPedidosJantar;
        break;
      case 'CEIA':
        horarioInicio = config.horarioInicioPedidosCeia;
        horarioFim = config.horarioFimPedidosCeia;
        break;
      default:
        return false;
    }
    
    // Verificar se os horários estão definidos
    if (!horarioInicio || !horarioFim) {
      return false;
    }
    
    // Converter horários para minutos para comparação
    const [inicioHora, inicioMin] = horarioInicio.split(':').map(Number);
    const [fimHora, fimMin] = horarioFim.split(':').map(Number);
    const [atualHora, atualMin] = horaAtual.split(':').map(Number);
    
    // Verificar se a conversão foi bem-sucedida
    if (isNaN(inicioHora) || isNaN(inicioMin) || isNaN(fimHora) || isNaN(fimMin) || isNaN(atualHora) || isNaN(atualMin)) {
      return false;
    }
    
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const fimMinutos = fimHora * 60 + fimMin;
    const atualMinutos = atualHora * 60 + atualMin;
    
    return atualMinutos >= inicioMinutos && atualMinutos <= fimMinutos;
  };

  const getHorarioAtual = () => {
    const agora = new Date();
    return agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
  };

  const getRefeicaoAtual = () => {
    if (!config) return null;
    
    const horaAtual = currentTime.getHours().toString().padStart(2, '0') + ':' + currentTime.getMinutes().toString().padStart(2, '0');
    
    // Verifica cada tipo de refeição
    const refeicoes = [
      { tipo: 'CAFE', nome: 'Café da Manhã', inicio: config.horarioInicioPedidosCafe, fim: config.horarioFimPedidosCafe },
      { tipo: 'ALMOCO', nome: 'Almoço', inicio: config.horarioInicioPedidosAlmoco, fim: config.horarioFimPedidosAlmoco },
      { tipo: 'JANTAR', nome: 'Jantar', inicio: config.horarioInicioPedidosJantar, fim: config.horarioFimPedidosJantar },
      { tipo: 'CEIA', nome: 'Ceia', inicio: config.horarioInicioPedidosCeia, fim: config.horarioFimPedidosCeia }
    ];
    
    for (const refeicao of refeicoes) {
      if (isHorarioPermitido(refeicao.tipo)) {
        return refeicao;
      }
    }
    
    return null;
  };

  const getProximaRefeicao = () => {
    if (!config) return null;
    
    const horaAtual = currentTime.getHours().toString().padStart(2, '0') + ':' + currentTime.getMinutes().toString().padStart(2, '0');
    
    const refeicoes = [
      { tipo: 'CAFE', nome: 'Café da Manhã', inicio: config.horarioInicioPedidosCafe, fim: config.horarioFimPedidosCafe },
      { tipo: 'ALMOCO', nome: 'Almoço', inicio: config.horarioInicioPedidosAlmoco, fim: config.horarioFimPedidosAlmoco },
      { tipo: 'JANTAR', nome: 'Jantar', inicio: config.horarioInicioPedidosJantar, fim: config.horarioFimPedidosJantar },
      { tipo: 'CEIA', nome: 'Ceia', inicio: config.horarioInicioPedidosCeia, fim: config.horarioFimPedidosCeia }
    ];
    
    // Encontra a próxima refeição que ainda não passou
    for (const refeicao of refeicoes) {
      const [inicioHora, inicioMin] = refeicao.inicio.split(':').map(Number);
      const inicioMinutos = inicioHora * 60 + inicioMin;
      const [atualHora, atualMin] = horaAtual.split(':').map(Number);
      const atualMinutos = atualHora * 60 + atualMin;
      
      if (inicioMinutos > atualMinutos) {
        return refeicao;
      }
    }
    
    // Se não há próxima hoje, retorna a primeira de amanhã
    return refeicoes[0];
  };

  // Atualizar o tipo de refeição automaticamente quando o config carrega
  useEffect(() => {
    if (config) {
      const refeicaoAtual = getRefeicaoAtual();
      if (refeicaoAtual) {
        setPedidoForm(prev => ({
          ...prev,
          tipoRefeicao: refeicaoAtual.tipo
        }));
      }
    }
  }, [config]);

  // Timer para atualizar o status da refeição a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      if (config) {
        const refeicaoAtual = getRefeicaoAtual();
        if (refeicaoAtual && refeicaoAtual.tipo !== pedidoForm.tipoRefeicao) {
          setPedidoForm(prev => ({
            ...prev,
            tipoRefeicao: refeicaoAtual.tipo
          }));
        }
      }
    }, 1000); // Atualiza a cada segundo para o relógio

    return () => clearInterval(interval);
  }, [config]); // Removida a dependência pedidoForm.tipoRefeicao para evitar loop

  const handleSubmitPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pedidoForm.tipoRefeicao) {
      alert('Selecione o tipo de refeição');
      return;
    }

    // Validações específicas por tipo de refeição
    if (pedidoForm.tipoRefeicao === 'ALMOCO') {
      const opcoesAlmoco = pedidoForm.opcoes;
      if (!opcoesAlmoco.almoco && !opcoesAlmoco.almocoDieta && !opcoesAlmoco.almocoDietaTropical) {
        alert('Selecione pelo menos uma opção de almoço');
        return;
      }
    }

    if (pedidoForm.tipoRefeicao === 'JANTAR') {
      const opcoesJantar = pedidoForm.opcoes;
      if (!opcoesJantar.jantar && !opcoesJantar.jantarTropical) {
        alert('Selecione pelo menos uma opção de jantar');
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      const pedidoData = {
        tipoRefeicao: pedidoForm.tipoRefeicao,
        dataRefeicao: new Date().toISOString().split('T')[0], // Data atual
        observacoes: pedidoForm.observacoes,
        opcoes: pedidoForm.opcoes,
        setorPedidoId: pedidoForm.setorPedidoId || undefined
      };

      console.log('Enviando pedido:', pedidoData);
      
      const response = await api.post('/refeitorio/pedidos', pedidoData);
      console.log('Pedido criado:', response.data);
      
      alert('Pedido enviado com sucesso!');
      
      // Limpar formulário
      setPedidoForm({
        tipoRefeicao: '',
        observacoes: '',
        setorPedidoId: '',
        opcoes: {
          // Almoço
          almoco: false,
          almocoDieta: false,
          almocoDietaTropical: false,
          salada: false,
          guarnicao: false,
          acompanhamento1: false,
          acompanhamento2: false,
          pratoPrincipal: false,
          opcao: false,
          sobremesa: false,
          suco: false,
          // Jantar
          jantar: false,
          jantarTropical: false,
        }
      });
      
      // Recarregar dados para mostrar o novo pedido
      await carregarDados();
      
    } catch (error: any) {
      console.error('Erro ao enviar pedido:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao enviar pedido';
      alert(`Erro: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const verificarSetorEspecial = () => {
    if (!user?.funcionario?.informacoesFuncionais?.[0]?.setor?.nome) return false;
    return setoresEspeciais.includes(user.funcionario.informacoesFuncionais[0].setor.nome);
  };

  const handleCheckboxChange = (field: keyof PedidoForm['opcoes']) => {
    setPedidoForm(prev => ({
      ...prev,
      opcoes: {
        ...prev.opcoes,
        [field]: !prev.opcoes[field]
      }
    }));
  };

  const renderFormularioAlmoco = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="almoco"
            checked={pedidoForm.opcoes.almoco}
            onCheckedChange={() => handleCheckboxChange('almoco')}
          />
          <Label htmlFor="almoco">Almoço</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="almocoDieta"
            checked={pedidoForm.opcoes.almocoDieta}
            onCheckedChange={() => handleCheckboxChange('almocoDieta')}
          />
          <Label htmlFor="almocoDieta">Almoço Dieta</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="almocoDietaTropical"
            checked={pedidoForm.opcoes.almocoDietaTropical}
            onCheckedChange={() => handleCheckboxChange('almocoDietaTropical')}
          />
          <Label htmlFor="almocoDietaTropical">Almoço Dieta Tropical</Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Salada</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="salada"
            checked={pedidoForm.opcoes.salada}
            onCheckedChange={() => handleCheckboxChange('salada')}
          />
          <Label htmlFor="salada">Salada</Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Guarnição</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="guarnicao"
            checked={pedidoForm.opcoes.guarnicao}
            onCheckedChange={() => handleCheckboxChange('guarnicao')}
          />
          <Label htmlFor="guarnicao">Guarnição</Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Acompanhamento</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acompanhamento1"
              checked={pedidoForm.opcoes.acompanhamento1}
              onCheckedChange={() => handleCheckboxChange('acompanhamento1')}
            />
            <Label htmlFor="acompanhamento1">Acompanhamento 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acompanhamento2"
              checked={pedidoForm.opcoes.acompanhamento2}
              onCheckedChange={() => handleCheckboxChange('acompanhamento2')}
            />
            <Label htmlFor="acompanhamento2">Acompanhamento 2</Label>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Prato</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Radio
              id="pratoPrincipal"
              name="tipoPrato"
              checked={pedidoForm.opcoes.pratoPrincipal}
              onChange={() => {
                setPedidoForm(prev => ({
                  ...prev,
                  opcoes: {
                    ...prev.opcoes,
                    pratoPrincipal: true,
                    opcao: false,
                  }
                }));
              }}
            />
            <Label htmlFor="pratoPrincipal">Prato Principal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Radio
              id="opcao"
              name="tipoPrato"
              checked={pedidoForm.opcoes.opcao}
              onChange={() => {
                setPedidoForm(prev => ({
                  ...prev,
                  opcoes: {
                    ...prev.opcoes,
                    pratoPrincipal: false,
                    opcao: true,
                  }
                }));
              }}
            />
            <Label htmlFor="opcao">Opção</Label>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Sobremesa</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sobremesa"
            checked={pedidoForm.opcoes.sobremesa}
            onCheckedChange={() => handleCheckboxChange('sobremesa')}
          />
          <Label htmlFor="sobremesa">Sobremesa</Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Suco</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="suco"
            checked={pedidoForm.opcoes.suco}
            onCheckedChange={() => handleCheckboxChange('suco')}
          />
          <Label htmlFor="suco">Suco</Label>
        </div>
      </div>
    </div>
  );

  const renderFormularioJantar = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <div className="flex items-center space-x-2">
          <Radio
            id="jantar"
            name="tipoJantar"
            checked={pedidoForm.opcoes.jantar}
            onChange={() => {
              setPedidoForm(prev => ({
                ...prev,
                opcoes: {
                  ...prev.opcoes,
                  jantar: true,
                  jantarTropical: false,
                }
              }));
            }}
          />
          <Label htmlFor="jantar">Jantar</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Radio
            id="jantarTropical"
            name="tipoJantar"
            checked={pedidoForm.opcoes.jantarTropical}
            onChange={() => {
              setPedidoForm(prev => ({
                ...prev,
                opcoes: {
                  ...prev.opcoes,
                  jantar: false,
                  jantarTropical: true,
                }
              }));
            }}
          />
          <Label htmlFor="jantarTropical">Jantar Tropical</Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Salada</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="salada"
            checked={pedidoForm.opcoes.salada}
            onCheckedChange={() => handleCheckboxChange('salada')}
          />
          <Label htmlFor="salada">Salada</Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Guarnição</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="guarnicao"
            checked={pedidoForm.opcoes.guarnicao}
            onCheckedChange={() => handleCheckboxChange('guarnicao')}
          />
          <Label htmlFor="guarnicao">Guarnição</Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Acompanhamento</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acompanhamento1"
              checked={pedidoForm.opcoes.acompanhamento1}
              onCheckedChange={() => handleCheckboxChange('acompanhamento1')}
            />
            <Label htmlFor="acompanhamento1">Acompanhamento 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acompanhamento2"
              checked={pedidoForm.opcoes.acompanhamento2}
              onCheckedChange={() => handleCheckboxChange('acompanhamento2')}
            />
            <Label htmlFor="acompanhamento2">Acompanhamento 2</Label>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Prato</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Radio
              id="pratoPrincipal"
              name="tipoPrato"
              checked={pedidoForm.opcoes.pratoPrincipal}
              onChange={() => {
                setPedidoForm(prev => ({
                  ...prev,
                  opcoes: {
                    ...prev.opcoes,
                    pratoPrincipal: true,
                    opcao: false,
                  }
                }));
              }}
            />
            <Label htmlFor="pratoPrincipal">Prato Principal</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Radio
              id="opcao"
              name="tipoPrato"
              checked={pedidoForm.opcoes.opcao}
              onChange={() => {
                setPedidoForm(prev => ({
                  ...prev,
                  opcoes: {
                    ...prev.opcoes,
                    pratoPrincipal: false,
                    opcao: true,
                  }
                }));
              }}
            />
            <Label htmlFor="opcao">Opção</Label>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Sobremesa</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sobremesa"
            checked={pedidoForm.opcoes.sobremesa}
            onCheckedChange={() => handleCheckboxChange('sobremesa')}
          />
          <Label htmlFor="sobremesa">Sobremesa</Label>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Suco</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="suco"
            checked={pedidoForm.opcoes.suco}
            onCheckedChange={() => handleCheckboxChange('suco')}
          />
          <Label htmlFor="suco">Suco</Label>
        </div>
      </div>
    </div>
  );

  const getOpcoesLegiveis = (opcoesJson: string) => {
    if (!opcoesJson) return [];
    
    try {
      const opcoes = JSON.parse(opcoesJson);
      const opcoesSelecionadas: string[] = [];
      
      // Mapear as opções para nomes legíveis
      const mapeamentoOpcoes: { [key: string]: string } = {
        almoco: 'Almoço',
        almocoDieta: 'Almoço Dieta',
        almocoDietaTropical: 'Almoço Dieta Tropical',
        jantar: 'Jantar',
        jantarTropical: 'Jantar Tropical',
        salada: 'Salada',
        guarnicao: 'Guarnição',
        acompanhamento1: 'Acompanhamento 1',
        acompanhamento2: 'Acompanhamento 2',
        pratoPrincipal: 'Prato Principal',
        opcao: 'Opção',
        sobremesa: 'Sobremesa',
        suco: 'Suco'
      };
      
      Object.entries(opcoes).forEach(([chave, valor]) => {
        if (valor === true && mapeamentoOpcoes[chave]) {
          opcoesSelecionadas.push(mapeamentoOpcoes[chave]);
        }
      });
      
      return opcoesSelecionadas;
    } catch (error) {
      console.error('Erro ao parsear opções:', error);
      return [];
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você precisa estar logado para acessar o sistema de refeitório.</p>
        </div>
      </div>
    );
  }

  if (!verificarSetorEspecial()) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600">
            Esta página é destinada apenas para funcionários de setores especiais.
            Seu setor atual: {user.funcionario.setor?.nome || "Não informado"}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Refeitório - Setores Especiais
      </h1>
      
      {/* Informações do usuário e setor */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Funcionário Logado</h2>
        <p className="text-blue-800">
          <strong>Nome:</strong> {user.funcionario.nome} | 
          <strong> CPF:</strong> {user.funcionario.cpf} | 
          <strong> Matrícula:</strong> {user.funcionario.matricula} |
          <strong> Setor:</strong> {user.funcionario.setor?.nome}
        </p>
      </div>

      {/* Horários de Funcionamento */}
      {config && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Café</h3>
                  <p className="text-sm text-gray-600">{config.horarioInicioCafe} - {config.horarioFimCafe}</p>
                  <p className="text-xs text-gray-500">Pedidos: {config.horarioInicioPedidosCafe} - {config.horarioFimPedidosCafe}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Almoço</h3>
                  <p className="text-sm text-gray-600">{config.horarioInicioAlmoco} - {config.horarioFimAlmoco}</p>
                  <p className="text-xs text-gray-500">Pedidos: {config.horarioInicioPedidosAlmoco} - {config.horarioFimPedidosAlmoco}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Jantar</h3>
                  <p className="text-sm text-gray-600">{config.horarioInicioJantar} - {config.horarioFimJantar}</p>
                  <p className="text-xs text-gray-500">Pedidos: {config.horarioInicioPedidosJantar} - {config.horarioFimPedidosJantar}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Ceia</h3>
                  <p className="text-sm text-gray-600">{config.horarioInicioCeia} - {config.horarioFimCeia}</p>
                  <p className="text-xs text-gray-500">Pedidos: {config.horarioInicioPedidosCeia} - {config.horarioFimPedidosCeia}</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Horário atual:</strong> {getHorarioAtual()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Pedido */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Fazer Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPedido} className="space-y-4">
                {/* Status da Refeição Atual */}
                {config && (
                  <div className="p-4 rounded-lg border">
                    {/* Relógio em tempo real */}
                    <div className="text-center mb-3">
                      <div className="text-2xl font-mono font-bold text-gray-800">
                        {currentTime.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {currentTime.toLocaleDateString('pt-BR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    
                    {(() => {
                      const refeicaoAtual = getRefeicaoAtual();
                      const proximaRefeicao = getProximaRefeicao();
                      
                      if (refeicaoAtual) {
                        return (
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-green-700 mb-2">
                              🍽️ {refeicaoAtual.nome} - Pedidos Abertos
                            </h3>
                            <p className="text-sm text-gray-600">
                              Horário: {refeicaoAtual.inicio} às {refeicaoAtual.fim}
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              ✓ Você pode fazer seu pedido agora!
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-red-700 mb-2">
                              ⏰ Fora do Horário de Pedidos
                            </h3>
                            <p className="text-sm text-gray-600">
                              Próxima refeição: {proximaRefeicao?.nome}
                            </p>
                            <p className="text-sm text-red-600 font-medium">
                              ✗ Pedidos só são aceitos no horário permitido
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                {/* Formulário dinâmico baseado no tipo de refeição */}
                {pedidoForm.tipoRefeicao === 'ALMOCO' && renderFormularioAlmoco()}
                {pedidoForm.tipoRefeicao === 'JANTAR' && renderFormularioJantar()}

                {/* Para Café e Ceia, apenas observações */}
                {(pedidoForm.tipoRefeicao === 'CAFE' || pedidoForm.tipoRefeicao === 'CEIA') && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      Pedido simples para {pedidoForm.tipoRefeicao === 'CAFE' ? 'Café da Manhã' : 'Ceia'}
                    </p>
                  </div>
                )}

                {/* Campo de seleção de setor para o pedido */}
                <div>
                  <Label htmlFor="setorPedido" className="text-gray-700 font-medium">
                    Setor para o pedido (opcional)
                  </Label>
                  <select
                    id="setorPedido"
                    value={pedidoForm.setorPedidoId}
                    onChange={(e) => setPedidoForm(prev => ({ ...prev, setorPedidoId: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                  >
                    <option value="">Selecione um setor (opcional)</option>
                    {setores
                      .filter(setor => setoresEspeciais.includes(setor.nome))
                      .map((setor) => (
                        <option key={setor.id} value={setor.id}>
                          {setor.nome}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Se não selecionar, o pedido será para seu setor atual: {user?.funcionario.setor?.nome || 'Não informado'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Digite observações especiais para o pedido..."
                    value={pedidoForm.observacoes}
                    onChange={(e) => setPedidoForm(prev => ({ ...prev, observacoes: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!pedidoForm.tipoRefeicao || !isHorarioPermitido(pedidoForm.tipoRefeicao)}
                >
                  Enviar Pedido
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Cardápio do Dia - Imagem */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Cardápio do Dia</CardTitle>
                <Button
                  onClick={carregarDados}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {cardapio && cardapio.imagem ? (
                <>
                  <img
                    src={cardapio.imagem}
                    alt="Cardápio do Refeitório"
                    className="rounded-lg shadow-md object-contain max-h-96 w-full"
                    onError={(e) => {
                      console.error('Erro ao carregar imagem do cardápio:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="mt-2 text-gray-500 text-sm">
                    Cardápio de {new Date(cardapio.data).toLocaleDateString('pt-BR')}
                  </span>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Nenhum cardápio disponível para hoje</p>
                  <p className="text-sm text-gray-400 mt-1">
                    O cardápio será carregado pela Copa quando disponível
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lista de Funcionários do Setor */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Funcionários do Setor - Pedidos Realizados</CardTitle>
              <Button
                onClick={carregarDados}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando pedidos...</p>
              </div>
            ) : funcionariosSetor.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum pedido encontrado.
              </p>
            ) : (
              <div className="space-y-4">
                {funcionariosSetor.map((funcionario) => (
                  <div key={funcionario.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{funcionario.nome}</h3>
                        <p className="text-gray-600">
                          CPF: {funcionario.cpf} | Matrícula: {funcionario.matricula}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {funcionario.pedidos.length} pedido(s)
                      </span>
                    </div>
                    
                    {funcionario.pedidos.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Pedidos:</h4>
                        {funcionario.pedidos.map((pedido) => (
                          <div key={pedido.id} className="bg-gray-50 rounded p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{pedido.tipoRefeicao}</span>
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    pedido.status === 'CONFIRMADO' 
                                      ? 'bg-green-100 text-green-800' 
                                      : pedido.status === 'PENDENTE'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {pedido.status}
                                  </span>
                                </div>
                                
                                {/* Opções selecionadas */}
                                {pedido.opcoes && (
                                  <div className="mb-2">
                                    <p className="text-xs text-gray-600 mb-1">Opções selecionadas:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {getOpcoesLegiveis(pedido.opcoes).map((opcao, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {opcao}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {pedido.observacoes && (
                                  <p className="text-sm text-gray-600">
                                    <strong>Obs:</strong> {pedido.observacoes}
                                  </p>
                                )}
                                
                                <div className="text-xs text-gray-500 mt-2">
                                  <p>Data da refeição: {new Date(pedido.dataRefeicao).toLocaleDateString('pt-BR')}</p>
                                  <p>Pedido feito em: {new Date(pedido.createdAt).toLocaleString('pt-BR')}</p>
                                </div>

                                {/* Botões de Entrega - Aparecem apenas após o fim do horário de funcionamento */}
                                {isHorarioFuncionamentoEncerrado(pedido.tipoRefeicao) && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-orange-600 mb-2 font-medium">
                                      ⏰ Horário de funcionamento encerrado - Marque o status da entrega:
                                    </p>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => marcarPedidoEntregue(
                                          pedido.id,
                                          pedido.funcionario.id,
                                          pedido.tipoRefeicao,
                                          pedido.dataRefeicao
                                        )}
                                        disabled={marcandoPedido === pedido.id}
                                      >
                                        {marcandoPedido === pedido.id ? (
                                          <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processando...
                                          </div>
                                        ) : (
                                          '✓ Entregue'
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => marcarPedidoNaoEntregue(
                                          pedido.id,
                                          pedido.funcionario.id,
                                          pedido.tipoRefeicao,
                                          pedido.dataRefeicao
                                        )}
                                        disabled={marcandoPedido === pedido.id}
                                      >
                                        {marcandoPedido === pedido.id ? (
                                          <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processando...
                                          </div>
                                        ) : (
                                          '✗ Não Entregue'
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pedidos Entregues e Não Entregues */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Status de Entrega dos Pedidos</CardTitle>
              <Button
                onClick={carregarPedidosEntregas}
                disabled={loadingEntregas}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="entregues" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="entregues" className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Entregues ({pedidosEntregues.length})
                </TabsTrigger>
                <TabsTrigger value="nao-entregues" className="flex items-center gap-2">
                  <span className="text-red-600">✗</span>
                  Não Entregues ({pedidosNaoEntregues.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="entregues" className="mt-4">
                {loadingEntregas ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Carregando pedidos entregues...</p>
                  </div>
                ) : pedidosEntregues.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-green-400 mb-2">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Nenhum pedido entregue encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pedidosEntregues.map((pedido) => (
                      <div key={pedido.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-green-800">{pedido.tipoRefeicao}</span>
                              <Badge className="bg-green-100 text-green-800">ENTREGUE</Badge>
                            </div>
                            <p className="text-sm text-gray-700">
                              <strong>Funcionário:</strong> {pedido.funcionario.nome}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Setor:</strong> {pedido.funcionario.informacoesFuncionais[0]?.setor?.nome}
                            </p>
                            {pedido.observacoes && (
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Obs:</strong> {pedido.observacoes}
                              </p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              <p>Data da refeição: {new Date(pedido.dataRefeicao).toLocaleDateString('pt-BR')}</p>
                              <p>Entregue em: {new Date(pedido.dataEntrega).toLocaleString('pt-BR')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="nao-entregues" className="mt-4">
                {loadingEntregas ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Carregando pedidos não entregues...</p>
                  </div>
                ) : pedidosNaoEntregues.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-red-400 mb-2">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Nenhum pedido não entregue encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pedidosNaoEntregues.map((pedido) => (
                      <div key={pedido.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-red-800">{pedido.tipoRefeicao}</span>
                              <Badge className="bg-red-100 text-red-800">NÃO ENTREGUE</Badge>
                            </div>
                            <p className="text-sm text-gray-700">
                              <strong>Funcionário:</strong> {pedido.funcionario.nome}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Setor:</strong> {pedido.funcionario.informacoesFuncionais[0]?.setor?.nome}
                            </p>
                            {pedido.observacoes && (
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Obs:</strong> {pedido.observacoes}
                              </p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              <p>Data da refeição: {new Date(pedido.dataRefeicao).toLocaleDateString('pt-BR')}</p>
                              <p>Marcado como não entregue em: {new Date(pedido.dataNaoEntrega).toLocaleString('pt-BR')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 