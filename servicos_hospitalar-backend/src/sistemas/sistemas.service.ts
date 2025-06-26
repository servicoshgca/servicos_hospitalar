import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSistemaDto, UpdateSistemaDto } from './dto';

@Injectable()
export class SistemasService {
  constructor(private prisma: PrismaService) {}

  async create(createSistemaDto: CreateSistemaDto) {
    return this.prisma.sistema.create({
      data: createSistemaDto,
    });
  }

  async findAll() {
    return this.prisma.sistema.findMany({
      where: { ativo: true },
    });
  }

  async findOne(id: string) {
    const sistema = await this.prisma.sistema.findUnique({
      where: { id },
    });

    if (!sistema) {
      throw new NotFoundException('Sistema não encontrado');
    }

    return sistema;
  }

  async update(id: string, updateSistemaDto: UpdateSistemaDto) {
    await this.findOne(id);

    return this.prisma.sistema.update({
      where: { id },
      data: updateSistemaDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.sistema.update({
      where: { id },
      data: { ativo: false },
    });
  }
} 