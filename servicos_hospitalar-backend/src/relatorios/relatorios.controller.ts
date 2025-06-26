import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('relatorios')
@UseGuards(JwtAuthGuard)
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('turnover')
  async gerarRelatorioTurnover(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.gerarRelatorioTurnover(dataInicio, dataFim);
  }

  @Get('absenteismo')
  async gerarRelatorioAbsenteismo(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.gerarRelatorioAbsenteismo(dataInicio, dataFim);
  }

  @Get('desempenho')
  async gerarRelatorioDesempenho(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.gerarRelatorioDesempenho(dataInicio, dataFim);
  }

  @Get('treinamentos')
  async gerarRelatorioTreinamentos(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.gerarRelatorioTreinamentos(dataInicio, dataFim);
  }

  @Get('custos-rh')
  async gerarRelatorioCustosRH(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.gerarRelatorioCustosRH(dataInicio, dataFim);
  }

  @Get('diversidade')
  async gerarRelatorioDiversidade() {
    return this.relatoriosService.gerarRelatorioDiversidade();
  }

  @Get('acessos')
  async gerarRelatorioAcessos(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.gerarRelatorioAcessos(dataInicio, dataFim);
  }

  @Get('usuarios')
  async gerarRelatorioUsuarios() {
    return this.relatoriosService.gerarRelatorioUsuarios();
  }

  @Get('atividades')
  async gerarRelatorioAtividades(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.gerarRelatorioAtividades(dataInicio, dataFim);
  }

  @Get('auditoria')
  async gerarRelatorioAuditoria(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.gerarRelatorioAuditoria(dataInicio, dataFim);
  }

  @Get('desempenho-sistema')
  async gerarRelatorioDesempenhoSistema() {
    return this.relatoriosService.gerarRelatorioDesempenhoSistema();
  }

  @Get('seguranca')
  async gerarRelatorioSeguranca(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    return this.relatoriosService.gerarRelatorioSeguranca(dataInicio, dataFim);
  }

  @Get('tipos')
  async listarTiposRelatorios() {
    return [
      {
        id: 'turnover',
        titulo: 'Relatório de Turnover',
        descricao: 'Análise da taxa de rotatividade de funcionários',
        categoria: 'rh',
        periodo: 'Personalizado',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'absenteismo',
        titulo: 'Relatório de Absenteísmo',
        descricao: 'Análise de faltas e ausências dos funcionários',
        categoria: 'rh',
        periodo: 'Personalizado',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'desempenho',
        titulo: 'Relatório de Desempenho',
        descricao: 'Avaliação de desempenho dos funcionários',
        categoria: 'rh',
        periodo: 'Personalizado',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'treinamentos',
        titulo: 'Relatório de Treinamentos',
        descricao: 'Registro de treinamentos realizados',
        categoria: 'rh',
        periodo: 'Personalizado',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'custos-rh',
        titulo: 'Relatório de Custos RH',
        descricao: 'Análise de custos do departamento de RH',
        categoria: 'rh',
        periodo: 'Personalizado',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'diversidade',
        titulo: 'Relatório de Diversidade',
        descricao: 'Análise da diversidade na empresa',
        categoria: 'rh',
        periodo: 'Atual',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'acessos',
        titulo: 'Relatório de Acessos',
        descricao: 'Análise de acessos ao sistema por usuário',
        categoria: 'sistema',
        periodo: 'Últimos 30 dias',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'usuarios',
        titulo: 'Relatório de Usuários',
        descricao: 'Lista completa de usuários ativos e inativos',
        categoria: 'sistema',
        periodo: 'Atual',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'atividades',
        titulo: 'Relatório de Atividades',
        descricao: 'Registro de atividades realizadas no sistema',
        categoria: 'sistema',
        periodo: 'Personalizado',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'auditoria',
        titulo: 'Relatório de Auditoria',
        descricao: 'Registro detalhado de todas as alterações',
        categoria: 'sistema',
        periodo: 'Personalizado',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'desempenho-sistema',
        titulo: 'Relatório de Desempenho do Sistema',
        descricao: 'Métricas de desempenho do sistema',
        categoria: 'sistema',
        periodo: 'Últimos 7 dias',
        formatos: ['PDF', 'Excel'],
      },
      {
        id: 'seguranca',
        titulo: 'Relatório de Segurança',
        descricao: 'Registro de tentativas de acesso e alterações',
        categoria: 'sistema',
        periodo: 'Personalizado',
        formatos: ['PDF', 'Excel'],
      },
    ];
  }
} 