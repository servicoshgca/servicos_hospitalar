import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSetorDto, UpdateSetorDto } from './dto';

@Injectable()
export class SetoresService {
  constructor(private prisma: PrismaService) {}

  async create(createSetorDto: CreateSetorDto) {
    const { nome } = createSetorDto;

    // Verificar se já existe setor com este nome
    const existingSetor = await this.prisma.setor.findFirst({
      where: { nome },
    });

    if (existingSetor) {
      throw new ConflictException('Setor já existe com este nome');
    }

    return this.prisma.setor.create({
      data: createSetorDto,
    });
  }

  async findAll() {
    return this.prisma.setor.findMany({
      where: { ativo: true },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const setor = await this.prisma.setor.findUnique({
      where: { id },
    });

    if (!setor) {
      throw new NotFoundException('Setor não encontrado');
    }

    return setor;
  }

  async update(id: string, updateSetorDto: UpdateSetorDto) {
    await this.findOne(id);

    const { nome } = updateSetorDto;

    // Verificar se já existe outro setor com este nome
    if (nome) {
      const existingSetor = await this.prisma.setor.findFirst({
        where: {
          nome,
          NOT: {
            id,
          },
        },
      });

      if (existingSetor) {
        throw new ConflictException('Setor já existe com este nome');
      }
    }

    return this.prisma.setor.update({
      where: { id },
      data: updateSetorDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.setor.update({
      where: { id },
      data: { ativo: false },
    });
  }
} 