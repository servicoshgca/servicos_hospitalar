import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConfiguracaoRefeitorioDto, UpdateConfiguracaoRefeitorioDto, CreatePedidoRefeicaoDto, UpdatePedidoRefeicaoDto, CreatePedidoEntregueDto, UpdatePedidoEntregueDto, CreatePedidoNaoEntregueDto, UpdatePedidoNaoEntregueDto } from './dto';

interface CreateCardapioDto {
  data: Date;
  imagem: string;
}

@Injectable()
export class RefeitorioService {
  constructor(private prisma: PrismaService) {}

  async getConfiguracoes() {
    return this.prisma.configuracaoRefeitorio.findMany({
      where: { ativo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getConfiguracaoById(id: string) {
    return this.prisma.configuracaoRefeitorio.findUnique({
      where: { id },
    });
  }

  async createConfiguracao(dto: CreateConfiguracaoRefeitorioDto) {
    return this.prisma.configuracaoRefeitorio.create({
      data: dto,
    });
  }

  async createOrUpdateConfiguracao(dto: CreateConfiguracaoRefeitorioDto) {
    // Verifica se já existe uma configuração ativa
    const existingConfig = await this.prisma.configuracaoRefeitorio.findFirst({
      where: { ativo: true },
    });

    if (existingConfig) {
      // Se existe, atualiza
      return this.prisma.configuracaoRefeitorio.update({
        where: { id: existingConfig.id },
        data: dto,
      });
    } else {
      // Se não existe, cria
      return this.prisma.configuracaoRefeitorio.create({
        data: dto,
      });
    }
  }

  async updateConfiguracao(id: string, dto: UpdateConfiguracaoRefeitorioDto) {
    return this.prisma.configuracaoRefeitorio.update({
      where: { id },
      data: dto,
    });
  }

  async deleteConfiguracao(id: string) {
    return this.prisma.configuracaoRefeitorio.delete({
      where: { id },
    });
  }

  // Métodos para gerenciar cardápios
  async getCardapios() {
    return this.prisma.cardapio.findMany({
      where: { ativo: true },
      orderBy: { data: 'desc' },
    });
  }

  async getCardapioByDate(data: Date) {
    // Criar data local corretamente usando UTC
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDate();
    
    // Criar datas em UTC para evitar conversão de timezone
    const startOfDay = new Date(Date.UTC(ano, mes, dia, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(ano, mes, dia, 23, 59, 59, 999));

    return this.prisma.cardapio.findFirst({
      where: {
        data: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ativo: true,
      },
    });
  }

  async createOrUpdateCardapio(dto: CreateCardapioDto) {
    // Verifica se já existe um cardápio para esta data
    const existingCardapio = await this.getCardapioByDate(dto.data);

    if (existingCardapio) {
      // Se existe, atualiza
      return this.prisma.cardapio.update({
        where: { id: existingCardapio.id },
        data: {
          imagem: dto.imagem,
          updatedAt: new Date(),
        },
      });
    } else {
      // Se não existe, cria
      return this.prisma.cardapio.create({
        data: dto,
      });
    }
  }

  async deleteCardapio(id: string) {
    return this.prisma.cardapio.delete({
      where: { id },
    });
  }

  // Métodos para gerenciar pedidos de refeição
  async getPedidosRefeicao() {
    return this.prisma.pedidoRefeicao.findMany({
      where: { ativo: true },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        cardapio: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPedidosRefeicaoByFuncionario(funcionarioId: string) {
    return this.prisma.pedidoRefeicao.findMany({
      where: { 
        funcionarioId,
        ativo: true 
      },
      include: {
        cardapio: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPedidosRefeicaoByDateRange(startOfDay: Date, endOfDay: Date) {
    return this.prisma.pedidoRefeicao.findMany({
      where: {
        dataRefeicao: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ativo: true,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        cardapio: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPedidosRefeicaoByDate(data: Date) {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDate();
    const startOfDay = new Date(Date.UTC(ano, mes, dia, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(ano, mes, dia, 23, 59, 59, 999));
    return this.getPedidosRefeicaoByDateRange(startOfDay, endOfDay);
  }

  async createPedidoRefeicao(funcionarioId: string, dto: CreatePedidoRefeicaoDto) {
    // Verificar se já existe um pedido para este funcionário nesta data e tipo de refeição
    // Criar data local corretamente usando UTC
    const dataLocal = new Date(dto.dataRefeicao);
    const ano = dataLocal.getFullYear();
    const mes = dataLocal.getMonth();
    const dia = dataLocal.getDate();
    
    // Criar datas em UTC para evitar conversão de timezone
    const startOfDay = new Date(Date.UTC(ano, mes, dia, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(ano, mes, dia, 23, 59, 59, 999));

    const existingPedido = await this.prisma.pedidoRefeicao.findFirst({
      where: {
        funcionarioId,
        tipoRefeicao: dto.tipoRefeicao,
        dataRefeicao: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ativo: true,
      },
    });

    if (existingPedido) {
      throw new Error('Já existe um pedido para este funcionário nesta data e tipo de refeição');
    }

    // Buscar ou criar cardápio para a data
    let cardapio = await this.getCardapioByDate(new Date(dto.dataRefeicao));
    
    if (!cardapio) {
      // Criar um cardápio vazio para a data
      cardapio = await this.prisma.cardapio.create({
        data: {
          data: new Date(dto.dataRefeicao),
          imagem: '', // Cardápio vazio
        },
      });
    }

    return this.prisma.pedidoRefeicao.create({
      data: {
        funcionarioId,
        cardapioId: cardapio.id,
        tipoRefeicao: dto.tipoRefeicao,
        dataRefeicao: new Date(dto.dataRefeicao),
        observacoes: dto.observacoes,
        opcoes: dto.opcoes ? JSON.stringify(dto.opcoes) : null,
        status: 'PENDENTE',
        setorPedidoId: dto.setorPedidoId || null,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        cardapio: true,
        setorPedido: true,
      },
    });
  }

  async updatePedidoRefeicao(id: string, dto: UpdatePedidoRefeicaoDto) {
    return this.prisma.pedidoRefeicao.update({
      where: { id },
      data: {
        ...dto,
        dataRefeicao: dto.dataRefeicao ? new Date(dto.dataRefeicao) : undefined,
        opcoes: dto.opcoes ? JSON.stringify(dto.opcoes) : undefined,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        cardapio: true,
      },
    });
  }

  async deletePedidoRefeicao(id: string) {
    return this.prisma.pedidoRefeicao.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async getFuncionarioIdByUserId(userId: string): Promise<string | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { funcionario: true }
    });
    return user?.funcionario?.id;
  }

  // Métodos para gerenciar pedidos entregues
  async getPedidosEntregues() {
    return this.prisma.pedidoEntregue.findMany({
      where: { ativo: true },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
      orderBy: { dataEntrega: 'desc' },
    });
  }

  async getPedidosEntreguesByDate(data: Date) {
    // Criar data local corretamente usando UTC
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDate();
    
    // Criar datas em UTC para evitar conversão de timezone
    const startOfDay = new Date(Date.UTC(ano, mes, dia, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(ano, mes, dia, 23, 59, 59, 999));

    return this.prisma.pedidoEntregue.findMany({
      where: {
        dataRefeicao: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ativo: true,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
      orderBy: { dataEntrega: 'desc' },
    });
  }

  async getPedidosEntreguesByTipoRefeicao(tipoRefeicao: string, data: Date) {
    // Criar data local corretamente usando UTC
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDate();
    
    // Criar datas em UTC para evitar conversão de timezone
    const startOfDay = new Date(Date.UTC(ano, mes, dia, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(ano, mes, dia, 23, 59, 59, 999));

    return this.prisma.pedidoEntregue.findMany({
      where: {
        tipoRefeicao,
        dataRefeicao: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ativo: true,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
      orderBy: { dataEntrega: 'desc' },
    });
  }

  async createPedidoEntregue(dto: CreatePedidoEntregueDto) {
    return this.prisma.pedidoEntregue.create({
      data: {
        funcionarioId: dto.funcionarioId,
        pedidoRefeicaoId: dto.pedidoRefeicaoId,
        tipoRefeicao: dto.tipoRefeicao,
        dataRefeicao: new Date(dto.dataRefeicao),
        observacoes: dto.observacoes,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
    });
  }

  async updatePedidoEntregue(id: string, dto: UpdatePedidoEntregueDto) {
    return this.prisma.pedidoEntregue.update({
      where: { id },
      data: {
        ...dto,
        dataRefeicao: dto.dataRefeicao ? new Date(dto.dataRefeicao) : undefined,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
    });
  }

  async deletePedidoEntregue(id: string) {
    return this.prisma.pedidoEntregue.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async getFuncionarioByCpf(cpf: string) {
    return this.prisma.funcionario.findFirst({
      where: { 
        cpf,
        ativo: true 
      },
      include: {
        informacoesFuncionais: {
          include: {
            setor: true,
          },
        },
      },
    });
  }

  // Métodos para gerenciar pedidos não entregues
  async getPedidosNaoEntregues() {
    return this.prisma.pedidoNaoEntregue.findMany({
      where: { ativo: true },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
      orderBy: { dataNaoEntrega: 'desc' },
    });
  }

  async getPedidosNaoEntreguesByDate(data: Date) {
    // Criar data local corretamente usando UTC
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDate();
    
    // Criar datas em UTC para evitar conversão de timezone
    const startOfDay = new Date(Date.UTC(ano, mes, dia, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(ano, mes, dia, 23, 59, 59, 999));

    return this.prisma.pedidoNaoEntregue.findMany({
      where: {
        dataRefeicao: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ativo: true,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
      orderBy: { dataNaoEntrega: 'desc' },
    });
  }

  async getPedidosNaoEntreguesByTipoRefeicao(tipoRefeicao: string, data: Date) {
    // Criar data local corretamente usando UTC
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const dia = data.getDate();
    
    // Criar datas em UTC para evitar conversão de timezone
    const startOfDay = new Date(Date.UTC(ano, mes, dia, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(ano, mes, dia, 23, 59, 59, 999));

    return this.prisma.pedidoNaoEntregue.findMany({
      where: {
        tipoRefeicao,
        dataRefeicao: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ativo: true,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
      orderBy: { dataNaoEntrega: 'desc' },
    });
  }

  async createPedidoNaoEntregue(dto: CreatePedidoNaoEntregueDto) {
    return this.prisma.pedidoNaoEntregue.create({
      data: {
        funcionarioId: dto.funcionarioId,
        pedidoRefeicaoId: dto.pedidoRefeicaoId,
        tipoRefeicao: dto.tipoRefeicao,
        dataRefeicao: new Date(dto.dataRefeicao),
        observacoes: dto.observacoes,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
    });
  }

  async updatePedidoNaoEntregue(id: string, dto: UpdatePedidoNaoEntregueDto) {
    return this.prisma.pedidoNaoEntregue.update({
      where: { id },
      data: {
        ...dto,
        dataRefeicao: dto.dataRefeicao ? new Date(dto.dataRefeicao) : undefined,
      },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
        pedidoRefeicao: true,
      },
    });
  }

  async deletePedidoNaoEntregue(id: string) {
    return this.prisma.pedidoNaoEntregue.update({
      where: { id },
      data: { ativo: false },
    });
  }

  // Métodos para gerenciar setores
  async getSetores() {
    return this.prisma.setor.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }
} 