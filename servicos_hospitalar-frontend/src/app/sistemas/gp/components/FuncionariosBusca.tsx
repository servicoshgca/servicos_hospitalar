'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GPService, Funcionario } from '../services/gpService';
import { Search, User, Calendar, MapPin, Building, FileText, Pencil, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FuncionariosBusca() {
  const [funcionarioEncontrado, setFuncionarioEncontrado] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState({
    nome: '',
    cpf: '',
  });
  const [buscando, setBuscando] = useState(false);
  const router = useRouter();

  const formatarCPF = (cpf: string) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return 'N/A';
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const getPhotoUrl = (foto: string | null | undefined) => {
    if (!foto) return null;
    
    // Se já é uma URL completa, usar diretamente
    if (foto.startsWith('http://') || foto.startsWith('https://')) {
      return foto;
    }
    
    // Se é apenas o nome do arquivo, construir a URL
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads/${foto}`;
  };

  const buscarFuncionario = async () => {
    if (!filtros.nome && !filtros.cpf) {
      alert('Digite um nome ou CPF para buscar');
      return;
    }

    setBuscando(true);
    setLoading(true);
    
    try {
      const funcionarios = await GPService.getFuncionarios();
      
      let funcionarioEncontrado = null;
      
      if (filtros.nome) {
        funcionarioEncontrado = funcionarios.find(f => 
          f.nome.toLowerCase().includes(filtros.nome.toLowerCase())
        );
      }
      
      if (!funcionarioEncontrado && filtros.cpf) {
        const cpfLimpo = filtros.cpf.replace(/\D/g, '');
        funcionarioEncontrado = funcionarios.find(f => 
          f.cpf.replace(/\D/g, '').includes(cpfLimpo)
        );
      }
      
      setFuncionarioEncontrado(funcionarioEncontrado || null);
      
      if (!funcionarioEncontrado) {
        alert('Funcionário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar funcionário:', error);
      alert('Erro ao buscar funcionário');
    } finally {
      setLoading(false);
      setBuscando(false);
    }
  };

  const limparBusca = () => {
    setFiltros({ nome: '', cpf: '' });
    setFuncionarioEncontrado(null);
    setBuscando(false);
  };

  const handleCardClick = (funcionario: Funcionario) => {
    router.push(`/sistemas/gp/pages/funcionarios/${funcionario.id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Buscando funcionário...</p>
      </div>
    );
  }

  if (funcionarioEncontrado) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button onClick={limparBusca} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nova Busca
            </Button>
            <Button onClick={() => router.push(`/sistemas/gp/pages/funcionarios/${funcionarioEncontrado.id}/editar`)} variant="secondary">
              <Pencil className="w-4 h-4 mr-2" /> Editar Ficha
            </Button>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Funcionário Encontrado - {funcionarioEncontrado.nome}
          </h2>
        </div>

        {/* Card do Funcionário Encontrado */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => handleCardClick(funcionarioEncontrado)}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {funcionarioEncontrado.foto ? (
                  <img
                    src={getPhotoUrl(funcionarioEncontrado.foto)}
                    alt={`Foto de ${funcionarioEncontrado.nome}`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                {!funcionarioEncontrado.foto && (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                )}
                <div className={`w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-2 border-gray-200 ${funcionarioEncontrado.foto ? 'hidden' : ''}`}>
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl">{funcionarioEncontrado.nome}</CardTitle>
                <p className="text-lg text-gray-600">{formatarCPF(funcionarioEncontrado.cpf)}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {funcionarioEncontrado.informacoesFuncionais?.[0] && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Matrícula:</span>
                    <span className="font-medium">{funcionarioEncontrado.informacoesFuncionais[0].matricula}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Cargo:</span>
                    <span className="font-medium">{funcionarioEncontrado.informacoesFuncionais[0].cargo}</span>
                  </div>
                  {funcionarioEncontrado.informacoesFuncionais[0].setor && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Setor:</span>
                      <span className="font-medium">{funcionarioEncontrado.informacoesFuncionais[0].setor.nome}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Admissão:</span>
                    <span className="font-medium">{formatarData(funcionarioEncontrado.informacoesFuncionais[0].dataAdmissao)}</span>
                  </div>
                </>
              )}
              <div className="pt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  funcionarioEncontrado.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {funcionarioEncontrado.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="pt-2 text-sm text-blue-600 font-medium">
                Clique para ver a ficha completa →
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => router.push('/sistemas/gp/pages/funcionarios/novo')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Novo Funcionário
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Buscar Funcionário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="text"
                  value={filtros.nome}
                  onChange={e => setFiltros({ ...filtros, nome: e.target.value })}
                  placeholder="Digite o nome"
                  className="w-64"
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  type="text"
                  value={filtros.cpf}
                  onChange={e => setFiltros({ ...filtros, cpf: e.target.value })}
                  placeholder="Digite o CPF"
                  className="w-48"
                />
              </div>
              <Button onClick={buscarFuncionario} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Search className="w-4 h-4 mr-2" /> Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {!funcionarioEncontrado && !buscando && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Buscar Funcionário</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Digite o nome ou CPF do funcionário que deseja encontrar. 
              Você pode buscar por nome parcial ou CPF completo.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 