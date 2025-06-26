import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoticiaDto, UpdateNoticiaDto } from './dto';

@Injectable()
export class AscomService {
  constructor(private prisma: PrismaService) {}

  async create(createNoticiaDto: CreateNoticiaDto, userId: string) {
    // Verificar se o usuário tem permissão para criar notícias
    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        sistema: { nome: 'ASCOM' },
        ativo: true,
      },
      include: {
        perfil: true,
      },
    });

    if (!userPermission || userPermission.perfil.nivel < 2) {
      throw new ForbiddenException('Sem permissão para criar notícias');
    }

    return this.prisma.noticia.create({
      data: {
        ...createNoticiaDto,
        dataPublicacao: createNoticiaDto.publicada ? new Date() : null,
      },
      include: {
        autor: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    // Verificar se o usuário tem permissão para visualizar notícias
    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        sistema: { nome: 'ASCOM' },
        ativo: true,
      },
    });

    if (!userPermission) {
      throw new ForbiddenException('Sem permissão para acessar o sistema ASCOM');
    }

    return this.prisma.noticia.findMany({
      where: { ativo: true },
      include: {
        autor: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPublic() {
    // Notícias públicas (não requer autenticação)
    return this.prisma.noticia.findMany({
      where: { 
        ativo: true,
        publicada: true,
      },
      include: {
        autor: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
      },
      orderBy: {
        dataPublicacao: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    // Verificar se o usuário tem permissão para visualizar notícias
    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        sistema: { nome: 'ASCOM' },
        ativo: true,
      },
    });

    if (!userPermission) {
      throw new ForbiddenException('Sem permissão para acessar o sistema ASCOM');
    }

    const noticia = await this.prisma.noticia.findUnique({
      where: { id },
      include: {
        autor: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
      },
    });

    if (!noticia) {
      throw new NotFoundException('Notícia não encontrada');
    }

    return noticia;
  }

  async findOnePublic(id: string) {
    // Notícia pública (não requer autenticação)
    const noticia = await this.prisma.noticia.findFirst({
      where: { 
        id,
        ativo: true,
        publicada: true,
      },
      include: {
        autor: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
      },
    });

    if (!noticia) {
      throw new NotFoundException('Notícia não encontrada ou não publicada');
    }

    return noticia;
  }

  async update(id: string, updateNoticiaDto: UpdateNoticiaDto, userId: string) {
    // Verificar se o usuário tem permissão para editar notícias
    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        sistema: { nome: 'ASCOM' },
        ativo: true,
      },
      include: {
        perfil: true,
      },
    });

    if (!userPermission || userPermission.perfil.nivel < 2) {
      throw new ForbiddenException('Sem permissão para editar notícias');
    }

    const noticia = await this.prisma.noticia.findUnique({
      where: { id },
    });

    if (!noticia) {
      throw new NotFoundException('Notícia não encontrada');
    }

    // Se está publicando a notícia, definir data de publicação
    const dataToUpdate = { ...updateNoticiaDto };
    if (updateNoticiaDto.publicada && !noticia.publicada) {
      dataToUpdate.dataPublicacao = new Date();
    }

    return this.prisma.noticia.update({
      where: { id },
      data: dataToUpdate,
      include: {
        autor: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    // Verificar se o usuário tem permissão para excluir notícias
    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        sistema: { nome: 'ASCOM' },
        ativo: true,
      },
      include: {
        perfil: true,
      },
    });

    if (!userPermission || userPermission.perfil.nivel < 2) {
      throw new ForbiddenException('Sem permissão para excluir notícias');
    }

    const noticia = await this.prisma.noticia.findUnique({
      where: { id },
    });

    if (!noticia) {
      throw new NotFoundException('Notícia não encontrada');
    }

    return this.prisma.noticia.update({
      where: { id },
      data: { ativo: false },
    });
  }

  async publish(id: string, userId: string) {
    // Verificar se o usuário tem permissão para publicar notícias
    const userPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        sistema: { nome: 'ASCOM' },
        ativo: true,
      },
      include: {
        perfil: true,
      },
    });

    if (!userPermission || userPermission.perfil.nivel < 2) {
      throw new ForbiddenException('Sem permissão para publicar notícias');
    }

    const noticia = await this.prisma.noticia.findUnique({
      where: { id },
    });

    if (!noticia) {
      throw new NotFoundException('Notícia não encontrada');
    }

    if (noticia.publicada) {
      throw new ForbiddenException('Notícia já está publicada');
    }

    return this.prisma.noticia.update({
      where: { id },
      data: {
        publicada: true,
        dataPublicacao: new Date(),
      },
      include: {
        autor: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
              },
            },
          },
        },
      },
    });
  }
} 