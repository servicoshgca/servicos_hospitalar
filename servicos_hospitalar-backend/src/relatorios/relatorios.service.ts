import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async gerarRelatorioTurnover(dataInicio: string, dataFim: string) {
    // Relatório de turnover - admissões e desligamentos
    const admissoes = await this.prisma.funcionario.count({
      where: {
        dataAdmissao: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      },
    });

    const desligamentos = await this.prisma.funcionario.count({
      where: {
        dataDesligamento: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
      },
    });

    const totalFuncionarios = await this.prisma.funcionario.count({
      where: {
        dataDesligamento: null, // Apenas funcionários ativos
      },
    });

    const taxaTurnover = totalFuncionarios > 0 ? ((admissoes + desligamentos) / 2) / totalFuncionarios * 100 : 0;

    return {
      periodo: { dataInicio, dataFim },
      admissoes,
      desligamentos,
      totalFuncionarios,
      taxaTurnover: taxaTurnover.toFixed(2),
      detalhes: {
        admissoes: await this.prisma.funcionario.findMany({
          where: {
            dataAdmissao: {
              gte: new Date(dataInicio),
              lte: new Date(dataFim),
            },
          },
          select: {
            id: true,
            nome: true,
            dataAdmissao: true,
            informacoesFuncionais: {
              select: {
                setor: { select: { nome: true } }
              }
            }
          },
        }),
        desligamentos: await this.prisma.funcionario.findMany({
          where: {
            dataDesligamento: {
              gte: new Date(dataInicio),
              lte: new Date(dataFim),
            },
          },
          select: {
            id: true,
            nome: true,
            dataDesligamento: true,
            informacoesFuncionais: {
              select: {
                setor: { select: { nome: true } }
              }
            }
          },
        }),
      },
    };
  }

  async gerarRelatorioAbsenteismo(dataInicio: string, dataFim: string) {
    // Relatório de absenteísmo - faltas e ausências
    // Nota: Este é um exemplo, você precisaria de uma tabela de faltas/ausências
    return {
      periodo: { dataInicio, dataFim },
      totalFaltas: 0,
      totalFuncionarios: await this.prisma.funcionario.count({
        where: { dataDesligamento: null },
      }),
      taxaAbsenteismo: 0,
      detalhes: [],
      observacao: 'Funcionalidade requer implementação de tabela de faltas/ausências',
    };
  }

  async gerarRelatorioDesempenho(dataInicio: string, dataFim: string) {
    // Relatório de desempenho
    // Nota: Este é um exemplo, você precisaria de uma tabela de avaliações
    return {
      periodo: { dataInicio, dataFim },
      totalAvaliacoes: 0,
      mediaGeral: 0,
      detalhes: [],
      observacao: 'Funcionalidade requer implementação de tabela de avaliações',
    };
  }

  async gerarRelatorioTreinamentos(dataInicio: string, dataFim: string) {
    // Relatório de treinamentos
    // Nota: Este é um exemplo, você precisaria de uma tabela de treinamentos
    return {
      periodo: { dataInicio, dataFim },
      totalTreinamentos: 0,
      totalParticipantes: 0,
      detalhes: [],
      observacao: 'Funcionalidade requer implementação de tabela de treinamentos',
    };
  }

  async gerarRelatorioCustosRH(dataInicio: string, dataFim: string) {
    // Relatório de custos RH
    const totalFuncionarios = await this.prisma.funcionario.count({
      where: { dataDesligamento: null },
    });

    return {
      periodo: { dataInicio, dataFim },
      totalFuncionarios,
      custoEstimado: totalFuncionarios * 5000, // Valor estimado por funcionário
      detalhes: {
        folhaPagamento: totalFuncionarios * 4000,
        beneficios: totalFuncionarios * 800,
        treinamentos: totalFuncionarios * 200,
      },
      observacao: 'Valores estimados para demonstração',
    };
  }

  async gerarRelatorioDiversidade() {
    // Relatório de diversidade
    const funcionarios = await this.prisma.funcionario.findMany({
      where: { dataDesligamento: null },
      select: {
        genero: true,
        dataNascimento: true,
        escolaridade: true,
        informacoesFuncionais: {
          select: {
            setor: { select: { nome: true } }
          }
        },
      },
    });

    const total = funcionarios.length;
    const generos = funcionarios.reduce((acc, func) => {
      acc[func.genero || 'Não informado'] = (acc[func.genero || 'Não informado'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const idades = funcionarios.map(func => {
      if (!func.dataNascimento) return null;
      const hoje = new Date();
      const nascimento = new Date(func.dataNascimento);
      return hoje.getFullYear() - nascimento.getFullYear();
    }).filter(idade => idade !== null);

    const mediaIdade = idades.length > 0 ? idades.reduce((a, b) => a + b, 0) / idades.length : 0;

    return {
      totalFuncionarios: total,
      distribuicaoGenero: generos,
      mediaIdade: mediaIdade.toFixed(1),
      distribuicaoSetores: await this.prisma.setor.findMany({
        select: {
          nome: true,
          _count: { select: { informacoesFuncionais: true } },
        },
      }),
    };
  }

  async gerarRelatorioAcessos(dataInicio: string, dataFim: string) {
    // Relatório de acessos ao sistema
    const logs = await this.prisma.log.findMany({
      where: {
        createdAt: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
        acao: 'LOGIN',
      },
      include: {
        usuario: {
          include: {
            funcionario: true,
          },
        },
      },
    });

    const acessosPorUsuario = logs.reduce((acc, log) => {
      const nome = log.usuario?.funcionario?.nome || 'Usuário não identificado';
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      periodo: { dataInicio, dataFim },
      totalAcessos: logs.length,
      usuariosUnicos: Object.keys(acessosPorUsuario).length,
      acessosPorUsuario,
      detalhes: logs.slice(0, 50), // Últimos 50 acessos
    };
  }

  async gerarRelatorioUsuarios() {
    // Relatório de usuários do sistema
    const usuarios = await this.prisma.user.findMany({
      include: {
        funcionario: true,
        permissoes: true,
      },
    });

    return {
      totalUsuarios: usuarios.length,
      usuariosAtivos: usuarios.filter(u => u.ativo).length,
      usuariosInativos: usuarios.filter(u => !u.ativo).length,
      detalhes: usuarios.map(user => ({
        id: user.id,
        nome: user.funcionario?.nome || 'N/A',
        email: user.email,
        ativo: user.ativo,
        permissoes: user.permissoes.length,
        ultimoAcesso: user.ultimoAcesso,
      })),
    };
  }

  async gerarRelatorioAtividades(dataInicio: string, dataFim: string) {
    // Relatório de atividades no sistema
    const logs = await this.prisma.log.findMany({
      where: {
        createdAt: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
        acao: { not: 'LOGIN' },
      },
      include: {
        usuario: {
          include: {
            funcionario: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const atividadesPorTipo = logs.reduce((acc, log) => {
      acc[log.acao] = (acc[log.acao] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      periodo: { dataInicio, dataFim },
      totalAtividades: logs.length,
      atividadesPorTipo,
      detalhes: logs.slice(0, 100), // Últimas 100 atividades
    };
  }

  async gerarRelatorioAuditoria(dataInicio: string, dataFim: string) {
    // Relatório de auditoria - todas as alterações
    const logs = await this.prisma.log.findMany({
      where: {
        createdAt: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
        acao: { in: ['CREATE', 'UPDATE', 'DELETE'] },
      },
      include: {
        usuario: {
          include: {
            funcionario: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      periodo: { dataInicio, dataFim },
      totalAlteracoes: logs.length,
      alteracoesPorTipo: logs.reduce((acc, log) => {
        acc[log.acao] = (acc[log.acao] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      detalhes: logs,
    };
  }

  async gerarRelatorioDesempenhoSistema() {
    // Relatório de desempenho do sistema
    const ultimos7Dias = new Date();
    ultimos7Dias.setDate(ultimos7Dias.getDate() - 7);

    const logs = await this.prisma.log.findMany({
      where: {
        createdAt: {
          gte: ultimos7Dias,
        },
      },
    });

    const acessosPorDia = logs.reduce((acc, log) => {
      const data = log.createdAt.toISOString().split('T')[0];
      acc[data] = (acc[data] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      periodo: 'Últimos 7 dias',
      totalAcessos: logs.length,
      mediaAcessosPorDia: (logs.length / 7).toFixed(1),
      acessosPorDia,
      disponibilidade: '99.9%', // Simulado
      tempoRespostaMedio: '150ms', // Simulado
    };
  }

  async gerarRelatorioSeguranca(dataInicio: string, dataFim: string) {
    // Relatório de segurança
    const logs = await this.prisma.log.findMany({
      where: {
        createdAt: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim),
        },
        acao: { in: ['LOGIN_FAILED', 'PASSWORD_CHANGE', 'PERMISSION_DENIED'] },
      },
      include: {
        usuario: {
          include: {
            funcionario: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      periodo: { dataInicio, dataFim },
      totalIncidentes: logs.length,
      incidentesPorTipo: logs.reduce((acc, log) => {
        acc[log.acao] = (acc[log.acao] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      detalhes: logs,
    };
  }
} 