"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Dieta {
  tipo: string;
  observacoes: string;
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

export default function RefeitorioPage() {
  const { user } = useUser();
  const router = useRouter();
  const [dietas, setDietas] = useState<Dieta[]>([
    { tipo: "Dieta Almoço", observacoes: "" },
    { tipo: "Dieta Almoço Tropical", observacoes: "" },
    { tipo: "Dieta Jantar Tropical", observacoes: "" }
  ]);
  const [config, setConfig] = useState<ConfiguracaoRefeitorio | null>(null);
  const [loading, setLoading] = useState(true);

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
      verificarSetorEspecial();
      loadConfig();
    }
  }, [user]);

  const loadConfig = async () => {
    try {
      const response = await api.get('/refeitorio/configuracao');
      setConfig(response.data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const verificarSetorEspecial = () => {
    if (!user?.funcionario?.setor) return;
    
    const setorAtual = user.funcionario.setor.nome.toUpperCase();
    if (setoresEspeciais.includes(setorAtual)) {
      router.push('/sistemas/refeitorio/setores-especiais');
    }
  };

  const isHorarioPermitido = () => {
    if (!config) return false;
    
    const agora = new Date();
    const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
    
    const [inicioHora, inicioMin] = config.horarioInicioDietas.split(':').map(Number);
    const [fimHora, fimMin] = config.horarioFimDietas.split(':').map(Number);
    const [atualHora, atualMin] = horaAtual.split(':').map(Number);
    
    const inicioMinutos = inicioHora * 60 + inicioMin;
    const fimMinutos = fimHora * 60 + fimMin;
    const atualMinutos = atualHora * 60 + atualMin;
    
    return atualMinutos >= inicioMinutos && atualMinutos <= fimMinutos;
  };

  const getHorarioAtual = () => {
    const agora = new Date();
    return agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
  };

  // Placeholder para imagem do cardápio
  const cardapioUrl = "/cardapio-refeitorio.jpg"; // Troque para a URL real depois

  const handleObservacoesChange = (index: number, value: string) => {
    const novasDietas = [...dietas];
    novasDietas[index].observacoes = value;
    setDietas(novasDietas);
  };

  const handleSolicitarDieta = (dieta: Dieta) => {
    if (!user) {
      alert("Você precisa estar logado para solicitar uma dieta.");
      return;
    }

    if (!isHorarioPermitido()) {
      alert(`Horário para solicitação de dietas: ${config?.horarioInicioDietas} às ${config?.horarioFimDietas}`);
      return;
    }

    // Aqui você implementará a lógica para enviar a solicitação
    console.log("Solicitando dieta:", {
      ...dieta,
      funcionarioId: user.funcionario.id,
      funcionarioNome: user.funcionario.nome,
      funcionarioCpf: user.funcionario.cpf
    });
    
    alert(`Solicitação de ${dieta.tipo} enviada com sucesso para ${user.funcionario.nome}!`);
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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carregando...</h1>
        </div>
      </div>
    );
  }

  const horarioPermitido = isHorarioPermitido();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Refeitório - Solicitação de Dietas</h1>
        
        {/* Botões para gestores e administradores */}
        {user?.permissoes?.some(permissao => 
          (permissao.sistema.nome.toLowerCase() === 'refeitório' || permissao.sistema.nome.toLowerCase() === 'refeitorio') && 
          permissao.perfil.nivel >= 2
        ) && (
          <div className="flex gap-2">
            <Button 
              onClick={() => router.push('/sistemas/refeitorio/self-service')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🏪 Self-Service
            </Button>
            <Button 
              onClick={() => router.push('/sistemas/refeitorio/copa')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              🍽️ Acessar Copa
            </Button>
          </div>
        )}
      </div>
      
      {/* Informações do usuário logado */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Funcionário Logado</h2>
        <p className="text-blue-800">
          <strong>Nome:</strong> {user.funcionario.nome} | 
          <strong> CPF:</strong> {user.funcionario.cpf} | 
          <strong> Matrícula:</strong> {user.funcionario.matricula}
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
                  <strong>Horário para solicitação de dietas:</strong> {config.horarioInicioDietas} às {config.horarioFimDietas}
                </p>
                <p className="text-sm text-yellow-700">
                  <strong>Horário atual:</strong> {getHorarioAtual()} 
                  {horarioPermitido ? (
                    <span className="text-green-600 ml-2">✓ Horário permitido</span>
                  ) : (
                    <span className="text-red-600 ml-2">✗ Fora do horário</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Imagem do cardápio */}
        <div className="w-full lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Cardápio do Dia</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <img
                src={cardapioUrl}
                alt="Cardápio do Refeitório"
                className="rounded-lg shadow-md object-contain max-h-96 w-full"
              />
              <span className="mt-2 text-gray-500 text-sm">Cardápio atualizado diariamente</span>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de solicitação de dietas */}
        <div className="w-full lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Dieta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!horarioPermitido && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    Solicitações de dietas só são permitidas no horário: {config?.horarioInicioDietas} às {config?.horarioFimDietas}
                  </p>
                </div>
              )}
              
              {dietas.map((dieta, index) => (
                <div key={dieta.tipo} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{dieta.tipo}</h3>
                    <Button
                      onClick={() => handleSolicitarDieta(dieta)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!horarioPermitido}
                    >
                      Solicitar
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`observacoes-${index}`}>
                      Observações para {dieta.tipo}:
                    </Label>
                    <Textarea
                      id={`observacoes-${index}`}
                      placeholder={`Digite observações específicas para ${dieta.tipo}...`}
                      value={dieta.observacoes}
                      onChange={e => handleObservacoesChange(index, e.target.value)}
                      rows={3}
                      disabled={!horarioPermitido}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 