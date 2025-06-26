'use client';

import { useState, useEffect } from 'react';
import { GPService, Setor, Vinculo } from '../services/gpService';
import Image from 'next/image';

interface NovoFuncionarioFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NovoFuncionarioForm({ onClose, onSuccess }: NovoFuncionarioFormProps) {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Informações Pessoais
    nome: '',
    nomeSocial: '',
    genero: '',
    cpf: '',
    rg: '',
    dataExpedicaoRg: '',
    orgaoExpedidorRg: '',
    dataNascimento: '',
    naturalidade: '',
    nacionalidade: '',
    estadoCivil: '',
    nomeMae: '',
    nomePai: '',
    tipoSanguineo: '',
    fatorRh: '',
    foto: '',

    // Documentos
    tituloEleitor: '',
    dataEmissaoTitulo: '',
    zonaEleitoral: '',
    secaoEleitoral: '',
    pisPasep: '',
    ctps: '',
    serieCtps: '',
    cartaoSus: '',
    conselhoProfissional: '',
    numeroConselho: '',
    dataExpedicaoConselho: '',
    numeroReservista: '',
    ministerio: '',
    dispensado: false,

    // Contatos e Endereço
    email: '',
    telefoneResidencial: '',
    telefoneCelular: '',
    endereco: '',
    cep: '',
    bairro: '',
    complemento: '',
    cidade: '',

    // Informações Funcionais (array para múltiplos vínculos)
    informacoesFuncionais: [{
      matricula: '',
      setorId: '',
      cargo: '',
      vinculoId: '',
      situacao: 'ATIVO',
      dataAdmissao: '',
      dataDemissao: '',
      cargaHoraria: '',
      salario: '',
      refeicao: true,
      numeroPastaFisica: '',
      rhBahia: '',
    }],

    // Estacionamento e Veículo
    numeroEstacionamento: '',
    placaVeiculo: '',
    tipoVeiculo: '',

    // Formação Acadêmica
    grauEscolaridade: '',
    faculdade: '',
    dataIngresso: '',
    dataConclusao: '',
    formacaoProfissional: '',
    cbo: '',

    // Observações
    observacoes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [setoresData, vinculosData] = await Promise.all([
        GPService.getSetores(),
        GPService.getVinculos()
      ]);

      console.log('Setores carregados:', setoresData);
      console.log('Vínculos carregados:', vinculosData);

      if (!Array.isArray(setoresData) || !Array.isArray(vinculosData)) {
        throw new Error('Dados inválidos recebidos da API');
      }

      setSetores(setoresData);
      setVinculos(vinculosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar setores e vínculos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14); // Limita ao tamanho máximo do CPF com máscara
  };

  const cleanCPF = (cpf: string) => {
    return cpf.replace(/\D/g, '');
  };

  const formatCurrency = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para considerar os centavos
    const amount = parseFloat(numbers) / 100;
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount || 0);
  };

  const parseCurrency = (value: string): string => {
    // Remove formatação e retorna apenas os números
    return value.replace(/\D/g, '');
  };

  const formatDateToISO = (date: string | undefined): string | null => {
    if (!date) return null;
    // Adiciona o horário zero para criar um DateTime válido
    return `${date}T00:00:00.000Z`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Se for o campo CPF, aplica a máscara
    if (name === 'cpf') {
      const formattedValue = formatCPF(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }

    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value.toUpperCase();
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleFuncionalChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Se for o campo de salário, trata a formatação
    if (name === 'salario') {
      const numericValue = parseCurrency(value);
      setFormData(prev => {
        const newInfos = [...prev.informacoesFuncionais];
        newInfos[index] = {
          ...newInfos[index],
          [name]: numericValue
        };
        return {
          ...prev,
          informacoesFuncionais: newInfos
        };
      });
      return;
    }
    
    setFormData(prev => {
      const newInfos = [...prev.informacoesFuncionais];
      newInfos[index] = {
        ...newInfos[index],
        [name]: value
      };
      return {
        ...prev,
        informacoesFuncionais: newInfos
      };
    });
  };

  const addInformacaoFuncional = () => {
    setFormData(prev => ({
      ...prev,
      informacoesFuncionais: [
        ...prev.informacoesFuncionais,
        {
          matricula: '',
          setorId: '',
          cargo: '',
          vinculoId: '',
          situacao: 'ATIVO',
          dataAdmissao: '',
          dataDemissao: '',
          cargaHoraria: '',
          salario: '',
          refeicao: true,
          numeroPastaFisica: '',
          rhBahia: '',
        }
      ]
    }));
  };

  const removeInformacaoFuncional = (index: number) => {
    setFormData(prev => ({
      ...prev,
      informacoesFuncionais: prev.informacoesFuncionais.filter((_, i) => i !== index)
    }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload da foto primeiro se existir
      let fotoUrl = '';
      if (foto) {
        const formData = new FormData();
        formData.append('image', foto);
        const response = await GPService.uploadFile(formData);
        fotoUrl = response.url;
      }

      // Prepara os dados para envio
      const informacoesFuncionaisPreparadas = formData.informacoesFuncionais.map(info => ({
        ...info,
        salario: parseFloat(parseCurrency(info.salario)), // Converte para número
        refeicao: info.refeicao === 'true' || info.refeicao === true,
        dataAdmissao: formatDateToISO(info.dataAdmissao),
        dataDemissao: formatDateToISO(info.dataDemissao),
        ativo: true
      }));

      // Limpa a formatação do CPF e prepara os dados
      const dadosParaEnviar = {
        ...formData,
        cpf: cleanCPF(formData.cpf),
        foto: fotoUrl,
        dataExpedicaoRg: formatDateToISO(formData.dataExpedicaoRg),
        dataNascimento: formatDateToISO(formData.dataNascimento),
        dataEmissaoTitulo: formatDateToISO(formData.dataEmissaoTitulo),
        dataExpedicaoConselho: formatDateToISO(formData.dataExpedicaoConselho),
        dataIngresso: formatDateToISO(formData.dataIngresso),
        dataConclusao: formatDateToISO(formData.dataConclusao),
        informacoesFuncionais: informacoesFuncionaisPreparadas,
        ativo: true
      };

      // Remove campos vazios ou nulos
      Object.keys(dadosParaEnviar).forEach(key => {
        if (dadosParaEnviar[key] === '' || dadosParaEnviar[key] === null || dadosParaEnviar[key] === undefined) {
          delete dadosParaEnviar[key];
        }
      });

      console.log('Dados preparados para envio:', dadosParaEnviar);

      // Enviar dados do funcionário
      await GPService.createFuncionario(dadosParaEnviar);

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar funcionário');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">INFORMAÇÕES PESSOAIS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    {fotoPreview ? (
                      <Image src={fotoPreview} alt="Preview" width={160} height={160} className="object-cover" />
                    ) : (
                      <span className="text-gray-400">FOTO</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">NOME COMPLETO *</label>
                  <input
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NOME SOCIAL</label>
                  <input
                    type="text"
                    name="nomeSocial"
                    value={formData.nomeSocial}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GÊNERO</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">SELECIONE</option>
                    <option value="MASCULINO">MASCULINO</option>
                    <option value="FEMININO">FEMININO</option>
                    <option value="OUTRO">OUTRO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    required
                    maxLength={14}
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">RG</label>
                  <input
                    type="text"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">DATA EXPEDIÇÃO RG</label>
                  <input
                    type="date"
                    name="dataExpedicaoRg"
                    value={formData.dataExpedicaoRg}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ÓRGÃO EXPEDIDOR RG</label>
                  <input
                    type="text"
                    name="orgaoExpedidorRg"
                    value={formData.orgaoExpedidorRg}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">DATA DE NASCIMENTO</label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NATURALIDADE</label>
                  <input
                    type="text"
                    name="naturalidade"
                    value={formData.naturalidade}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NACIONALIDADE</label>
                  <input
                    type="text"
                    name="nacionalidade"
                    value={formData.nacionalidade}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ESTADO CIVIL</label>
                  <select
                    name="estadoCivil"
                    value={formData.estadoCivil}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">SELECIONE</option>
                    <option value="SOLTEIRO">SOLTEIRO(A)</option>
                    <option value="CASADO">CASADO(A)</option>
                    <option value="DIVORCIADO">DIVORCIADO(A)</option>
                    <option value="VIUVO">VIÚVO(A)</option>
                    <option value="UNIAO_ESTAVEL">UNIÃO ESTÁVEL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NOME DA MÃE</label>
                  <input
                    type="text"
                    name="nomeMae"
                    value={formData.nomeMae}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">NOME DO PAI</label>
                  <input
                    type="text"
                    name="nomePai"
                    value={formData.nomePai}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">TIPO SANGUÍNEO</label>
                  <select
                    name="tipoSanguineo"
                    value={formData.tipoSanguineo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">SELECIONE</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">FATOR RH</label>
                  <select
                    name="fatorRh"
                    value={formData.fatorRh}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">SELECIONE</option>
                    <option value="POSITIVO">POSITIVO</option>
                    <option value="NEGATIVO">NEGATIVO</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Documentos */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">DOCUMENTOS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">TÍTULO ELEITORAL</label>
                <input
                  type="text"
                  name="tituloEleitor"
                  value={formData.tituloEleitor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">DATA EMISSÃO TÍTULO</label>
                <input
                  type="date"
                  name="dataEmissaoTitulo"
                  value={formData.dataEmissaoTitulo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZONA ELEITORAL</label>
                <input
                  type="text"
                  name="zonaEleitoral"
                  value={formData.zonaEleitoral}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SEÇÃO ELEITORAL</label>
                <input
                  type="text"
                  name="secaoEleitoral"
                  value={formData.secaoEleitoral}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">PIS/PASEP</label>
                <input
                  type="text"
                  name="pisPasep"
                  value={formData.pisPasep}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CTPS</label>
                <input
                  type="text"
                  name="ctps"
                  value={formData.ctps}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SÉRIE CTPS</label>
                <input
                  type="text"
                  name="serieCtps"
                  value={formData.serieCtps}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CARTÃO SUS</label>
                <input
                  type="text"
                  name="cartaoSus"
                  value={formData.cartaoSus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CONSELHO PROFISSIONAL</label>
                <input
                  type="text"
                  name="conselhoProfissional"
                  value={formData.conselhoProfissional}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">N° CONSELHO</label>
                <input
                  type="text"
                  name="numeroConselho"
                  value={formData.numeroConselho}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">DATA EXPEDIÇÃO CONSELHO</label>
                <input
                  type="date"
                  name="dataExpedicaoConselho"
                  value={formData.dataExpedicaoConselho}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">N° RESERVISTA</label>
                <input
                  type="text"
                  name="numeroReservista"
                  value={formData.numeroReservista}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">MINISTÉRIO</label>
                <input
                  type="text"
                  name="ministerio"
                  value={formData.ministerio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">DISPENSADO</label>
                <select
                  name="dispensado"
                  value={formData.dispensado ? "true" : "false"}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="false">NÃO</option>
                  <option value="true">SIM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contatos e Endereço */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">CONTATOS E ENDEREÇO</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">TELEFONE RESIDENCIAL</label>
                <input
                  type="tel"
                  name="telefoneResidencial"
                  value={formData.telefoneResidencial}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">TELEFONE CELULAR</label>
                <input
                  type="tel"
                  name="telefoneCelular"
                  value={formData.telefoneCelular}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CEP</label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">ENDEREÇO</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">BAIRRO</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">COMPLEMENTO</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CIDADE</label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </div>
          </div>

          {/* Informações Funcionais */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">INFORMAÇÕES FUNCIONAIS</h2>
              <button
                type="button"
                onClick={addInformacaoFuncional}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                ADICIONAR VÍNCULO
              </button>
            </div>
            
            {formData.informacoesFuncionais.map((info, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">VÍNCULO {index + 1}</h3>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeInformacaoFuncional(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      REMOVER
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">MATRÍCULA *</label>
                    <input
                      type="text"
                      name="matricula"
                      value={info.matricula}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SETOR *</label>
                    <select
                      name="setorId"
                      value={info.setorId || ''}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">SELECIONE</option>
                      {setores.map((setor) => (
                        <option key={setor.id} value={setor.id}>
                          {setor.nome.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">VÍNCULO *</label>
                    <select
                      name="vinculoId"
                      value={info.vinculoId || ''}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">SELECIONE</option>
                      {vinculos.map((vinculo) => (
                        <option key={vinculo.id} value={vinculo.id}>
                          {vinculo.nome.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CARGO</label>
                    <input
                      type="text"
                      name="cargo"
                      value={info.cargo}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">DATA DE ADMISSÃO</label>
                    <input
                      type="date"
                      name="dataAdmissao"
                      value={info.dataAdmissao}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">DATA DE DEMISSÃO</label>
                    <input
                      type="date"
                      name="dataDemissao"
                      value={info.dataDemissao}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CARGA HORÁRIA</label>
                    <select
                      name="cargaHoraria"
                      value={info.cargaHoraria}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">SELECIONE</option>
                      <option value="220H">220H</option>
                      <option value="240H">240H</option>
                      <option value="180H">180H</option>
                      <option value="150H">150H</option>
                      <option value="120H">120H</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SALÁRIO</label>
                    <input
                      type="text"
                      name="salario"
                      value={formatCurrency(info.salario || '0')}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="R$ 0,00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">REFEIÇÃO</label>
                    <select
                      name="refeicao"
                      value={info.refeicao ? "true" : "false"}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="true">SIM</option>
                      <option value="false">NÃO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">N° PASTA FÍSICA</label>
                    <input
                      type="text"
                      name="numeroPastaFisica"
                      value={info.numeroPastaFisica}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">RH BAHIA</label>
                    <input
                      type="text"
                      name="rhBahia"
                      value={info.rhBahia}
                      onChange={(e) => handleFuncionalChange(index, e)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estacionamento e Veículo */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">ESTACIONAMENTO E VEÍCULO</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">N° ESTACIONAMENTO</label>
                <input
                  type="text"
                  name="numeroEstacionamento"
                  value={formData.numeroEstacionamento}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">PLACA DO VEÍCULO</label>
                <input
                  type="text"
                  name="placaVeiculo"
                  value={formData.placaVeiculo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">TIPO DE VEÍCULO</label>
                <select
                  name="tipoVeiculo"
                  value={formData.tipoVeiculo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">SELECIONE</option>
                  <option value="CARRO">CARRO</option>
                  <option value="MOTO">MOTO</option>
                  <option value="OUTRO">OUTRO</option>
                </select>
              </div>
            </div>
          </div>

          {/* Formação Acadêmica */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">FORMAÇÃO ACADÊMICA</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">GRAU DE ESCOLARIDADE</label>
                <select
                  name="grauEscolaridade"
                  value={formData.grauEscolaridade}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">SELECIONE</option>
                  <option value="FUNDAMENTAL_INCOMPLETO">FUNDAMENTAL INCOMPLETO</option>
                  <option value="FUNDAMENTAL_COMPLETO">FUNDAMENTAL COMPLETO</option>
                  <option value="MEDIO_INCOMPLETO">MÉDIO INCOMPLETO</option>
                  <option value="MEDIO_COMPLETO">MÉDIO COMPLETO</option>
                  <option value="SUPERIOR_INCOMPLETO">SUPERIOR INCOMPLETO</option>
                  <option value="SUPERIOR_COMPLETO">SUPERIOR COMPLETO</option>
                  <option value="POS_GRADUACAO">PÓS-GRADUAÇÃO</option>
                  <option value="MESTRADO">MESTRADO</option>
                  <option value="DOUTORADO">DOUTORADO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">FACULDADE</label>
                <input
                  type="text"
                  name="faculdade"
                  value={formData.faculdade}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">DATA DE INGRESSO</label>
                <input
                  type="date"
                  name="dataIngresso"
                  value={formData.dataIngresso}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">DATA DE CONCLUSÃO</label>
                <input
                  type="date"
                  name="dataConclusao"
                  value={formData.dataConclusao}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">FORMAÇÃO PROFISSIONAL</label>
                <input
                  type="text"
                  name="formacaoProfissional"
                  value={formData.formacaoProfissional}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CBO</label>
                <input
                  type="text"
                  name="cbo"
                  value={formData.cbo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">OBSERVAÇÕES</h2>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              SALVAR
            </button>
          </div>
        </>
      )}
    </form>
  );
} 