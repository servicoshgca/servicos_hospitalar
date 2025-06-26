"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, User, Calendar, FileText, Edit, Plus, Trash2, Eye } from 'lucide-react';
import { api } from '@/lib/api';

interface Log {
  id: string;
  acao: 'CREATE' | 'UPDATE' | 'DELETE';
  entidade: string;
  entidadeId: string;
  sistema: string;
  dadosAnteriores?: any;
  dadosNovos?: any;
  usuario: {
    funcionario: {
      nome: string;
      cpf: string;
    };
  };
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

interface LogsViewerProps {
  funcionarioId?: string;
  showAllLogs?: boolean;
}

export default function LogsViewer({ funcionarioId, showAllLogs }: LogsViewerProps) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarLogs = async () => {
    try {
      setLoading(true);
      
      let response;
      if (showAllLogs) {
        response = await api.get('/logs?limit=100');
      } else if (funcionarioId) {
        response = await api.get(`/logs/funcionario/${funcionarioId}`);
      } else {
        console.error('LogsViewer: funcionarioId ou showAllLogs deve ser fornecido');
        return;
      }
      
      setLogs(response.data);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (funcionarioId || showAllLogs) {
      carregarLogs();
    }
  }, [funcionarioId, showAllLogs]);

  const getAcaoIcon = (acao: string) => {
    switch (acao) {
      case 'CREATE':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'UPDATE':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'DELETE':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAcaoText = (acao: string) => {
    switch (acao) {
      case 'CREATE':
        return 'Criou';
      case 'UPDATE':
        return 'Editou';
      case 'DELETE':
        return 'Removeu';
      default:
        return acao;
    }
  };

  const getEntidadeText = (entidade: string) => {
    switch (entidade) {
      case 'Funcionario':
        return 'Ficha do Funcionário';
      case 'FuncionarioEtiqueta':
        return 'Etiqueta';
      case 'InformacaoFuncional':
        return 'Informação Funcional';
      default:
        return entidade;
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMudancasDetalhadas = (log: Log) => {
    if (log.acao === 'CREATE') {
      return 'Registro criado';
    }

    if (log.acao === 'DELETE') {
      return 'Registro removido';
    }

    if (log.acao === 'UPDATE' && log.dadosAnteriores && log.dadosNovos) {
      const anteriores = typeof log.dadosAnteriores === 'string' 
        ? JSON.parse(log.dadosAnteriores) 
        : log.dadosAnteriores;
      const novos = typeof log.dadosNovos === 'string' 
        ? JSON.parse(log.dadosNovos) 
        : log.dadosNovos;

      const mudancas: string[] = [];

      // Comparar campos comuns
      const camposParaComparar = ['nome', 'cpf', 'email', 'telefoneCelular', 'cargo', 'matricula', 'observacoes'];
      
      camposParaComparar.forEach(campo => {
        if (anteriores[campo] !== novos[campo]) {
          if (anteriores[campo] && novos[campo]) {
            mudancas.push(`${campo}: "${anteriores[campo]}" → "${novos[campo]}"`);
          } else if (anteriores[campo]) {
            mudancas.push(`${campo}: "${anteriores[campo]}" → removido`);
          } else if (novos[campo]) {
            mudancas.push(`${campo}: adicionado "${novos[campo]}"`);
          }
        }
      });

      // Verificar mudanças específicas de etiquetas
      if (log.entidade === 'FuncionarioEtiqueta') {
        if (anteriores.tipoEtiqueta?.nome !== novos.tipoEtiqueta?.nome) {
          mudancas.push(`tipo: "${anteriores.tipoEtiqueta?.nome}" → "${novos.tipoEtiqueta?.nome}"`);
        }
        if (anteriores.dataInicio !== novos.dataInicio) {
          mudancas.push(`data início: "${anteriores.dataInicio}" → "${novos.dataInicio}"`);
        }
        if (anteriores.arquivoPdf !== novos.arquivoPdf) {
          mudancas.push(`arquivo PDF: alterado`);
        }
      }

      return mudancas.length > 0 ? mudancas.join(', ') : 'Dados atualizados';
    }

    return 'Dados modificados';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {showAllLogs ? 'Logs do Sistema' : 'Histórico de Alterações'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {showAllLogs ? 'Logs do Sistema' : 'Histórico de Alterações'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border-l-4 border-gray-200 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getAcaoIcon(log.acao)}
                      <span className="font-medium">
                        {getAcaoText(log.acao)} {getEntidadeText(log.entidade)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {getMudancasDetalhadas(log)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.usuario?.funcionario?.nome || 'Usuário não identificado'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatarData(log.createdAt)}
                      </div>
                      {showAllLogs && (
                        <div className="text-xs">
                          Sistema: {log.sistema}
                        </div>
                      )}
                      {log.ip && (
                        <div className="text-xs">
                          IP: {log.ip}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma alteração registrada ainda.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 