import { api } from '@/lib/api';

export interface TipoEtiqueta {
  id: string;
  nome: string;
  icone: string;
  descricao?: string;
  cor?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTipoEtiquetaDto {
  nome: string;
  icone: string;
  descricao?: string;
  cor?: string;
  ativo?: boolean;
}

export interface UpdateTipoEtiquetaDto extends Partial<CreateTipoEtiquetaDto> {}

export interface IconeDisponivel {
  value: string;
  label: string;
  icon: string;
}

export class TiposEtiquetasService {
  static async findAll(): Promise<TipoEtiqueta[]> {
    const response = await api.get('/tipos-etiquetas');
    return response.data;
  }

  static async findOne(id: string): Promise<TipoEtiqueta> {
    const response = await api.get(`/tipos-etiquetas/${id}`);
    return response.data;
  }

  static async create(data: CreateTipoEtiquetaDto): Promise<TipoEtiqueta> {
    const response = await api.post('/tipos-etiquetas', data);
    return response.data;
  }

  static async update(id: string, data: UpdateTipoEtiquetaDto): Promise<TipoEtiqueta> {
    const response = await api.patch(`/tipos-etiquetas/${id}`, data);
    return response.data;
  }

  static async remove(id: string): Promise<TipoEtiqueta> {
    const response = await api.delete(`/tipos-etiquetas/${id}`);
    return response.data;
  }

  static async getIconesDisponiveis(): Promise<IconeDisponivel[]> {
    const response = await api.get('/tipos-etiquetas/icones');
    return response.data;
  }
} 