import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuncionarioEtiquetaDto, UpdateFuncionarioEtiquetaDto } from './dto';
import { LogsService, CreateLogDto } from '../logs/logs.service';

@Injectable()
export class FuncionarioEtiquetasService {
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService,
  ) {}

  async create(createFuncionarioEtiquetaDto: CreateFuncionarioEtiquetaDto, usuarioId?: string, ip?: string, userAgent?: string) {
    const result = await this.prisma.funcionarioEtiqueta.create({
      data: {
        funcionarioId: createFuncionarioEtiquetaDto.funcionarioId,
        tipoEtiquetaId: createFuncionarioEtiquetaDto.tipoEtiquetaId,
        dataInicio: new Date(createFuncionarioEtiquetaDto.dataInicio),
        dataFim: createFuncionarioEtiquetaDto.dataFim ? new Date(createFuncionarioEtiquetaDto.dataFim) : null,
        arquivoPdf: createFuncionarioEtiquetaDto.arquivoPdf,
        observacoes: createFuncionarioEtiquetaDto.observacoes,
      },
      include: {
        tipoEtiqueta: true,
        funcionario: {
          select: {
            id: true,
            nome: true,
            cpf: true,
          },
        },
      },
    });

    // Registrar log de criação se usuarioId foi fornecido
    if (usuarioId) {
      const logData: CreateLogDto = {
        acao: 'CREATE',
        entidade: 'FuncionarioEtiqueta',
        entidadeId: result.id,
        sistema: 'GP',
        dadosNovos: result,
        usuarioId,
        ip,
        userAgent,
      };

      await this.logsService.create(logData);
    }

    return result;
  }

  async findAll() {
    return this.prisma.funcionarioEtiqueta.findMany({
      where: { ativo: true },
      include: {
        tipoEtiqueta: true,
        funcionario: {
          select: {
            id: true,
            nome: true,
            cpf: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFuncionario(funcionarioId: string) {
    return this.prisma.funcionarioEtiqueta.findMany({
      where: { 
        funcionarioId,
        ativo: true 
      },
      include: {
        tipoEtiqueta: true,
        funcionario: {
          select: {
            id: true,
            nome: true,
            cpf: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const etiqueta = await this.prisma.funcionarioEtiqueta.findFirst({
      where: { id, ativo: true },
      include: {
        tipoEtiqueta: true,
        funcionario: {
          select: {
            id: true,
            nome: true,
            cpf: true,
          },
        },
      },
    });

    if (!etiqueta) {
      throw new NotFoundException(`Etiqueta com ID ${id} não encontrada`);
    }

    return etiqueta;
  }

  async update(id: string, updateFuncionarioEtiquetaDto: UpdateFuncionarioEtiquetaDto, usuarioId?: string, ip?: string, userAgent?: string) {
    const etiquetaAnterior = await this.findOne(id);

    const result = await this.prisma.funcionarioEtiqueta.update({
      where: { id },
      data: {
        tipoEtiquetaId: updateFuncionarioEtiquetaDto.tipoEtiquetaId,
        dataInicio: updateFuncionarioEtiquetaDto.dataInicio ? new Date(updateFuncionarioEtiquetaDto.dataInicio) : undefined,
        dataFim: updateFuncionarioEtiquetaDto.dataFim ? new Date(updateFuncionarioEtiquetaDto.dataFim) : undefined,
        arquivoPdf: updateFuncionarioEtiquetaDto.arquivoPdf,
        observacoes: updateFuncionarioEtiquetaDto.observacoes,
      },
      include: {
        tipoEtiqueta: true,
        funcionario: {
          select: {
            id: true,
            nome: true,
            cpf: true,
          },
        },
      },
    });

    // Registrar log de atualização se usuarioId foi fornecido
    if (usuarioId) {
      const logData: CreateLogDto = {
        acao: 'UPDATE',
        entidade: 'FuncionarioEtiqueta',
        entidadeId: result.id,
        sistema: 'GP',
        dadosAnteriores: etiquetaAnterior,
        dadosNovos: result,
        usuarioId,
        ip,
        userAgent,
      };

      await this.logsService.create(logData);
    }

    return result;
  }

  async remove(id: string, usuarioId?: string, ip?: string, userAgent?: string) {
    const etiqueta = await this.findOne(id);

    const result = await this.prisma.funcionarioEtiqueta.update({
      where: { id },
      data: { ativo: false },
      include: {
        tipoEtiqueta: true,
        funcionario: {
          select: {
            id: true,
            nome: true,
            cpf: true,
          },
        },
      },
    });

    // Registrar log de remoção se usuarioId foi fornecido
    if (usuarioId) {
      const logData: CreateLogDto = {
        acao: 'DELETE',
        entidade: 'FuncionarioEtiqueta',
        entidadeId: result.id,
        sistema: 'GP',
        dadosAnteriores: etiqueta,
        dadosNovos: result,
        usuarioId,
        ip,
        userAgent,
      };

      await this.logsService.create(logData);
    }

    return result;
  }
} 