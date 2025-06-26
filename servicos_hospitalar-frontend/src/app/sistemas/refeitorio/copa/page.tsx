"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "../../../contexts/UserContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Pedido {
  id: string;
  tipoRefeicao: string;
  observacoes: string;
  dataSolicitacao: string;
  status: string;
  funcionario: {
    id: string;
    nome: string;
    setor: {
      id: string;
      nome: string;
    };
  };
  opcoes: Record<string, boolean>;
}

interface PedidoDieta {
  id: string;
  tipoDieta: string;
  observacoes: string;
  dataSolicitacao: string;
  status: string;
  funcionario: {
    id: string;
    nome: string;
    setor: {
      id: string;
      nome: string;
    };
  };
}

interface ConfiguracaoRefeitorio {
  id: string;
  valorCafe: number;
  valorAlmoco: number;
  valorJantar: number;
  valorCeia: number;
  imagemCardapio: string;
  ativo: boolean;
}

interface PedidosPorSetor {
  setor: string;
  pedidos: Pedido[];
  total: number;
}

interface PedidosDietaPorTipo {
  tipo: string;
  pedidos: PedidoDieta[];
  total: number;
}

export default function CopaPage() {
  const { user } = useUser();
  const router = useRouter();
  const [config, setConfig] = useState<ConfiguracaoRefeitorio | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosDieta, setPedidosDieta] = useState<PedidoDieta[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [accessDenied, setAccessDenied] = useState(false);
  const [cardapioDate, setCardapioDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [uploadingCardapio, setUploadingCardapio] = useState(false);
  const [cardapioUploadSuccess, setCardapioUploadSuccess] = useState(false);
  const [filtroSetoresEspeciais, setFiltroSetoresEspeciais] = useState(false);

  // Timer para atualizar o horário
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      verificarPermissoes();
    }
  }, [user]);

  const verificarPermissoes = () => {
    // Verificar se o usuário tem permissão de gestor ou administrador para o sistema refeitório
    const temPermissaoCopa = user?.permissoes?.some(permissao => 
      permissao.sistema.nome.toLowerCase() === 'refeitório' && 
      permissao.perfil.nivel >= 2
    );

    if (!temPermissaoCopa) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    carregarDados();
  };

  const carregarDados = async () => {
    try {
      // Carregar configurações do refeitório
      const configResponse = await api.get('/copa/configuracao');
      setConfig(configResponse.data);
      
      // Carregar cardápio atual
      const hoje = new Date().toISOString().split('T')[0];
      try {
        const cardapioResponse = await api.get(`/copa/cardapio/${hoje}`);
        if (cardapioResponse.data) {
          setConfig(prev => ({
            ...prev,
            imagemCardapio: cardapioResponse.data.imagem
          }));
        }
      } catch (error) {
        console.log('Nenhum cardápio encontrado para hoje');
      }
      
      // Mock dos pedidos por setor
      const pedidosMock: Pedido[] = [
        {
          id: "1",
          tipoRefeicao: "ALMOCO",
          observacoes: "Sem sal",
          dataSolicitacao: "2024-01-15T10:30:00",
          status: "CONFIRMADO",
          funcionario: {
            id: "1",
            nome: "João Silva",
            setor: { id: "1", nome: "UTI01" }
          },
          opcoes: {
            almoco: true,
            salada: true,
            guarnicao: false
          }
        },
        {
          id: "2",
          tipoRefeicao: "JANTAR",
          observacoes: "Dieta especial",
          dataSolicitacao: "2024-01-15T16:45:00",
          status: "PENDENTE",
          funcionario: {
            id: "2",
            nome: "Maria Santos",
            setor: { id: "2", nome: "UCI" }
          },
          opcoes: {
            jantar: true,
            jantarTropical: false
          }
        },
        {
          id: "3",
          tipoRefeicao: "CAFE",
          observacoes: "",
          dataSolicitacao: "2024-01-15T06:15:00",
          status: "CONFIRMADO",
          funcionario: {
            id: "3",
            nome: "Pedro Costa",
            setor: { id: "3", nome: "DIRETORIA MÉDICA" }
          },
          opcoes: {}
        }
      ];
      setPedidos(pedidosMock);

      // Mock dos pedidos de dieta
      const pedidosDietaMock: PedidoDieta[] = [
        {
          id: "1",
          tipoDieta: "DIABETES",
          observacoes: "Controle de açúcar",
          dataSolicitacao: "2024-01-15T08:00:00",
          status: "CONFIRMADO",
          funcionario: {
            id: "4",
            nome: "Ana Oliveira",
            setor: { id: "4", nome: "SEMI INTENSIVA" }
          }
        },
        {
          id: "2",
          tipoDieta: "HIPERTENSAO",
          observacoes: "Baixo teor de sódio",
          dataSolicitacao: "2024-01-15T09:30:00",
          status: "PENDENTE",
          funcionario: {
            id: "5",
            nome: "Carlos Lima",
            setor: { id: "5", nome: "UTI02" }
          }
        },
        {
          id: "3",
          tipoDieta: "CELIACA",
          observacoes: "Sem glúten",
          dataSolicitacao: "2024-01-15T07:45:00",
          status: "CONFIRMADO",
          funcionario: {
            id: "6",
            nome: "Lucia Ferreira",
            setor: { id: "6", nome: "UAVC" }
          }
        }
      ];
      setPedidosDieta(pedidosDietaMock);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPedidosPorSetor = (): PedidosPorSetor[] => {
    const pedidosAgrupados = pedidos.reduce((acc, pedido) => {
      const setor = pedido.funcionario.setor.nome;
      if (!acc[setor]) {
        acc[setor] = [];
      }
      acc[setor].push(pedido);
      return acc;
    }, {} as Record<string, Pedido[]>);

    return Object.entries(pedidosAgrupados).map(([setor, pedidosSetor]) => ({
      setor,
      pedidos: pedidosSetor,
      total: pedidosSetor.length
    }));
  };

  const getPedidosDietaPorTipo = (): PedidosDietaPorTipo[] => {
    const pedidosAgrupados = pedidosDieta.reduce((acc, pedido) => {
      const tipo = pedido.tipoDieta;
      if (!acc[tipo]) {
        acc[tipo] = [];
      }
      acc[tipo].push(pedido);
      return acc;
    }, {} as Record<string, PedidoDieta[]>);

    return Object.entries(pedidosAgrupados).map(([tipo, pedidosTipo]) => ({
      tipo,
      pedidos: pedidosTipo,
      total: pedidosTipo.length
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoRefeicaoLabel = (tipo: string) => {
    switch (tipo) {
      case 'CAFE':
        return 'Café da Manhã';
      case 'ALMOCO':
        return 'Almoço';
      case 'JANTAR':
        return 'Jantar';
      case 'CEIA':
        return 'Ceia';
      default:
        return tipo;
    }
  };

  const getTipoDietaLabel = (tipo: string) => {
    switch (tipo) {
      case 'DIABETES':
        return 'Diabetes';
      case 'HIPERTENSAO':
        return 'Hipertensão';
      case 'CELIACA':
        return 'Doença Celíaca';
      case 'LACTOSE':
        return 'Intolerância à Lactose';
      default:
        return tipo;
    }
  };

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCardapioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      console.error("Arquivo muito grande. Tamanho máximo: 10MB");
      return;
    }

    if (!cardapioDate) {
      alert("Por favor, selecione uma data para o cardápio");
      return;
    }

    setUploadingCardapio(true);
    setCardapioUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("cardapio", file);
      formData.append("data", cardapioDate);

      const response = await api.post('/copa/cardapio/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Cardápio enviado com sucesso:", response.data);
      setCardapioUploadSuccess(true);
      
      // Limpar o input de arquivo
      e.target.value = '';
      
      // Recarregar configurações para mostrar o novo cardápio
      await carregarDados();
    } catch (error) {
      console.error("Erro ao fazer upload do cardápio:", error);
      alert("Erro ao fazer upload do cardápio. Tente novamente.");
    } finally {
      setUploadingCardapio(false);
    }
  };

  const isSetorEspecial = (setor: string) => {
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
    
    return setoresEspeciais.includes(setor.toUpperCase());
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-6xl">🚫</div>
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="text-gray-600 text-center max-w-md">
            Você não tem permissão para acessar a área da Copa. 
            Apenas administradores e gestores da copa podem acessar esta área.
          </p>
          <Button 
            onClick={() => router.push('/sistemas/refeitorio')}
            className="mt-4"
          >
            Voltar ao Refeitório
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header com relógio */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Copa - Gestão de Pedidos</h1>
          <p className="text-gray-600">Controle de pedidos e cardápio do refeitório</p>
        </div>
        <div className="text-right">
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
      </div>

      {/* Resumo dos Setores Especiais */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏥</span>
            <h3 className="text-lg font-semibold text-blue-900">Setores Especiais</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
            {getPedidosPorSetor()
              .filter(grupo => isSetorEspecial(grupo.setor))
              .map((grupo) => (
                <div key={grupo.setor} className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="font-medium text-blue-800">{grupo.setor}</span>
                  <Badge variant="secondary" className="text-xs">
                    {grupo.total}
                  </Badge>
                </div>
              ))}
          </div>
          {getPedidosPorSetor().filter(grupo => isSetorEspecial(grupo.setor)).length === 0 && (
            <p className="text-blue-600 text-sm italic">Nenhum pedido de setores especiais no momento</p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="cardapio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cardapio">Cardápio</TabsTrigger>
          <TabsTrigger value="pedidos-setor">Pedidos por Setor</TabsTrigger>
          <TabsTrigger value="pedidos-dieta">Pedidos de Dieta</TabsTrigger>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
        </TabsList>

        {/* Cardápio */}
        <TabsContent value="cardapio" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload de Cardápio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Upload de Cardápio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Upload de Cardápio</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data do Cardápio
                      </label>
                      <input
                        type="date"
                        value={cardapioDate}
                        onChange={(e) => setCardapioDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arquivo do Cardápio
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleCardapioUpload}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={uploadingCardapio}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos aceitos: JPG, PNG, GIF, WebP, PDF. Tamanho máximo: 10MB.
                      </p>
                    </div>
                  </div>
                  
                  {uploadingCardapio && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Fazendo upload do cardápio...</span>
                    </div>
                  )}
                  
                  {cardapioUploadSuccess && (
                    <div className="flex items-center gap-2 text-green-600">
                      <span>✅</span>
                      <span>Cardápio atualizado com sucesso!</span>
                    </div>
                  )}
                </div>

                {/* Exibição do Cardápio */}
                {config?.imagemCardapio ? (
                  <div className="text-center">
                    <img 
                      src={config.imagemCardapio} 
                      alt="Cardápio do dia" 
                      className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                    <p className="text-gray-600">Cardápio não disponível</p>
                    <p className="text-sm text-gray-500 mt-2">Faça o upload de um cardápio para exibi-lo aqui</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pedidos dos Setores Especiais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏥 Pedidos dos Setores Especiais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getPedidosPorSetor().slice(0, 5).map((grupo) => (
                    <div key={grupo.setor} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-gray-800">
                          {grupo.setor}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {grupo.total} pedidos
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {grupo.pedidos.slice(0, 3).map((pedido) => (
                          <div key={pedido.id} className="text-xs bg-gray-50 p-2 rounded">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{pedido.funcionario.nome}</span>
                              <Badge className={`text-xs ${getStatusColor(pedido.status)}`}>
                                {pedido.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600">
                              {getTipoRefeicaoLabel(pedido.tipoRefeicao)} • {formatarData(pedido.dataSolicitacao)}
                            </p>
                            {pedido.observacoes && (
                              <p className="text-gray-500 italic">
                                "{pedido.observacoes}"
                              </p>
                            )}
                          </div>
                        ))}
                        {grupo.pedidos.length > 3 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{grupo.pedidos.length - 3} mais pedidos
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {getPedidosPorSetor().length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-2">📋</div>
                      <p className="text-gray-600 text-sm">Nenhum pedido dos setores especiais</p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total de setores:</span>
                      <span className="font-semibold">{getPedidosPorSetor().length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total de pedidos:</span>
                      <span className="font-semibold">{pedidos.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pedidos por Setor */}
        <TabsContent value="pedidos-setor" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pedidos por Setor</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFiltroSetoresEspeciais(!filtroSetoresEspeciais)}
                className={filtroSetoresEspeciais ? "bg-blue-50 border-blue-200" : ""}
              >
                {filtroSetoresEspeciais ? "🏥" : "🏥"} Setores Especiais
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {getPedidosPorSetor()
              .filter(grupo => !filtroSetoresEspeciais || isSetorEspecial(grupo.setor))
              .map((grupo) => (
              <Card key={grupo.setor}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className={isSetorEspecial(grupo.setor) ? "text-blue-600" : ""}>
                      {isSetorEspecial(grupo.setor) ? "🏥 " : "🏢 "}{grupo.setor}
                    </span>
                    <Badge variant="secondary">{grupo.total} pedidos</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grupo.pedidos.map((pedido) => (
                      <div key={pedido.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{pedido.funcionario.nome}</p>
                            <p className="text-sm text-gray-600">
                              {getTipoRefeicaoLabel(pedido.tipoRefeicao)} • {formatarData(pedido.dataSolicitacao)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(pedido.status)}>
                            {pedido.status}
                          </Badge>
                        </div>
                        {pedido.observacoes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            <strong>Observações:</strong> {pedido.observacoes}
                          </p>
                        )}
                        {Object.keys(pedido.opcoes).length > 0 && (
                          <div className="text-sm">
                            <strong>Opções selecionadas:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(pedido.opcoes)
                                .filter(([_, value]) => value)
                                .map(([key, _]) => (
                                  <Badge key={key} variant="outline" className="text-xs">
                                    {key}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pedidos de Dieta */}
        <TabsContent value="pedidos-dieta" className="space-y-4">
          <div className="grid gap-4">
            {getPedidosDietaPorTipo().map((grupo) => (
              <Card key={grupo.tipo}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>🥗 {getTipoDietaLabel(grupo.tipo)}</span>
                    <Badge variant="secondary">{grupo.total} pedidos</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grupo.pedidos.map((pedido) => (
                      <div key={pedido.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{pedido.funcionario.nome}</p>
                            <p className="text-sm text-gray-600">
                              {pedido.funcionario.setor.nome} • {formatarData(pedido.dataSolicitacao)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(pedido.status)}>
                            {pedido.status}
                          </Badge>
                        </div>
                        {pedido.observacoes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            <strong>Observações:</strong> {pedido.observacoes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resumo */}
        <TabsContent value="resumo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">📊 Total de Pedidos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600">{pedidos.length}</div>
                <p className="text-sm text-gray-600">Pedidos gerais</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">🥗 Pedidos de Dieta</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600">{pedidosDieta.length}</div>
                <p className="text-sm text-gray-600">Dietas especiais</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">🏥 Setores Atendidos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-600">{getPedidosPorSetor().length}</div>
                <p className="text-sm text-gray-600">Setores com pedidos</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>📈 Resumo por Tipo de Refeição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['CAFE', 'ALMOCO', 'JANTAR', 'CEIA'].map((tipo) => {
                  const count = pedidos.filter(p => p.tipoRefeicao === tipo).length;
                  return (
                    <div key={tipo} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{count}</div>
                      <div className="text-sm text-gray-600">{getTipoRefeicaoLabel(tipo)}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 