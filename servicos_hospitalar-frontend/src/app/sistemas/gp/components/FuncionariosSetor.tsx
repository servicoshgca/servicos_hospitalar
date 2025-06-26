"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { ArrowLeft, Users, User, Phone, Mail, Calendar, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  matricula: string;
  email?: string;
  telefoneCelular?: string;
  dataNascimento?: string;
  ativo: boolean;
  foto?: string;
  informacoesFuncionais: Array<{
    id: string;
    cargo: string;
    dataAdmissao: string;
    ativo: boolean;
    setor: {
      id: string;
      nome: string;
    };
    vinculo: {
      id: string;
      nome: string;
    };
  }>;
}

interface FuncionariosSetorProps {
  setorId: string;
  setorNome: string;
  onBack: () => void;
}

export default function FuncionariosSetor({ setorId, setorNome, onBack }: FuncionariosSetorProps) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const carregarFuncionarios = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/funcionarios');
      const todosFuncionarios = response.data;
      
      console.log('Todos os funcionários:', todosFuncionarios);
      console.log('Setor ID procurado:', setorId);
      
      // Filtrar funcionários que tenham pelo menos uma informação funcional no setor especificado
      const funcionariosSetor = todosFuncionarios.filter(
        (f: Funcionario) => {
          console.log('Funcionário:', f.nome, 'Informações funcionais:', f.informacoesFuncionais);
          return f.informacoesFuncionais?.some(info => info.setor?.id === setorId);
        }
      );
      
      console.log('Funcionários filtrados:', funcionariosSetor);
      setFuncionarios(funcionariosSetor);
    } catch (error) {
      console.error('Erro ao carregar funcionários do setor:', error);
    } finally {
      setLoading(false);
    }
  }, [setorId]);

  useEffect(() => {
    carregarFuncionarios();
  }, [carregarFuncionarios]);

  const getPhotoUrl = (foto: string | null | undefined) => {
    if (!foto) return null;
    if (foto.startsWith('http://') || foto.startsWith('https://')) return foto;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads/${foto}`;
  };

  const formatarData = (data: string) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleVerDetalhes = (funcionarioId: string) => {
    router.push(`/sistemas/gp/pages/funcionarios/${funcionarioId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Carregando funcionários...</div>
      </div>
    );
  }

  const funcionariosAtivos = funcionarios.filter(f => f.ativo).length;
  const funcionariosInativos = funcionarios.length - funcionariosAtivos;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Setores
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="w-6 h-6" />
            {setorNome}
          </h2>
          <p className="text-gray-600">Funcionários do setor</p>
        </div>
      </div>

      {/* Estatísticas do Setor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Funcionários</p>
                <p className="text-2xl font-bold text-gray-900">{funcionarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{funcionariosAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <User className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-red-600">{funcionariosInativos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Funcionários */}
      {funcionarios.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum funcionário encontrado
              </h3>
              <p className="text-gray-600">
                Este setor ainda não possui funcionários cadastrados.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funcionarios.map((funcionario) => (
            <Card 
              key={funcionario.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleVerDetalhes(funcionario.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Foto do Funcionário */}
                  <div className="flex-shrink-0">
                    {funcionario.foto ? (
                      <img
                        src={getPhotoUrl(funcionario.foto) || ''}
                        alt={funcionario.nome}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ${funcionario.foto ? 'hidden' : ''}`}>
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>

                  {/* Informações do Funcionário */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">
                      {funcionario.nome}
                    </h3>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">CPF:</span>
                        <span>{formatarCPF(funcionario.cpf)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Matrícula:</span>
                        <span>{funcionario.matricula}</span>
                      </div>

                      {funcionario.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{funcionario.email}</span>
                        </div>
                      )}

                      {funcionario.telefoneCelular && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{funcionario.telefoneCelular}</span>
                        </div>
                      )}

                      {funcionario.dataNascimento && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatarData(funcionario.dataNascimento)}</span>
                        </div>
                      )}
                    </div>

                    {/* Status e Cargo */}
                    <div className="flex items-center justify-between mt-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        funcionario.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {funcionario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                      
                      {funcionario.informacoesFuncionais.length > 0 && (
                        <span className="text-xs text-gray-500 truncate">
                          {funcionario.informacoesFuncionais[0].cargo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 