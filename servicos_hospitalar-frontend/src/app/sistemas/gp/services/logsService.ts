import { api } from '@/lib/api';

export interface Log {
  id: string;
  acao: 'CREATE' | 'UPDATE' | 'DELETE';
  entidade: string;
  entidadeId: string;
  sistema: string;
  dadosAnteriores?: string;
  dadosNovos?: string;
  usuarioId: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  usuario: {
    id: string;
    funcionario: {
      nome: string;
      cpf: string;
    };
  };
}

export interface LogsOptions {
  sistema?: string;
  entidade?: string;
  usuarioId?: string;
  limit?: number;
  offset?: number;
}

export class LogsService {
  static async findAll(options?: LogsOptions): Promise<Log[]> {
    const params = new URLSearchParams();
    if (options?.sistema) params.append('sistema', options.sistema);
    if (options?.entidade) params.append('entidade', options.entidade);
    if (options?.usuarioId) params.append('usuarioId', options.usuarioId);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await api.get(`/logs?${params.toString()}`);
    return response.data;
  }

  static async findBySistema(sistema: string, options?: { limit?: number; offset?: number }): Promise<Log[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await api.get(`/logs/sistema/${sistema}?${params.toString()}`);
    return response.data;
  }

  static async findByUsuario(usuarioId: string, options?: { limit?: number; offset?: number }): Promise<Log[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await api.get(`/logs/usuario/${usuarioId}?${params.toString()}`);
    return response.data;
  }

  static async findByEntidade(entidade: string, entidadeId: string): Promise<Log[]> {
    const response = await api.get(`/logs/entidade/${entidade}/${entidadeId}`);
    return response.data;
  }

  static async getEstatisticas(sistema?: string): Promise<any> {
    const params = sistema ? `?sistema=${sistema}` : '';
    const response = await api.get(`/logs/estatisticas${params}`);
    return response.data;
  }
} 