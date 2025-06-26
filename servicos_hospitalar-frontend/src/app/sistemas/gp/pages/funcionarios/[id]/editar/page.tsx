"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GPService, Funcionario, InformacaoFuncional, Setor, Vinculo } from '../../../../services/gpService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { User, FileText, Building, MapPin, Calendar, Camera, Upload, Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function EditarFuncionarioPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [funcionarioId, setFuncionarioId] = useState<string>('');

  // Foto
  const [foto, setFoto] = useState<string>('');
  const [fotoPreview, setFotoPreview] = useState<string>('');
  const [uploadingFoto, setUploadingFoto] = useState(false);

  // Informações Pessoais
  const [nome, setNome] = useState('');
  const [nomeSocial, setNomeSocial] = useState('');
  const [genero, setGenero] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [dataExpedicaoRg, setDataExpedicaoRg] = useState('');
  const [orgaoExpedidorRg, setOrgaoExpedidorRg] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [naturalidade, setNaturalidade] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [nomePai, setNomePai] = useState('');
  const [tipoSanguineo, setTipoSanguineo] = useState('');
  const [fatorRh, setFatorRh] = useState('');

  // Documentos
  const [tituloEleitor, setTituloEleitor] = useState('');
  const [dataEmissaoTitulo, setDataEmissaoTitulo] = useState('');
  const [zonaEleitoral, setZonaEleitoral] = useState('');
  const [secaoEleitoral, setSecaoEleitoral] = useState('');
  const [pisPasep, setPisPasep] = useState('');
  const [ctps, setCtps] = useState('');
  const [serieCtps, setSerieCtps] = useState('');
  const [cartaoSus, setCartaoSus] = useState('');
  const [conselhoProfissional, setConselhoProfissional] = useState('');
  const [numeroConselho, setNumeroConselho] = useState('');
  const [dataExpedicaoConselho, setDataExpedicaoConselho] = useState('');
  const [numeroReservista, setNumeroReservista] = useState('');
  const [ministerio, setMinisterio] = useState('');
  const [dispensado, setDispensado] = useState(false);

  // Contatos e Endereço
  const [email, setEmail] = useState('');
  const [telefoneResidencial, setTelefoneResidencial] = useState('');
  const [telefoneCelular, setTelefoneCelular] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');

  // Estacionamento e Veículo
  const [numeroEstacionamento, setNumeroEstacionamento] = useState('');
  const [placaVeiculo, setPlacaVeiculo] = useState('');
  const [tipoVeiculo, setTipoVeiculo] = useState('');

  // Formação Acadêmica
  const [grauEscolaridade, setGrauEscolaridade] = useState('');
  const [faculdade, setFaculdade] = useState('');
  const [dataIngresso, setDataIngresso] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');
  const [formacaoProfissional, setFormacaoProfissional] = useState('');
  const [cbo, setCbo] = useState('');

  // Observações
  const [observacoes, setObservacoes] = useState('');

  // Informações Funcionais
  const [informacoesFuncionais, setInformacoesFuncionais] = useState<InformacaoFuncional[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);

  // Função auxiliar para converter texto para maiúsculo
  const toUpperCase = (value: string) => value.toUpperCase();

  // Handlers para campos que devem ser convertidos para maiúsculo
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value.toUpperCase());
  };

  const handleNomeSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeSocial(e.target.value.toUpperCase());
  };

  const handleRgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRg(e.target.value.toUpperCase());
  };

  const handleOrgaoExpedidorRgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrgaoExpedidorRg(e.target.value.toUpperCase());
  };

  const handleNaturalidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNaturalidade(e.target.value.toUpperCase());
  };

  const handleNacionalidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNacionalidade(e.target.value.toUpperCase());
  };

  const handleNomeMaeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeMae(e.target.value.toUpperCase());
  };

  const handleNomePaiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomePai(e.target.value.toUpperCase());
  };

  const handleTituloEleitorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTituloEleitor(e.target.value.toUpperCase());
  };

  const handleZonaEleitoralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZonaEleitoral(e.target.value.toUpperCase());
  };

  const handleSecaoEleitoralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecaoEleitoral(e.target.value.toUpperCase());
  };

  const handlePisPasepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPisPasep(e.target.value.toUpperCase());
  };

  const handleCtpsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCtps(e.target.value.toUpperCase());
  };

  const handleSerieCtpsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSerieCtps(e.target.value.toUpperCase());
  };

  const handleCartaoSusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCartaoSus(e.target.value.toUpperCase());
  };

  const handleConselhoProfissionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConselhoProfissional(e.target.value.toUpperCase());
  };

  const handleNumeroConselhoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumeroConselho(e.target.value.toUpperCase());
  };

  const handleNumeroReservistaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumeroReservista(e.target.value.toUpperCase());
  };

  const handleMinisterioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinisterio(e.target.value.toUpperCase());
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndereco(e.target.value.toUpperCase());
  };

  const handleBairroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBairro(e.target.value.toUpperCase());
  };

  const handleComplementoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComplemento(e.target.value.toUpperCase());
  };

  const handleCidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCidade(e.target.value.toUpperCase());
  };

  const handlePlacaVeiculoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlacaVeiculo(e.target.value.toUpperCase());
  };

  const handleFaculdadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFaculdade(e.target.value.toUpperCase());
  };

  const handleFormacaoProfissionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormacaoProfissional(e.target.value.toUpperCase());
  };

  const handleCboChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCbo(e.target.value.toUpperCase());
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

  // Handlers para informações funcionais
  const handleMatriculaChange = (index: number, value: string) => {
    atualizarInformacaoFuncional(index, 'matricula', value.toUpperCase());
  };

  const handleCargoChange = (index: number, value: string) => {
    atualizarInformacaoFuncional(index, 'cargo', value.toUpperCase());
  };

  const handleNumeroPastaFisicaChange = (index: number, value: string) => {
    atualizarInformacaoFuncional(index, 'numeroPastaFisica', value.toUpperCase());
  };

  const handleRhBahiaChange = (index: number, value: string) => {
    atualizarInformacaoFuncional(index, 'rhBahia', value.toUpperCase());
  };

  const handleFotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploadingFoto(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await GPService.uploadFile(formData);
      
      // Atualizar a foto com o nome do arquivo retornado
      const fileName = response.url.split('/').pop() || '';
      setFoto(fileName);
      
      // Criar preview da nova foto
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      alert('Erro ao fazer upload da foto');
    } finally {
      setUploadingFoto(false);
    }
  };

  const removerFoto = () => {
    setFoto('');
    setFotoPreview('');
  };

  const carregarDadosAuxiliares = async () => {
    try {
      const [setoresData, vinculosData] = await Promise.all([
        GPService.getSetores(),
        GPService.getVinculos()
      ]);
      setSetores(setoresData);
      setVinculos(vinculosData);
    } catch (error) {
      console.error('Erro ao carregar dados auxiliares:', error);
    }
  };

  const adicionarInformacaoFuncional = () => {
    const novaInfo: InformacaoFuncional = {
      matricula: '',
      setorId: '',
      cargo: '',
      vinculoId: '',
      situacao: 'ATIVO',
      dataAdmissao: new Date().toISOString(),
      cargaHoraria: '',
      salario: '0',
      refeicao: true,
      ativo: true
    };
    setInformacoesFuncionais([...informacoesFuncionais, novaInfo]);
  };

  const removerInformacaoFuncional = (index: number) => {
    const novasInfos = informacoesFuncionais.filter((_, i) => i !== index);
    setInformacoesFuncionais(novasInfos);
  };

  const atualizarInformacaoFuncional = (index: number, campo: keyof InformacaoFuncional, valor: any) => {
    const novasInfos = [...informacoesFuncionais];
    novasInfos[index] = { ...novasInfos[index], [campo]: valor };
    setInformacoesFuncionais(novasInfos);
  };

  useEffect(() => {
    async function fetchFuncionario() {
      setLoading(true);
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setFuncionarioId(id);
        
        // Carregar dados auxiliares
        await carregarDadosAuxiliares();
        
        const data = await GPService.getFuncionario(id);
        setFuncionario(data);
        
        // Preencher foto
        setFoto(data.foto || '');
        
        // Preencher todos os campos
        setNome(data.nome || '');
        setNomeSocial(data.nomeSocial || '');
        setGenero(data.genero || '');
        setCpf(data.cpf || '');
        setRg(data.rg || '');
        setDataExpedicaoRg(data.dataExpedicaoRg ? data.dataExpedicaoRg.split('T')[0] : '');
        setOrgaoExpedidorRg(data.orgaoExpedidorRg || '');
        setDataNascimento(data.dataNascimento ? data.dataNascimento.split('T')[0] : '');
        setEstadoCivil(data.estadoCivil || '');
        setNaturalidade(data.naturalidade || '');
        setNacionalidade(data.nacionalidade || '');
        setNomeMae(data.nomeMae || '');
        setNomePai(data.nomePai || '');
        setTipoSanguineo(data.tipoSanguineo || '');
        setFatorRh(data.fatorRh || '');
        
        setTituloEleitor(data.tituloEleitor || '');
        setDataEmissaoTitulo(data.dataEmissaoTitulo ? data.dataEmissaoTitulo.split('T')[0] : '');
        setZonaEleitoral(data.zonaEleitoral || '');
        setSecaoEleitoral(data.secaoEleitoral || '');
        setPisPasep(data.pisPasep || '');
        setCtps(data.ctps || '');
        setSerieCtps(data.serieCtps || '');
        setCartaoSus(data.cartaoSus || '');
        setConselhoProfissional(data.conselhoProfissional || '');
        setNumeroConselho(data.numeroConselho || '');
        setDataExpedicaoConselho(data.dataExpedicaoConselho ? data.dataExpedicaoConselho.split('T')[0] : '');
        setNumeroReservista(data.numeroReservista || '');
        setMinisterio(data.ministerio || '');
        setDispensado(data.dispensado || false);
        
        setEmail(data.email || '');
        setTelefoneResidencial(data.telefoneResidencial || '');
        setTelefoneCelular(data.telefoneCelular || '');
        setEndereco(data.endereco || '');
        setCep(data.cep || '');
        setBairro(data.bairro || '');
        setComplemento(data.complemento || '');
        setCidade(data.cidade || '');
        
        setNumeroEstacionamento(data.numeroEstacionamento || '');
        setPlacaVeiculo(data.placaVeiculo || '');
        setTipoVeiculo(data.tipoVeiculo || '');
        
        setGrauEscolaridade(data.grauEscolaridade || '');
        setFaculdade(data.faculdade || '');
        setDataIngresso(data.dataIngresso ? data.dataIngresso.split('T')[0] : '');
        setDataConclusao(data.dataConclusao ? data.dataConclusao.split('T')[0] : '');
        setFormacaoProfissional(data.formacaoProfissional || '');
        setCbo(data.cbo || '');
        
        setObservacoes(data.observacoes || '');
        
        // Preencher informações funcionais
        setInformacoesFuncionais(data.informacoesFuncionais || []);
      } catch (error) {
        alert('Erro ao carregar funcionário');
        router.back();
      } finally {
        setLoading(false);
      }
    }
    fetchFuncionario();
  }, [params, router]);

  const handleSalvar = async () => {
    setSaving(true);
    try {
      const dadosAtualizados = {
        nome,
        nomeSocial,
        genero,
        cpf,
        rg,
        dataExpedicaoRg: dataExpedicaoRg ? new Date(dataExpedicaoRg).toISOString() : null,
        orgaoExpedidorRg,
        dataNascimento: dataNascimento ? new Date(dataNascimento).toISOString() : null,
        estadoCivil,
        naturalidade,
        nacionalidade,
        nomeMae,
        nomePai,
        tipoSanguineo,
        fatorRh,
        tituloEleitor,
        dataEmissaoTitulo: dataEmissaoTitulo ? new Date(dataEmissaoTitulo).toISOString() : null,
        zonaEleitoral,
        secaoEleitoral,
        pisPasep,
        ctps,
        serieCtps,
        cartaoSus,
        conselhoProfissional,
        numeroConselho,
        dataExpedicaoConselho: dataExpedicaoConselho ? new Date(dataExpedicaoConselho).toISOString() : null,
        numeroReservista,
        ministerio,
        dispensado,
        email,
        telefoneResidencial,
        telefoneCelular,
        endereco,
        cep,
        bairro,
        complemento,
        cidade,
        numeroEstacionamento,
        placaVeiculo,
        tipoVeiculo,
        grauEscolaridade,
        faculdade,
        dataIngresso: dataIngresso ? new Date(dataIngresso).toISOString() : null,
        dataConclusao: dataConclusao ? new Date(dataConclusao).toISOString() : null,
        formacaoProfissional,
        cbo,
        observacoes,
        foto,
        informacoesFuncionais,
      };

      await GPService.updateFuncionario(funcionarioId, dadosAtualizados);
      alert('Dados salvos com sucesso!');
      router.push(`/sistemas/gp/pages/funcionarios/${funcionarioId}`);
    } catch (error) {
      alert('Erro ao salvar dados');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (!funcionario) {
    return <div className="p-8 text-center text-red-600">Funcionário não encontrado.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/sistemas/gp/pages/funcionarios/${funcionarioId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Ficha
          </Button>
          <h1 className="text-3xl font-bold">Editar Ficha de Funcionário</h1>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleSalvar} disabled={saving} size="lg">
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <Button variant="outline" onClick={() => router.back()} size="lg">
            Cancelar
          </Button>
        </div>
      </div>

      {/* Foto do Funcionário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Foto do Funcionário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Preview da Foto */}
            <div className="flex-shrink-0">
              <div className="relative">
                {(foto || fotoPreview) ? (
                  <img
                    src={fotoPreview || getPhotoUrl(foto)}
                    alt="Foto do funcionário"
                    className="w-48 h-48 rounded-lg object-cover border-2 border-gray-200 shadow-lg"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                    <User className="w-24 h-24 text-gray-400" />
                  </div>
                )}
                {uploadingFoto && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Fazendo upload...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controles de Upload */}
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="foto">Selecionar Nova Foto</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFotoUpload}
                    disabled={uploadingFoto}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('foto')?.click()}
                    disabled={uploadingFoto}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Escolher
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                </p>
              </div>

              {(foto || fotoPreview) && (
                <div>
                  <Button
                    variant="destructive"
                    onClick={removerFoto}
                    disabled={uploadingFoto}
                    size="sm"
                  >
                    Remover Foto
                  </Button>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p><strong>Dica:</strong> Use uma foto de boa qualidade, preferencialmente 3x4 ou similar.</p>
                <p>A foto será exibida na ficha do funcionário e nos cards de busca.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input id="nome" value={nome} onChange={handleNomeChange} required />
            </div>
            <div>
              <Label htmlFor="nomeSocial">Nome Social</Label>
              <Input id="nomeSocial" value={nomeSocial} onChange={handleNomeSocialChange} />
            </div>
            <div>
              <Label htmlFor="genero">Gênero</Label>
              <select
                id="genero"
                value={genero}
                onChange={e => setGenero(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input id="cpf" value={cpf} onChange={e => setCpf(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="rg">RG</Label>
              <Input id="rg" value={rg} onChange={handleRgChange} />
            </div>
            <div>
              <Label htmlFor="dataExpedicaoRg">Data de Expedição do RG</Label>
              <Input id="dataExpedicaoRg" type="date" value={dataExpedicaoRg} onChange={e => setDataExpedicaoRg(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="orgaoExpedidorRg">Órgão Expedidor do RG</Label>
              <Input id="orgaoExpedidorRg" value={orgaoExpedidorRg} onChange={handleOrgaoExpedidorRgChange} />
            </div>
            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input id="dataNascimento" type="date" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <select
                id="estadoCivil"
                value={estadoCivil}
                onChange={e => setEstadoCivil(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="SOLTEIRO">Solteiro(a)</option>
                <option value="CASADO">Casado(a)</option>
                <option value="DIVORCIADO">Divorciado(a)</option>
                <option value="VIUVO">Viúvo(a)</option>
                <option value="UNIAO_ESTAVEL">União Estável</option>
              </select>
            </div>
            <div>
              <Label htmlFor="naturalidade">Naturalidade</Label>
              <Input id="naturalidade" value={naturalidade} onChange={handleNaturalidadeChange} />
            </div>
            <div>
              <Label htmlFor="nacionalidade">Nacionalidade</Label>
              <Input id="nacionalidade" value={nacionalidade} onChange={handleNacionalidadeChange} />
            </div>
            <div>
              <Label htmlFor="nomeMae">Nome da Mãe</Label>
              <Input id="nomeMae" value={nomeMae} onChange={handleNomeMaeChange} />
            </div>
            <div>
              <Label htmlFor="nomePai">Nome do Pai</Label>
              <Input id="nomePai" value={nomePai} onChange={handleNomePaiChange} />
            </div>
            <div>
              <Label htmlFor="tipoSanguineo">Tipo Sanguíneo</Label>
              <select
                id="tipoSanguineo"
                value={tipoSanguineo}
                onChange={e => setTipoSanguineo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
            <div>
              <Label htmlFor="fatorRh">Fator RH</Label>
              <select
                id="fatorRh"
                value={fatorRh}
                onChange={e => setFatorRh(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="POSITIVO">Positivo</option>
                <option value="NEGATIVO">Negativo</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="tituloEleitor">Título de Eleitor</Label>
              <Input id="tituloEleitor" value={tituloEleitor} onChange={handleTituloEleitorChange} />
            </div>
            <div>
              <Label htmlFor="dataEmissaoTitulo">Data de Emissão do Título</Label>
              <Input id="dataEmissaoTitulo" type="date" value={dataEmissaoTitulo} onChange={e => setDataEmissaoTitulo(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="zonaEleitoral">Zona Eleitoral</Label>
              <Input id="zonaEleitoral" value={zonaEleitoral} onChange={handleZonaEleitoralChange} />
            </div>
            <div>
              <Label htmlFor="secaoEleitoral">Seção Eleitoral</Label>
              <Input id="secaoEleitoral" value={secaoEleitoral} onChange={handleSecaoEleitoralChange} />
            </div>
            <div>
              <Label htmlFor="pisPasep">PIS/PASEP</Label>
              <Input id="pisPasep" value={pisPasep} onChange={handlePisPasepChange} />
            </div>
            <div>
              <Label htmlFor="ctps">CTPS</Label>
              <Input id="ctps" value={ctps} onChange={handleCtpsChange} />
            </div>
            <div>
              <Label htmlFor="serieCtps">Série CTPS</Label>
              <Input id="serieCtps" value={serieCtps} onChange={handleSerieCtpsChange} />
            </div>
            <div>
              <Label htmlFor="cartaoSus">Cartão SUS</Label>
              <Input id="cartaoSus" value={cartaoSus} onChange={handleCartaoSusChange} />
            </div>
            <div>
              <Label htmlFor="conselhoProfissional">Conselho Profissional</Label>
              <Input id="conselhoProfissional" value={conselhoProfissional} onChange={handleConselhoProfissionalChange} />
            </div>
            <div>
              <Label htmlFor="numeroConselho">Número do Conselho</Label>
              <Input id="numeroConselho" value={numeroConselho} onChange={handleNumeroConselhoChange} />
            </div>
            <div>
              <Label htmlFor="dataExpedicaoConselho">Data de Expedição do Conselho</Label>
              <Input id="dataExpedicaoConselho" value={dataExpedicaoConselho} onChange={e => setDataExpedicaoConselho(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="numeroReservista">Número Reservista</Label>
              <Input id="numeroReservista" value={numeroReservista} onChange={handleNumeroReservistaChange} />
            </div>
            <div>
              <Label htmlFor="ministerio">Ministério</Label>
              <Input id="ministerio" value={ministerio} onChange={handleMinisterioChange} />
            </div>
            <div>
              <Label htmlFor="dispensado">Dispensado</Label>
              <select
                id="dispensado"
                value={dispensado ? "true" : "false"}
                onChange={e => setDispensado(e.target.value === "true")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contatos e Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Contatos e Endereço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="telefoneResidencial">Telefone Residencial</Label>
              <Input id="telefoneResidencial" value={telefoneResidencial} onChange={e => setTelefoneResidencial(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="telefoneCelular">Telefone Celular</Label>
              <Input id="telefoneCelular" value={telefoneCelular} onChange={e => setTelefoneCelular(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" value={endereco} onChange={handleEnderecoChange} />
            </div>
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input id="cep" value={cep} onChange={e => setCep(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" value={bairro} onChange={handleBairroChange} />
            </div>
            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" value={complemento} onChange={handleComplementoChange} />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={cidade} onChange={handleCidadeChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estacionamento e Veículo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Estacionamento e Veículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numeroEstacionamento">Número Estacionamento</Label>
              <Input id="numeroEstacionamento" value={numeroEstacionamento} onChange={e => setNumeroEstacionamento(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="placaVeiculo">Placa do Veículo</Label>
              <Input id="placaVeiculo" value={placaVeiculo} onChange={handlePlacaVeiculoChange} />
            </div>
            <div>
              <Label htmlFor="tipoVeiculo">Tipo de Veículo</Label>
              <select
                id="tipoVeiculo"
                value={tipoVeiculo}
                onChange={e => setTipoVeiculo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="CARRO">Carro</option>
                <option value="MOTO">Moto</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formação Acadêmica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Formação Acadêmica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="grauEscolaridade">Grau de Escolaridade</Label>
              <select
                id="grauEscolaridade"
                value={grauEscolaridade}
                onChange={e => setGrauEscolaridade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="FUNDAMENTAL_INCOMPLETO">Fundamental Incompleto</option>
                <option value="FUNDAMENTAL_COMPLETO">Fundamental Completo</option>
                <option value="MEDIO_INCOMPLETO">Médio Incompleto</option>
                <option value="MEDIO_COMPLETO">Médio Completo</option>
                <option value="SUPERIOR_INCOMPLETO">Superior Incompleto</option>
                <option value="SUPERIOR_COMPLETO">Superior Completo</option>
                <option value="POS_GRADUACAO">Pós-Graduação</option>
                <option value="MESTRADO">Mestrado</option>
                <option value="DOUTORADO">Doutorado</option>
              </select>
            </div>
            <div>
              <Label htmlFor="faculdade">Faculdade</Label>
              <Input id="faculdade" value={faculdade} onChange={handleFaculdadeChange} />
            </div>
            <div>
              <Label htmlFor="dataIngresso">Data de Ingresso</Label>
              <Input id="dataIngresso" type="date" value={dataIngresso} onChange={e => setDataIngresso(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="dataConclusao">Data de Conclusão</Label>
              <Input id="dataConclusao" type="date" value={dataConclusao} onChange={e => setDataConclusao(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="formacaoProfissional">Formação Profissional</Label>
              <Input id="formacaoProfissional" value={formacaoProfissional} onChange={handleFormacaoProfissionalChange} />
            </div>
            <div>
              <Label htmlFor="cbo">CBO</Label>
              <Input id="cbo" value={cbo} onChange={handleCboChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Funcionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Informações Funcionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {informacoesFuncionais.map((info, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Informação Funcional #{index + 1}</h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removerInformacaoFuncional(index)}
                    disabled={informacoesFuncionais.length === 1}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`matricula-${index}`}>Matrícula *</Label>
                    <Input
                      id={`matricula-${index}`}
                      value={info.matricula}
                      onChange={e => handleMatriculaChange(index, e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`setor-${index}`}>Setor *</Label>
                    <select
                      id={`setor-${index}`}
                      value={info.setorId}
                      onChange={e => atualizarInformacaoFuncional(index, 'setorId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione um setor</option>
                      {setores.map(setor => (
                        <option key={setor.id} value={setor.id}>
                          {setor.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`cargo-${index}`}>Cargo *</Label>
                    <Input
                      id={`cargo-${index}`}
                      value={info.cargo}
                      onChange={e => handleCargoChange(index, e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`vinculo-${index}`}>Vínculo *</Label>
                    <select
                      id={`vinculo-${index}`}
                      value={info.vinculoId}
                      onChange={e => atualizarInformacaoFuncional(index, 'vinculoId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione um vínculo</option>
                      {vinculos.map(vinculo => (
                        <option key={vinculo.id} value={vinculo.id}>
                          {vinculo.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`situacao-${index}`}>Situação</Label>
                    <select
                      id={`situacao-${index}`}
                      value={info.situacao}
                      onChange={e => atualizarInformacaoFuncional(index, 'situacao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ATIVO">Ativo</option>
                      <option value="INATIVO">Inativo</option>
                      <option value="FERIAS">Férias</option>
                      <option value="LICENCA">Licença</option>
                      <option value="APOSENTADO">Aposentado</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`dataAdmissao-${index}`}>Data de Admissão *</Label>
                    <Input
                      id={`dataAdmissao-${index}`}
                      type="date"
                      value={info.dataAdmissao ? info.dataAdmissao.split('T')[0] : ''}
                      onChange={e => atualizarInformacaoFuncional(index, 'dataAdmissao', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`dataDemissao-${index}`}>Data de Demissão</Label>
                    <Input
                      id={`dataDemissao-${index}`}
                      type="date"
                      value={info.dataDemissao ? info.dataDemissao.split('T')[0] : ''}
                      onChange={e => atualizarInformacaoFuncional(index, 'dataDemissao', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`cargaHoraria-${index}`}>Carga Horária *</Label>
                    <select
                      id={`cargaHoraria-${index}`}
                      value={info.cargaHoraria}
                      onChange={e => atualizarInformacaoFuncional(index, 'cargaHoraria', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="220H">220H</option>
                      <option value="240H">240H</option>
                      <option value="180H">180H</option>
                      <option value="150H">150H</option>
                      <option value="120H">120H</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`salario-${index}`}>Salário *</Label>
                    <Input
                      id={`salario-${index}`}
                      value={info.salario}
                      onChange={e => atualizarInformacaoFuncional(index, 'salario', e.target.value)}
                      placeholder="Ex: 2000.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`numeroPastaFisica-${index}`}>Número Pasta Física</Label>
                    <Input
                      id={`numeroPastaFisica-${index}`}
                      value={info.numeroPastaFisica || ''}
                      onChange={e => handleNumeroPastaFisicaChange(index, e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`rhBahia-${index}`}>RH Bahia</Label>
                    <Input
                      id={`rhBahia-${index}`}
                      value={info.rhBahia || ''}
                      onChange={e => handleRhBahiaChange(index, e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`refeicao-${index}`}>Refeição</Label>
                    <select
                      id={`refeicao-${index}`}
                      value={info.refeicao ? "true" : "false"}
                      onChange={e => atualizarInformacaoFuncional(index, 'refeicao', e.target.value === "true")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`ativo-${index}`}
                      checked={info.ativo}
                      onCheckedChange={(checked) => atualizarInformacaoFuncional(index, 'ativo', checked)}
                    />
                    <Label htmlFor={`ativo-${index}`}>Ativo</Label>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={adicionarInformacaoFuncional}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Informação Funcional
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Observações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea 
              id="observacoes" 
              value={observacoes} 
              onChange={e => setObservacoes(e.target.value)}
              rows={4}
              placeholder="Digite observações sobre o funcionário..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex justify-center gap-4 pt-6">
        <Button onClick={handleSalvar} disabled={saving} size="lg">
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
        <Button variant="outline" onClick={() => router.back()} size="lg">
          Cancelar
        </Button>
      </div>
    </div>
  );
} 