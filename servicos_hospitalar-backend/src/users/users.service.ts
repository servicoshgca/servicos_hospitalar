import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, AssignPermissionDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { funcionarioId } = createUserDto;

    // Verificar se já existe usuário com funcionarioId
    const existingUser = await this.prisma.user.findFirst({
      where: {
        funcionarioId,
      },
    });

    if (existingUser) {
      throw new ConflictException('Usuário já existe para este funcionário');
    }

    return this.prisma.user.create({
      data: createUserDto,
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
                vinculo: true,
              },
            },
          },
        },
        permissoes: {
          include: {
            sistema: true,
            perfil: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
                vinculo: true,
              },
            },
          },
        },
        permissoes: {
          include: {
            sistema: true,
            perfil: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
                vinculo: true,
              },
            },
          },
        },
        permissoes: {
          include: {
            sistema: true,
            perfil: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        funcionario: {
          include: {
            informacoesFuncionais: {
              include: {
                setor: true,
                vinculo: true,
              },
            },
          },
        },
        permissoes: {
          include: {
            sistema: true,
            perfil: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async assignPermission(userId: string, assignPermissionDto: AssignPermissionDto) {
    const { sistemaId, perfilId } = assignPermissionDto;

    // Verificar se usuário existe
    await this.findOne(userId);

    // Verificar se sistema existe
    const sistema = await this.prisma.sistema.findUnique({
      where: { id: sistemaId },
    });

    if (!sistema) {
      throw new NotFoundException('Sistema não encontrado');
    }

    // Verificar se perfil existe
    const perfil = await this.prisma.perfil.findUnique({
      where: { id: perfilId },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado');
    }

    // Criar ou atualizar permissão
    return this.prisma.userPermission.upsert({
      where: {
        userId_sistemaId: {
          userId,
          sistemaId,
        },
      },
      update: {
        perfilId,
        ativo: true,
      },
      create: {
        userId,
        sistemaId,
        perfilId,
      },
      include: {
        sistema: true,
        perfil: true,
      },
    });
  }

  async removePermission(userId: string, sistemaId: string) {
    await this.findOne(userId);

    return this.prisma.userPermission.delete({
      where: {
        userId_sistemaId: {
          userId,
          sistemaId,
        },
      },
    });
  }

  async getUserPermissions(userId: string) {
    await this.findOne(userId);

    return this.prisma.userPermission.findMany({
      where: { userId },
      include: {
        sistema: true,
        perfil: true,
      },
    });
  }

  async hasPermission(userId: string, sistemaId: string, nivelMinimo: number = 1) {
    const permission = await this.prisma.userPermission.findUnique({
      where: {
        userId_sistemaId: {
          userId,
          sistemaId,
        },
      },
      include: {
        perfil: true,
      },
    });

    return permission && permission.ativo && permission.perfil.nivel >= nivelMinimo;
  }

  async login(cpf: string, password: string) {
    // Limpa o CPF antes de buscar
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Buscar funcionário pelo CPF
    const funcionario = await this.prisma.funcionario.findUnique({
      where: {
        cpf: cpfLimpo
      },
      include: {
        informacoesFuncionais: {
          include: {
            setor: true,
            vinculo: true,
          },
        },
        usuario: {
          include: {
            permissoes: {
              include: {
                sistema: true,
                perfil: true,
              },
            },
          },
        },
      },
    });

    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado');
    }

    if (!funcionario.usuario) {
      throw new NotFoundException('Funcionário não possui acesso ao sistema');
    }

    const user = funcionario.usuario;

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Senha inválida');
    }

    // Verificar se usuário está ativo
    if (!user.ativo) {
      throw new NotFoundException('Usuário inativo');
    }

    // Retornar usuário com informações do funcionário
    const primeiraInfo = funcionario.informacoesFuncionais[0];
    return {
      id: user.id,
      funcionario: {
        id: funcionario.id,
        nome: funcionario.nome,
        cpf: funcionario.cpf,
        setor: primeiraInfo?.setor || null,
        matricula: primeiraInfo?.matricula || '',
        informacoesFuncionais: funcionario.informacoesFuncionais,
      },
      permissoes: user.permissoes,
    };
  }
} 