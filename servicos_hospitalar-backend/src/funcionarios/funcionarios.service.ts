import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuncionarioDto, UpdateFuncionarioDto } from './dto';
import { LogsService, CreateLogDto } from '../logs/logs.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FuncionariosService {
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService,
  ) {}

  async create(createFuncionarioDto: CreateFuncionarioDto, usuarioId?: string, ip?: string, userAgent?: string) {
    const { cpf, informacoesFuncionais, ...dadosFuncionario } = createFuncionarioDto;

    // Verificar se já existe funcionário com CPF
    const existingFuncionario = await this.prisma.funcionario.findFirst({
      where: { cpf },
    });

    if (existingFuncionario) {
      throw new ConflictException('Funcionário já existe com este CPF');
    }

    // Verificar se já existe matrícula
    if (informacoesFuncionais) {
      for (const info of informacoesFuncionais) {
        if (info.matricula) {
          const existingMatricula = await this.prisma.informacaoFuncional.findFirst({
            where: { matricula: info.matricula },
          });

          if (existingMatricula) {
            throw new ConflictException(`Matrícula ${info.matricula} já existe`);
          }
        }
      }
    }

    try {
      console.log('Tentando criar funcionário com CPF:', cpf, 'e matrícula:', informacoesFuncionais[0]?.matricula);
      console.log('Validações passaram, criando funcionário...');

      // Criar funcionário primeiro (sem informações funcionais)
      const funcionario = await this.prisma.funcionario.create({
        data: {
          ...dadosFuncionario,
          cpf,
        },
      });

      console.log('Funcionário criado com sucesso:', funcionario.id);

      // Criar informações funcionais separadamente
      if (informacoesFuncionais && informacoesFuncionais.length > 0) {
        for (const info of informacoesFuncionais) {
          await this.prisma.informacaoFuncional.create({
            data: {
              matricula: info.matricula,
              cargo: info.cargo,
              situacao: info.situacao || 'ATIVO',
              dataAdmissao: new Date(info.dataAdmissao),
              dataDemissao: info.dataDemissao ? new Date(info.dataDemissao) : null,
              cargaHoraria: info.cargaHoraria,
              salario: info.salario || 0,
              refeicao: info.refeicao ?? true,
              numeroPastaFisica: info.numeroPastaFisica || '',
              rhBahia: info.rhBahia || '',
              ativo: info.ativo ?? true,
              funcionario: {
                connect: { id: funcionario.id }
              },
              setor: {
                connect: { id: info.setorId }
              },
              vinculo: {
                connect: { id: info.vinculoId }
              },
            },
          });
        }
        console.log('Informações funcionais criadas com sucesso');
      }

      // Criar usuário automaticamente
      const cpfLimpo = cpf.replace(/\D/g, '');
      const senhaTemporaria = cpfLimpo; // Usar CPF como senha
      const senhaHash = await bcrypt.hash(senhaTemporaria, 10);

      const usuario = await this.prisma.user.create({
        data: {
          email: funcionario.email || `${cpfLimpo}@empresa.com`,
          password: senhaHash,
          funcionarioId: funcionario.id,
          ativo: true,
        },
        include: {
          permissoes: {
            include: {
              sistema: true,
              perfil: true,
            },
          },
        },
      });

      console.log('Usuário criado com sucesso:', usuario.id);

      // Buscar funcionário completo com relacionamentos
      const funcionarioCompleto = await this.prisma.funcionario.findUnique({
        where: { id: funcionario.id },
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

      // Registrar log de criação se usuarioId foi fornecido
      if (usuarioId) {
        const logData: CreateLogDto = {
          acao: 'CREATE',
          entidade: 'Funcionario',
          entidadeId: funcionario.id,
          sistema: 'GP',
          dadosNovos: {
            ...funcionarioCompleto,
            senhaTemporaria: undefined, // Não logar a senha
          },
          usuarioId,
          ip,
          userAgent,
        };

        await this.logsService.create(logData);
      }

      // Retornar funcionário com usuário criado
      return {
        ...funcionarioCompleto,
        senhaTemporaria, // Incluir senha temporária na resposta
      };
    } catch (error) {
      console.error('Erro ao criar funcionário:', error);
      throw error;
    }
  }

  async findAll() {
    return this.prisma.funcionario.findMany({
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
      orderBy: {
        nome: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const funcionario = await this.prisma.funcionario.findUnique({
      where: { id },
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

    return funcionario;
  }

  async update(id: string, updateFuncionarioDto: UpdateFuncionarioDto, usuarioId?: string, ip?: string, userAgent?: string) {
    const funcionarioAnterior = await this.findOne(id);

    const { cpf, informacoesFuncionais } = updateFuncionarioDto;

    // Verificar se já existe outro funcionário com CPF
    if (cpf) {
      const existingFuncionario = await this.prisma.funcionario.findFirst({
        where: {
          cpf,
          NOT: { id },
        },
      });

      if (existingFuncionario) {
        throw new ConflictException('Funcionário já existe com este CPF');
      }
    }

    // Verificar se já existe matrícula (para cada nova informação funcional)
    if (informacoesFuncionais) {
      for (const info of informacoesFuncionais) {
        if (info.matricula) {
          const existingMatricula = await this.prisma.informacaoFuncional.findFirst({
            where: {
              matricula: info.matricula,
              NOT: {
                id: info.id, // Ignora o próprio registro se estiver atualizando
              },
            },
          });

          if (existingMatricula) {
            throw new ConflictException(`Matrícula ${info.matricula} já existe`);
          }
        }
      }
    }

    const funcionario = await this.prisma.funcionario.update({
      where: { id },
      data: {
        ...updateFuncionarioDto,
        informacoesFuncionais: {
          upsert: informacoesFuncionais?.map(info => ({
            where: { id: info.id || 'new' }, // 'new' para forçar create se não existir
            create: {
              matricula: info.matricula,
              cargo: info.cargo,
              situacao: info.situacao || 'ATIVO',
              dataAdmissao: new Date(info.dataAdmissao),
              dataDemissao: info.dataDemissao ? new Date(info.dataDemissao) : null,
              cargaHoraria: info.cargaHoraria,
              salario: info.salario || 0,
              refeicao: info.refeicao ?? true,
              numeroPastaFisica: info.numeroPastaFisica || '',
              rhBahia: info.rhBahia || '',
              ativo: info.ativo ?? true,
              setor: {
                connect: { id: info.setorId }
              },
              vinculo: {
                connect: { id: info.vinculoId }
              },
            },
            update: {
              matricula: info.matricula,
              cargo: info.cargo,
              situacao: info.situacao || 'ATIVO',
              dataAdmissao: new Date(info.dataAdmissao),
              dataDemissao: info.dataDemissao ? new Date(info.dataDemissao) : null,
              cargaHoraria: info.cargaHoraria,
              salario: info.salario || 0,
              refeicao: info.refeicao ?? true,
              numeroPastaFisica: info.numeroPastaFisica || '',
              rhBahia: info.rhBahia || '',
              ativo: info.ativo ?? true,
              setor: {
                connect: { id: info.setorId }
              },
              vinculo: {
                connect: { id: info.vinculoId }
              },
            },
          })),
        },
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

    // Registrar log de atualização se usuarioId foi fornecido
    if (usuarioId) {
      const logData: CreateLogDto = {
        acao: 'UPDATE',
        entidade: 'Funcionario',
        entidadeId: funcionario.id,
        sistema: 'GP',
        dadosAnteriores: funcionarioAnterior,
        dadosNovos: funcionario,
        usuarioId,
        ip,
        userAgent,
      };

      await this.logsService.create(logData);
    }

    return funcionario;
  }

  async remove(id: string, usuarioId?: string, ip?: string, userAgent?: string) {
    const funcionarioAnterior = await this.findOne(id);

    const funcionario = await this.prisma.funcionario.delete({
      where: { id },
    });

    // Registrar log de exclusão se usuarioId foi fornecido
    if (usuarioId) {
      const logData: CreateLogDto = {
        acao: 'DELETE',
        entidade: 'Funcionario',
        entidadeId: funcionario.id,
        sistema: 'GP',
        dadosAnteriores: funcionarioAnterior,
        dadosNovos: funcionario,
        usuarioId,
        ip,
        userAgent,
      };

      await this.logsService.create(logData);
    }

    return funcionario;
  }
} 