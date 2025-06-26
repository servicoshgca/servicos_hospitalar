import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVinculoDto, UpdateVinculoDto } from './dto';

@Injectable()
export class VinculosService {
  constructor(private prisma: PrismaService) {}

  async create(createVinculoDto: CreateVinculoDto) {
    const { nome } = createVinculoDto;

    // Verificar se já existe vínculo com este nome
    const existingVinculo = await this.prisma.vinculo.findFirst({
      where: { nome },
    });

    if (existingVinculo) {
      throw new ConflictException('Vínculo já existe com este nome');
    }

    return this.prisma.vinculo.create({
      data: createVinculoDto,
    });
  }

  async findAll() {
    return this.prisma.vinculo.findMany({
      where: { ativo: true },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const vinculo = await this.prisma.vinculo.findUnique({
      where: { id },
    });

    if (!vinculo) {
      throw new NotFoundException('Vínculo não encontrado');
    }

    return vinculo;
  }

  async update(id: string, updateVinculoDto: UpdateVinculoDto) {
    await this.findOne(id);

    const { nome } = updateVinculoDto;

    // Verificar se já existe outro vínculo com este nome
    if (nome) {
      const existingVinculo = await this.prisma.vinculo.findFirst({
        where: {
          nome,
          NOT: {
            id,
          },
        },
      });

      if (existingVinculo) {
        throw new ConflictException('Vínculo já existe com este nome');
      }
    }

    return this.prisma.vinculo.update({
      where: { id },
      data: updateVinculoDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.vinculo.update({
      where: { id },
      data: { ativo: false },
    });
  }
} 