import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipoEtiquetaDto, UpdateTipoEtiquetaDto } from './dto';
import { LogsService, CreateLogDto } from '../logs/logs.service';

@Injectable()
export class TiposEtiquetasService {
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService,
  ) {}

  async create(createTipoEtiquetaDto: CreateTipoEtiquetaDto, usuarioId: string, ip?: string, userAgent?: string) {
    const tipoEtiqueta = await this.prisma.tipoEtiqueta.create({
      data: createTipoEtiquetaDto,
    });

    // Registrar log de criação
    const logData: CreateLogDto = {
      acao: 'CREATE',
      entidade: 'TipoEtiqueta',
      entidadeId: tipoEtiqueta.id,
      sistema: 'GP',
      dadosNovos: tipoEtiqueta,
      usuarioId,
      ip,
      userAgent,
    };

    await this.logsService.create(logData);

    return tipoEtiqueta;
  }

  async findAll() {
    return this.prisma.tipoEtiqueta.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    const tipoEtiqueta = await this.prisma.tipoEtiqueta.findUnique({
      where: { id },
    });

    if (!tipoEtiqueta) {
      throw new NotFoundException(`Tipo de etiqueta com ID ${id} não encontrado`);
    }

    return tipoEtiqueta;
  }

  async update(id: string, updateTipoEtiquetaDto: UpdateTipoEtiquetaDto, usuarioId: string, ip?: string, userAgent?: string) {
    const tipoEtiquetaAnterior = await this.findOne(id);

    const tipoEtiqueta = await this.prisma.tipoEtiqueta.update({
      where: { id },
      data: updateTipoEtiquetaDto,
    });

    // Registrar log de atualização
    const logData: CreateLogDto = {
      acao: 'UPDATE',
      entidade: 'TipoEtiqueta',
      entidadeId: tipoEtiqueta.id,
      sistema: 'GP',
      dadosAnteriores: tipoEtiquetaAnterior,
      dadosNovos: tipoEtiqueta,
      usuarioId,
      ip,
      userAgent,
    };

    await this.logsService.create(logData);

    return tipoEtiqueta;
  }

  async remove(id: string, usuarioId: string, ip?: string, userAgent?: string) {
    const tipoEtiquetaAnterior = await this.findOne(id);

    const tipoEtiqueta = await this.prisma.tipoEtiqueta.update({
      where: { id },
      data: { ativo: false },
    });

    // Registrar log de exclusão
    const logData: CreateLogDto = {
      acao: 'DELETE',
      entidade: 'TipoEtiqueta',
      entidadeId: tipoEtiqueta.id,
      sistema: 'GP',
      dadosAnteriores: tipoEtiquetaAnterior,
      dadosNovos: tipoEtiqueta,
      usuarioId,
      ip,
      userAgent,
    };

    await this.logsService.create(logData);

    return tipoEtiqueta;
  }

  async getIconesDisponiveis() {
    return [
      { value: 'medical', label: 'Médico', icon: '🏥' },
      { value: 'calendar', label: 'Calendário', icon: '📅' },
      { value: 'document', label: 'Documento', icon: '📄' },
      { value: 'clock', label: 'Relógio', icon: '⏰' },
      { value: 'warning', label: 'Aviso', icon: '⚠️' },
      { value: 'check', label: 'Verificado', icon: '✅' },
      { value: 'cross', label: 'Negado', icon: '❌' },
      { value: 'heart', label: 'Coração', icon: '❤️' },
      { value: 'pill', label: 'Medicamento', icon: '💊' },
      { value: 'ambulance', label: 'Ambulância', icon: '🚑' },
      { value: 'stethoscope', label: 'Estetoscópio', icon: '🩺' },
      { value: 'syringe', label: 'Seringa', icon: '💉' },
      { value: 'bandage', label: 'Bandagem', icon: '🩹' },
      { value: 'thermometer', label: 'Termômetro', icon: '🌡️' },
      { value: 'microscope', label: 'Microscópio', icon: '🔬' },
      { value: 'dna', label: 'DNA', icon: '🧬' },
      { value: 'brain', label: 'Cérebro', icon: '🧠' },
      { value: 'bone', label: 'Osso', icon: '🦴' },
      { value: 'tooth', label: 'Dente', icon: '🦷' },
      { value: 'eye', label: 'Olho', icon: '👁️' },
    ];
  }
} 