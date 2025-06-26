import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignPermissionDto, UpdatePermissionDto } from './dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async assignPermission(assignPermissionDto: AssignPermissionDto, adminUserId: string) {
    // Verificar se o usuário que está atribuindo é admin
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminUserId },
      include: {
        permissoes: {
          include: {
            perfil: true,
          },
        },
      },
    });

    if (!adminUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se tem perfil de admin (nível 3)
    const isAdmin = adminUser.permissoes.some(permissao => permissao.perfil.nivel >= 3);
    if (!isAdmin) {
      throw new ForbiddenException('Apenas administradores podem gerenciar permissões');
    }

    // Verificar se a permissão já existe
    const existingPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId: assignPermissionDto.userId,
        sistemaId: assignPermissionDto.sistemaId,
      },
    });

    if (existingPermission) {
      throw new ConflictException('Usuário já possui permissão para este sistema');
    }

    // Criar a permissão
    return this.prisma.userPermission.create({
      data: {
        userId: assignPermissionDto.userId,
        sistemaId: assignPermissionDto.sistemaId,
        perfilId: assignPermissionDto.perfilId,
        ativo: assignPermissionDto.ativo ?? true,
      },
      include: {
        user: {
          include: {
            funcionario: true,
          },
        },
        sistema: true,
        perfil: true,
      },
    });
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto, adminUserId: string) {
    // Verificar se o usuário que está atualizando é admin
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminUserId },
      include: {
        permissoes: {
          include: {
            perfil: true,
          },
        },
      },
    });

    if (!adminUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se tem perfil de admin (nível 3)
    const isAdmin = adminUser.permissoes.some(permissao => permissao.perfil.nivel >= 3);
    if (!isAdmin) {
      throw new ForbiddenException('Apenas administradores podem gerenciar permissões');
    }

    // Verificar se a permissão existe
    const permission = await this.prisma.userPermission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permissão não encontrada');
    }

    // Atualizar a permissão
    return this.prisma.userPermission.update({
      where: { id },
      data: updatePermissionDto,
      include: {
        user: {
          include: {
            funcionario: true,
          },
        },
        sistema: true,
        perfil: true,
      },
    });
  }

  async removePermission(id: string, adminUserId: string) {
    // Verificar se o usuário que está removendo é admin
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminUserId },
      include: {
        permissoes: {
          include: {
            perfil: true,
          },
        },
      },
    });

    if (!adminUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se tem perfil de admin (nível 3)
    const isAdmin = adminUser.permissoes.some(permissao => permissao.perfil.nivel >= 3);
    if (!isAdmin) {
      throw new ForbiddenException('Apenas administradores podem gerenciar permissões');
    }

    // Verificar se a permissão existe
    const permission = await this.prisma.userPermission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permissão não encontrada');
    }

    // Remover a permissão
    return this.prisma.userPermission.delete({
      where: { id },
    });
  }

  async findAllPermissions(adminUserId: string) {
    // Verificar se o usuário que está consultando é admin
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminUserId },
      include: {
        permissoes: {
          include: {
            perfil: true,
          },
        },
      },
    });

    if (!adminUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se tem perfil de admin (nível 3)
    const isAdmin = adminUser.permissoes.some(permissao => permissao.perfil.nivel >= 3);
    if (!isAdmin) {
      throw new ForbiddenException('Apenas administradores podem consultar permissões');
    }

    // Retornar todas as permissões
    return this.prisma.userPermission.findMany({
      include: {
        user: {
          include: {
            funcionario: true,
          },
        },
        sistema: true,
        perfil: true,
      },
      orderBy: [
        { user: { funcionario: { nome: 'asc' } } },
        { sistema: { nome: 'asc' } },
      ],
    });
  }

  async findUserPermissions(userId: string, adminUserId: string) {
    // Verificar se o usuário que está consultando é admin
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminUserId },
      include: {
        permissoes: {
          include: {
            perfil: true,
          },
        },
      },
    });

    if (!adminUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se tem perfil de admin (nível 3)
    const isAdmin = adminUser.permissoes.some(permissao => permissao.perfil.nivel >= 3);
    if (!isAdmin) {
      throw new ForbiddenException('Apenas administradores podem consultar permissões');
    }

    // Retornar permissões do usuário específico
    return this.prisma.userPermission.findMany({
      where: { userId },
      include: {
        user: {
          include: {
            funcionario: true,
          },
        },
        sistema: true,
        perfil: true,
      },
      orderBy: { sistema: { nome: 'asc' } },
    });
  }

  async getAvailableData(adminUserId: string) {
    // Verificar se o usuário que está consultando é admin
    const adminUser = await this.prisma.user.findUnique({
      where: { id: adminUserId },
      include: {
        permissoes: {
          include: {
            perfil: true,
          },
        },
      },
    });

    if (!adminUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se tem perfil de admin (nível 3)
    const isAdmin = adminUser.permissoes.some(permissao => permissao.perfil.nivel >= 3);
    if (!isAdmin) {
      throw new ForbiddenException('Apenas administradores podem consultar dados');
    }

    // Retornar dados disponíveis para atribuição de permissões
    const [users, sistemas, perfis] = await Promise.all([
      this.prisma.user.findMany({
        where: { ativo: true },
        include: {
          funcionario: true,
        },
        orderBy: { funcionario: { nome: 'asc' } },
      }),
      this.prisma.sistema.findMany({
        where: { ativo: true },
        orderBy: { nome: 'asc' },
      }),
      this.prisma.perfil.findMany({
        where: { ativo: true },
        orderBy: { nome: 'asc' },
      }),
    ]);

    return {
      users,
      sistemas,
      perfis,
    };
  }
} 