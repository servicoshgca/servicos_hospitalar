"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GPService, Funcionario } from '../../../services/gpService';
import { TiposEtiquetasService, TipoEtiqueta } from '../../../services/tiposEtiquetasService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, FileText, Building, MapPin, Calendar, Edit, ArrowLeft, Tag, Plus, Trash2 } from 'lucide-react';
import LogsViewer from '@/app/sistemas/gp/components/LogsViewer';

export default function FichaFuncionarioPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para etiquetas
  const [tiposEtiquetas, setTiposEtiquetas] = useState<TipoEtiqueta[]>([]);
  const [etiquetasFuncionario, setEtiquetasFuncionario] = useState<any[]>([]);
  const [mostrarFormEtiqueta, setMostrarFormEtiqueta] = useState(false);
  const [editandoEtiqueta, setEditandoEtiqueta] = useState<any>(null);
  const [novaEtiqueta, setNovaEtiqueta] = useState({
    tipoEtiquetaId: '',
    dataInicio: '',
    dataFim: '',
    arquivoPdf: null as File | null,
    observacoes: ''
  });

  const getPhotoUrl = (foto: string | null | undefined) => {
    if (!foto) return null;
    if (foto.startsWith('http://') || foto.startsWith('https://')) return foto;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads/${foto}`;
  };

  const getPdfUrl = (arquivoPdf: string | null | undefined) => {
    if (!arquivoPdf || !funcionario?.id) return null;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/uploads/funcionarios/${funcionario.id}/${arquivoPdf}`;
  };

  const carregarTiposEtiquetas = async () => {
    try {
      const tipos = await TiposEtiquetasService.findAll();
      setTiposEtiquetas(tipos);
    } catch (error) {
      console.error('Erro ao carregar tipos de etiquetas:', error);
    }
  };

  const carregarEtiquetasFuncionario = async () => {
    try {
      if (funcionario?.id) {
        const etiquetas = await GPService.getEtiquetasFuncionario(funcionario.id);
        setEtiquetasFuncionario(etiquetas);
      }
    } catch (error) {
      console.error('Erro ao carregar etiquetas do funcionário:', error);
    }
  };

  const handleAdicionarEtiqueta = () => {
    setMostrarFormEtiqueta(true);
  };

  const handleCancelarEtiqueta = () => {
    setMostrarFormEtiqueta(false);
    setEditandoEtiqueta(null);
    setNovaEtiqueta({
      tipoEtiquetaId: '',
      dataInicio: '',
      dataFim: '',
      arquivoPdf: null,
      observacoes: ''
    });
  };

  const handleEditarEtiqueta = (etiqueta: any) => {
    setEditandoEtiqueta(etiqueta);
    setNovaEtiqueta({
      tipoEtiquetaId: etiqueta.tipoEtiqueta?.id || '',
      dataInicio: etiqueta.dataInicio ? etiqueta.dataInicio.split('T')[0] : '',
      dataFim: etiqueta.dataFim ? etiqueta.dataFim.split('T')[0] : '',
      arquivoPdf: null,
      observacoes: etiqueta.observacoes || ''
    });
    setMostrarFormEtiqueta(true);
  };

  const handleSalvarEtiqueta = async () => {
    if (!novaEtiqueta.tipoEtiquetaId || !novaEtiqueta.dataInicio || !funcionario?.id) {
      alert('Preencha pelo menos o tipo de etiqueta e a data de início');
      return;
    }

    try {
      let arquivoPdfUrl = null;
      
      // Se há um arquivo para upload, fazer o upload primeiro
      if (novaEtiqueta.arquivoPdf && funcionario?.id) {
        const formData = new FormData();
        formData.append('file', novaEtiqueta.arquivoPdf);
        
        try {
          const pdfUploadResponse = await GPService.uploadPdf(formData, funcionario.id);
          arquivoPdfUrl = pdfUploadResponse.filename; // Usar apenas o filename para salvar no banco
        } catch (uploadError) {
          console.error('Erro no upload do arquivo:', uploadError);
          alert('Erro ao fazer upload do arquivo PDF');
          return;
        }
      }

      // Preparar dados da etiqueta
      const etiquetaData = {
        ...novaEtiqueta,
        arquivoPdf: arquivoPdfUrl || editandoEtiqueta?.arquivoPdf
      };

      if (editandoEtiqueta) {
        await GPService.editarEtiquetaFuncionario(funcionario.id, editandoEtiqueta.id, etiquetaData);
        alert('Etiqueta atualizada com sucesso!');
      } else {
        await GPService.adicionarEtiquetaFuncionario(funcionario.id, etiquetaData);
        alert('Etiqueta adicionada com sucesso!');
      }
      
      // Recarregar etiquetas do funcionário
      await carregarEtiquetasFuncionario();
      handleCancelarEtiqueta();
    } catch (error) {
      console.error('Erro ao salvar etiqueta:', error);
      alert('Erro ao salvar etiqueta');
    }
  };

  const handleRemoverEtiqueta = async (etiquetaId: string) => {
    if (confirm('Tem certeza que deseja remover esta etiqueta?') && funcionario?.id) {
      try {
        await GPService.removerEtiquetaFuncionario(funcionario.id, etiquetaId);
        alert('Etiqueta removida com sucesso!');
        
        // Recarregar etiquetas do funcionário
        await carregarEtiquetasFuncionario();
      } catch (error) {
        console.error('Erro ao remover etiqueta:', error);
        alert('Erro ao remover etiqueta');
      }
    }
  };

  const handleArquivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setNovaEtiqueta({ ...novaEtiqueta, arquivoPdf: file });
    } else {
      alert('Por favor, selecione apenas arquivos PDF');
      event.target.value = '';
    }
  };

  useEffect(() => {
    async function fetchFuncionario() {
      setLoading(true);
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const data = await GPService.getFuncionario(id);
        setFuncionario(data);
        
        // Carregar tipos de etiquetas
        await carregarTiposEtiquetas();
      } catch (error) {
        alert('Erro ao carregar funcionário');
        router.back();
      } finally {
        setLoading(false);
      }
    }
    fetchFuncionario();
  }, [params, router]);

  // Carregar etiquetas quando o funcionário estiver disponível
  useEffect(() => {
    if (funcionario?.id) {
      carregarEtiquetasFuncionario();
    }
  }, [funcionario?.id]);

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (!funcionario) {
    return <div className="p-8 text-center text-red-600">Funcionário não encontrado.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/sistemas/gp')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Ficha do Funcionário</h1>
        </div>
        <Button onClick={() => funcionario.id && router.push(`/sistemas/gp/pages/funcionarios/${funcionario.id}/editar`)}>
          <Edit className="w-4 h-4 mr-2" /> Editar Ficha
        </Button>
      </div>

      {/* Foto e dados principais */}
      <Card>
        <CardContent className="flex flex-col md:flex-row items-center gap-8 p-6">
          <div className="flex-shrink-0">
            {funcionario.foto && getPhotoUrl(funcionario.foto) ? (
              <img
                src={getPhotoUrl(funcionario.foto)!}
                alt="Foto do funcionário"
                className="w-40 h-40 rounded-lg object-cover border-2 border-gray-200 shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                <User className="w-20 h-20 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-semibold">{funcionario.nome}</h2>
            {funcionario.nomeSocial && <div className="text-gray-600">Nome social: {funcionario.nomeSocial}</div>}
            <div className="text-gray-700">CPF: <span className="font-mono">{funcionario.cpf}</span></div>
            {funcionario.genero && <div className="text-gray-700">Gênero: {funcionario.genero}</div>}
            {funcionario.dataNascimento && <div className="text-gray-700">Nascimento: {new Date(funcionario.dataNascimento).toLocaleDateString()}</div>}
            {funcionario.estadoCivil && <div className="text-gray-700">Estado civil: {funcionario.estadoCivil}</div>}
            {funcionario.naturalidade && <div className="text-gray-700">Naturalidade: {funcionario.naturalidade}</div>}
            {funcionario.nacionalidade && <div className="text-gray-700">Nacionalidade: {funcionario.nacionalidade}</div>}
          </div>
        </CardContent>
      </Card>

      {/* Contatos e endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Contatos e Endereço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>Email: <span className="text-gray-700">{funcionario.email || '-'}</span></div>
            <div>Telefone Residencial: <span className="text-gray-700">{funcionario.telefoneResidencial || '-'}</span></div>
            <div>Telefone Celular: <span className="text-gray-700">{funcionario.telefoneCelular || '-'}</span></div>
            <div>Endereço: <span className="text-gray-700">{funcionario.endereco || '-'}</span></div>
            <div>CEP: <span className="text-gray-700">{funcionario.cep || '-'}</span></div>
            <div>Bairro: <span className="text-gray-700">{funcionario.bairro || '-'}</span></div>
            <div>Complemento: <span className="text-gray-700">{funcionario.complemento || '-'}</span></div>
            <div>Cidade: <span className="text-gray-700">{funcionario.cidade || '-'}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>RG: <span className="text-gray-700">{funcionario.rg || '-'}</span></div>
            <div>Data Expedição RG: <span className="text-gray-700">{funcionario.dataExpedicaoRg ? new Date(funcionario.dataExpedicaoRg).toLocaleDateString() : '-'}</span></div>
            <div>Órgão Expedidor RG: <span className="text-gray-700">{funcionario.orgaoExpedidorRg || '-'}</span></div>
            <div>Título de Eleitor: <span className="text-gray-700">{funcionario.tituloEleitor || '-'}</span></div>
            <div>Data Emissão Título: <span className="text-gray-700">{funcionario.dataEmissaoTitulo ? new Date(funcionario.dataEmissaoTitulo).toLocaleDateString() : '-'}</span></div>
            <div>Zona Eleitoral: <span className="text-gray-700">{funcionario.zonaEleitoral || '-'}</span></div>
            <div>Seção Eleitoral: <span className="text-gray-700">{funcionario.secaoEleitoral || '-'}</span></div>
            <div>PIS/PASEP: <span className="text-gray-700">{funcionario.pisPasep || '-'}</span></div>
            <div>CTPS: <span className="text-gray-700">{funcionario.ctps || '-'}</span></div>
            <div>Série CTPS: <span className="text-gray-700">{funcionario.serieCtps || '-'}</span></div>
            <div>Cartão SUS: <span className="text-gray-700">{funcionario.cartaoSus || '-'}</span></div>
            <div>Conselho Profissional: <span className="text-gray-700">{funcionario.conselhoProfissional || '-'}</span></div>
            <div>Número do Conselho: <span className="text-gray-700">{funcionario.numeroConselho || '-'}</span></div>
            <div>Data Expedição Conselho: <span className="text-gray-700">{funcionario.dataExpedicaoConselho ? new Date(funcionario.dataExpedicaoConselho).toLocaleDateString() : '-'}</span></div>
            <div>Número Reservista: <span className="text-gray-700">{funcionario.numeroReservista || '-'}</span></div>
            <div>Ministério: <span className="text-gray-700">{funcionario.ministerio || '-'}</span></div>
            <div>Dispensado: <span className="text-gray-700">{funcionario.dispensado ? 'Sim' : 'Não'}</span></div>
            <div>Tipo Sanguíneo: <span className="text-gray-700">{funcionario.tipoSanguineo || '-'}</span></div>
            <div>Fator RH: <span className="text-gray-700">{funcionario.fatorRh || '-'}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Estacionamento e Veículo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5" /> Estacionamento e Veículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>Número Estacionamento: <span className="text-gray-700">{funcionario.numeroEstacionamento || '-'}</span></div>
            <div>Placa do Veículo: <span className="text-gray-700">{funcionario.placaVeiculo || '-'}</span></div>
            <div>Tipo de Veículo: <span className="text-gray-700">{funcionario.tipoVeiculo || '-'}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Formação Acadêmica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" /> Formação Acadêmica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>Grau de Escolaridade: <span className="text-gray-700">{funcionario.grauEscolaridade || '-'}</span></div>
            <div>Faculdade: <span className="text-gray-700">{funcionario.faculdade || '-'}</span></div>
            <div>Data de Ingresso: <span className="text-gray-700">{funcionario.dataIngresso ? new Date(funcionario.dataIngresso).toLocaleDateString() : '-'}</span></div>
            <div>Data de Conclusão: <span className="text-gray-700">{funcionario.dataConclusao ? new Date(funcionario.dataConclusao).toLocaleDateString() : '-'}</span></div>
            <div>Formação Profissional: <span className="text-gray-700">{funcionario.formacaoProfissional || '-'}</span></div>
            <div>CBO: <span className="text-gray-700">{funcionario.cbo || '-'}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 whitespace-pre-line">{funcionario.observacoes || '-'}</div>
        </CardContent>
      </Card>

      {/* Informações Funcionais */}
      {funcionario.informacoesFuncionais && funcionario.informacoesFuncionais.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5" /> Informações Funcionais</CardTitle>
          </CardHeader>
          <CardContent>
            {funcionario.informacoesFuncionais.map((info, index) => (
              <div key={info.id || index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>Matrícula: <span className="text-gray-700 font-semibold">{info.matricula}</span></div>
                  <div>Cargo: <span className="text-gray-700">{info.cargo}</span></div>
                  <div>Setor: <span className="text-gray-700">{info.setor?.nome || '-'}</span></div>
                  <div>Vínculo: <span className="text-gray-700">{info.vinculo?.nome || '-'}</span></div>
                  <div>Situação: <span className="text-gray-700">{info.situacao}</span></div>
                  <div>Data Admissão: <span className="text-gray-700">{new Date(info.dataAdmissao).toLocaleDateString()}</span></div>
                  {info.dataDemissao && <div>Data Demissão: <span className="text-gray-700">{new Date(info.dataDemissao).toLocaleDateString()}</span></div>}
                  <div>Carga Horária: <span className="text-gray-700">{info.cargaHoraria}</span></div>
                  <div>Salário: <span className="text-gray-700">{info.salario}</span></div>
                  <div>Refeição: <span className="text-gray-700">{info.refeicao ? 'Sim' : 'Não'}</span></div>
                  {info.numeroPastaFisica && <div>Número Pasta Física: <span className="text-gray-700">{info.numeroPastaFisica}</span></div>}
                  {info.rhBahia && <div>RH Bahia: <span className="text-gray-700">{info.rhBahia}</span></div>}
                  <div>Status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    info.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {info.ativo ? 'Ativo' : 'Inativo'}
                  </span></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Etiquetas do Funcionário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Etiquetas do Funcionário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Botão Adicionar Etiqueta */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Gerencie as etiquetas e certificações deste funcionário
              </p>
              <Button onClick={handleAdicionarEtiqueta} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Etiqueta
              </Button>
            </div>

            {/* Formulário para Adicionar Etiqueta */}
            {mostrarFormEtiqueta && (
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editandoEtiqueta ? 'Editar Etiqueta' : 'Nova Etiqueta'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipoEtiqueta">Tipo de Etiqueta *</Label>
                      <select
                        id="tipoEtiqueta"
                        value={novaEtiqueta.tipoEtiquetaId}
                        onChange={(e) => setNovaEtiqueta({ ...novaEtiqueta, tipoEtiquetaId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Selecione um tipo</option>
                        {tiposEtiquetas.map(tipo => (
                          <option key={tipo.id} value={tipo.id}>
                            {tipo.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="dataInicio">Data de Início *</Label>
                      <Input
                        id="dataInicio"
                        type="date"
                        value={novaEtiqueta.dataInicio}
                        onChange={(e) => setNovaEtiqueta({ ...novaEtiqueta, dataInicio: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dataFim">Data de Fim</Label>
                      <Input
                        id="dataFim"
                        type="date"
                        value={novaEtiqueta.dataFim}
                        onChange={(e) => setNovaEtiqueta({ ...novaEtiqueta, dataFim: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="arquivoPdf">Arquivo PDF</Label>
                      <Input
                        id="arquivoPdf"
                        type="file"
                        accept=".pdf"
                        onChange={handleArquivoChange}
                      />
                      {novaEtiqueta.arquivoPdf && (
                        <p className="text-sm text-green-600 mt-1">
                          Arquivo selecionado: {novaEtiqueta.arquivoPdf.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={novaEtiqueta.observacoes}
                      onChange={(e) => setNovaEtiqueta({ ...novaEtiqueta, observacoes: e.target.value })}
                      placeholder="Digite observações sobre esta etiqueta..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleSalvarEtiqueta} className="flex items-center gap-2">
                      {editandoEtiqueta ? (
                        <>
                          <Edit className="w-4 h-4" />
                          Atualizar Etiqueta
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Salvar Etiqueta
                        </>
                      )}
                    </Button>
                    <Button onClick={handleCancelarEtiqueta} variant="outline">
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lista de Etiquetas */}
            {etiquetasFuncionario.length > 0 ? (
              <div className="space-y-3">
                {etiquetasFuncionario.map((etiqueta) => (
                  <Card key={etiqueta.id} className="border-l-4 border-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-blue-600" />
                            <h4 className="font-semibold text-lg">{etiqueta.tipoEtiqueta?.nome}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              etiqueta.tipoEtiqueta?.cor === 'red' ? 'bg-red-100 text-red-800' :
                              etiqueta.tipoEtiqueta?.cor === 'green' ? 'bg-green-100 text-green-800' :
                              etiqueta.tipoEtiqueta?.cor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {etiqueta.tipoEtiqueta?.nome}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Data de Início:</span>
                              <span className="ml-2">{new Date(etiqueta.dataInicio).toLocaleDateString()}</span>
                            </div>
                            {etiqueta.dataFim && (
                              <div>
                                <span className="font-medium text-gray-600">Data de Fim:</span>
                                <span className="ml-2">{new Date(etiqueta.dataFim).toLocaleDateString()}</span>
                              </div>
                            )}
                            {etiqueta.arquivoPdf && (
                              <div>
                                <span className="font-medium text-gray-600">Arquivo:</span>
                                <span className="ml-2">{etiqueta.arquivoPdf}</span>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-gray-600">Adicionado em:</span>
                              <span className="ml-2">{new Date(etiqueta.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          {etiqueta.observacoes && (
                            <div className="mt-3">
                              <span className="font-medium text-gray-600">Observações:</span>
                              <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">{etiqueta.observacoes}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          {etiqueta.arquivoPdf && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex items-center gap-1"
                              onClick={() => {
                                const pdfUrl = getPdfUrl(etiqueta.arquivoPdf);
                                if (pdfUrl) {
                                  window.open(pdfUrl, '_blank');
                                } else {
                                  alert('Erro ao gerar URL do PDF');
                                }
                              }}
                            >
                              <FileText className="w-3 h-3" />
                              Visualizar
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditarEtiqueta(etiqueta)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Editar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleRemoverEtiqueta(etiqueta.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma etiqueta adicionada ainda.</p>
                <p className="text-sm">Clique em "Adicionar Etiqueta" para começar.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Alterações */}
      {funcionario.id && <LogsViewer funcionarioId={funcionario.id} />}
    </div>
  );
} 