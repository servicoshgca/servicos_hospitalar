import { api } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Funcionario {
  id: string;
  nome: string;
  nomeSocial?: string;
  genero?: string;
  cpf: string;
  rg?: string;
  dataExpedicaoRg?: string;
  orgaoExpedidorRg?: string;
  dataNascimento?: string;
  naturalidade?: string;
  nacionalidade?: string;
  estadoCivil?: string;
  nomeMae?: string;
  nomePai?: string;
  tipoSanguineo?: string;
  fatorRh?: string;
  foto?: string;

  // Documentos
  tituloEleitor?: string;
  dataEmissaoTitulo?: string;
  zonaEleitoral?: string;
  secaoEleitoral?: string;
  pisPasep?: string;
  ctps?: string;
  serieCtps?: string;
  cartaoSus?: string;
  conselhoProfissional?: string;
  numeroConselho?: string;
  dataExpedicaoConselho?: string;
  numeroReservista?: string;
  ministerio?: string;
  dispensado?: boolean;

  // Contatos e Endereço
  email?: string;
  telefoneResidencial?: string;
  telefoneCelular?: string;
  endereco?: string;
  cep?: string;
  bairro?: string;
  complemento?: string;
  cidade?: string;

  // Informações Funcionais
  informacoesFuncionais: InformacaoFuncional[];

  // Estacionamento e Veículo
  numeroEstacionamento?: string;
  placaVeiculo?: string;
  tipoVeiculo?: string;

  // Formação Acadêmica
  grauEscolaridade?: string;
  faculdade?: string;
  dataIngresso?: string;
  dataConclusao?: string;
  formacaoProfissional?: string;
  cbo?: string;

  // Observações
  observacoes?: string;

  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InformacaoFuncional {
  id?: string;
  funcionarioId?: string;
  matricula: string;
  setorId: string;
  setor?: {
    id: string;
    nome: string;
    sigla: string;
    ativo: boolean;
  };
  cargo: string;
  vinculoId: string;
  vinculo?: {
    id: string;
    nome: string;
    descricao: string;
    ativo: boolean;
  };
  situacao: string;
  dataAdmissao: string;
  dataDemissao?: string;
  cargaHoraria: string;
  salario: string;
  refeicao: boolean;
  numeroPastaFisica?: string;
  rhBahia?: string;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Setor {
  id: string;
  nome: string;
  sigla: string;
  ativo: boolean;
}

export interface CreateFuncionarioDto {
  nome: string;
  cpf: string;
  matricula: string;
  setorId: string;
  ativo?: boolean;
}

export interface UpdateFuncionarioDto extends Partial<CreateFuncionarioDto> {}

export interface CreateSetorDto {
  nome: string;
  descricao?: string;
  imagem?: string;
  telefone?: string;
  email?: string;
  coordenador?: string;
  ativo?: boolean;
}

export interface UpdateSetorDto extends Partial<CreateSetorDto> {}

export interface Vinculo {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export interface CreateVinculoDto {
  nome: string;
  imagem?: string;
  ativo?: boolean;
}

export interface UpdateVinculoDto extends Partial<CreateVinculoDto> {}

export class GPService {
  private static baseUrl = API_BASE_URL;

  static async getFuncionarios(): Promise<Funcionario[]> {
    const response = await api.get('/funcionarios');
    return response.data;
  }

  static async getFuncionario(id: string): Promise<Funcionario> {
    const response = await api.get(`/funcionarios/${id}`);
    return response.data;
  }

  static async createFuncionario(data: Partial<Funcionario>): Promise<Funcionario> {
    console.log('Dados enviados para criação:', data);
    const response = await api.post('/funcionarios', data);

    if (!response.data) {
      console.error('Resposta de erro do servidor:', response);
      throw new Error('Erro ao criar funcionário');
    }

    return response.data;
  }

  static async updateFuncionario(id: string, data: Partial<Funcionario>): Promise<Funcionario> {
    const response = await api.patch(`/funcionarios/${id}`, data);
    return response.data;
  }

  static async deleteFuncionario(id: string): Promise<void> {
    await api.delete(`/funcionarios/${id}`);
  }

  static async getSetores(): Promise<Setor[]> {
    const response = await api.get('/setores');
    return response.data;
  }

  static async createSetor(setor: CreateSetorDto): Promise<Setor> {
    const response = await api.post('/setores', setor);
    return response.data;
  }

  static async updateSetor(id: string, setor: UpdateSetorDto): Promise<Setor> {
    const response = await api.patch(`/setores/${id}`, setor);
    return response.data;
  }

  static async deleteSetor(id: string): Promise<void> {
    await api.delete(`/setores/${id}`);
  }

  static async getEstatisticas() {
    const response = await api.get('/funcionarios/estatisticas');
    return response.data;
  }

  static async createVinculo(vinculo: CreateVinculoDto): Promise<Vinculo> {
    const response = await api.post('/vinculos', vinculo);
    return response.data;
  }

  static async getVinculos(): Promise<Vinculo[]> {
    const response = await api.get('/vinculos');
    return response.data;
  }

  static async updateVinculo(id: string, vinculo: UpdateVinculoDto): Promise<Vinculo> {
    const response = await api.patch(`/vinculos/${id}`, vinculo);
    return response.data;
  }

  static async deleteVinculo(id: string): Promise<void> {
    await api.delete(`/vinculos/${id}`);
  }

  static async uploadFile(formData: FormData): Promise<{ url: string }> {
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async uploadPdf(formData: FormData, funcionarioId: string): Promise<{ url: string; filename: string }> {
    const response = await api.post(`/upload/pdf/${funcionarioId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Métodos para etiquetas de funcionários
  static async getEtiquetasFuncionario(funcionarioId: string) {
    const response = await api.get(`/funcionario-etiquetas/funcionario/${funcionarioId}`);
    return response.data;
  }

  static async adicionarEtiquetaFuncionario(funcionarioId: string, etiquetaData: any) {
    const response = await api.post('/funcionario-etiquetas', {
      funcionarioId,
      tipoEtiquetaId: etiquetaData.tipoEtiquetaId,
      dataInicio: etiquetaData.dataInicio,
      dataFim: etiquetaData.dataFim,
      arquivoPdf: etiquetaData.arquivoPdf,
      observacoes: etiquetaData.observacoes,
    });
    return response.data;
  }

  static async editarEtiquetaFuncionario(funcionarioId: string, etiquetaId: string, etiquetaData: any) {
    const response = await api.patch(`/funcionario-etiquetas/${etiquetaId}`, {
      tipoEtiquetaId: etiquetaData.tipoEtiquetaId,
      dataInicio: etiquetaData.dataInicio,
      dataFim: etiquetaData.dataFim,
      arquivoPdf: etiquetaData.arquivoPdf,
      observacoes: etiquetaData.observacoes,
    });
    return response.data;
  }

  static async removerEtiquetaFuncionario(funcionarioId: string, etiquetaId: string) {
    const response = await api.delete(`/funcionario-etiquetas/${etiquetaId}`);
    return response.data;
  }
} 