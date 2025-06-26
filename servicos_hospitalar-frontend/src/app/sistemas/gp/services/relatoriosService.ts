import { api } from '@/lib/api';

export interface RelatorioParams {
  dataInicio?: string;
  dataFim?: string;
  formato?: 'PDF' | 'Excel';
}

export class RelatoriosService {
  static async gerarRelatorio(tipo: string, params: RelatorioParams) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.dataInicio) {
        queryParams.append('dataInicio', params.dataInicio);
      }
      
      if (params.dataFim) {
        queryParams.append('dataFim', params.dataFim);
      }

      const response = await api.get(`/relatorios/${tipo}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao gerar relatório ${tipo}:`, error);
      throw error;
    }
  }

  static async listarTiposRelatorios() {
    try {
      const response = await api.get('/relatorios/tipos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar tipos de relatórios:', error);
      throw error;
    }
  }

  // Métodos específicos para cada tipo de relatório
  static async gerarRelatorioTurnover(params: RelatorioParams) {
    return this.gerarRelatorio('turnover', params);
  }

  static async gerarRelatorioAbsenteismo(params: RelatorioParams) {
    return this.gerarRelatorio('absenteismo', params);
  }

  static async gerarRelatorioDesempenho(params: RelatorioParams) {
    return this.gerarRelatorio('desempenho', params);
  }

  static async gerarRelatorioTreinamentos(params: RelatorioParams) {
    return this.gerarRelatorio('treinamentos', params);
  }

  static async gerarRelatorioCustosRH(params: RelatorioParams) {
    return this.gerarRelatorio('custos-rh', params);
  }

  static async gerarRelatorioDiversidade() {
    return this.gerarRelatorio('diversidade', {});
  }

  static async gerarRelatorioAcessos(params: RelatorioParams) {
    return this.gerarRelatorio('acessos', params);
  }

  static async gerarRelatorioUsuarios() {
    return this.gerarRelatorio('usuarios', {});
  }

  static async gerarRelatorioAtividades(params: RelatorioParams) {
    return this.gerarRelatorio('atividades', params);
  }

  static async gerarRelatorioAuditoria(params: RelatorioParams) {
    return this.gerarRelatorio('auditoria', params);
  }

  static async gerarRelatorioDesempenhoSistema() {
    return this.gerarRelatorio('desempenho-sistema', {});
  }

  static async gerarRelatorioSeguranca(params: RelatorioParams) {
    return this.gerarRelatorio('seguranca', params);
  }

  // Método para simular download de relatório
  static async downloadRelatorio(tipo: string, formato: 'PDF' | 'Excel', params: RelatorioParams) {
    try {
      // Simular geração e download do relatório
      console.log(`Gerando relatório ${tipo} em formato ${formato}`, params);
      
      // Aqui você implementaria a lógica real de download
      // Por enquanto, vamos simular um delay e retornar sucesso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: `Relatório ${tipo} em ${formato} gerado com sucesso!`,
        downloadUrl: `#`, // URL fictícia
      };
    } catch (error) {
      console.error(`Erro ao baixar relatório ${tipo}:`, error);
      throw error;
    }
  }
} 