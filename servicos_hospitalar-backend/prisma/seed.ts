import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar setores
  const setores = await Promise.all([
    prisma.setor.upsert({
      where: { nome: 'Gestão de Pessoas' },
      update: {},
      create: {
        nome: 'Gestão de Pessoas',
        descricao: 'Setor responsável pela gestão de recursos humanos',
      },
    }),
    prisma.setor.upsert({
      where: { nome: 'Nutrição' },
      update: {},
      create: {
        nome: 'Nutrição',
        descricao: 'Setor responsável pelo refeitório e alimentação',
      },
    }),
    prisma.setor.upsert({
      where: { nome: 'Administrativo' },
      update: {},
      create: {
        nome: 'Administrativo',
        descricao: 'Setor administrativo geral',
      },
    }),
    prisma.setor.upsert({
      where: { nome: 'Almoxarifado' },
      update: {},
      create: {
        nome: 'Almoxarifado',
        descricao: 'Setor responsável pelo controle de estoque',
      },
    }),
    prisma.setor.upsert({
      where: { nome: 'Comunicação' },
      update: {},
      create: {
        nome: 'Comunicação',
        descricao: 'Setor responsável pela comunicação institucional',
      },
    }),
  ]);

  console.log('✅ Setores criados:', setores.map(s => s.nome));

  // Criar sistemas
  const sistemas = await Promise.all([
    prisma.sistema.upsert({
      where: { nome: 'Sistema GP' },
      update: {},
      create: {
        nome: 'Sistema GP',
        descricao: 'Sistema de Gestão de Pessoal',
      },
    }),
    prisma.sistema.upsert({
      where: { nome: 'Sistema Refeitório' },
      update: {},
      create: {
        nome: 'Sistema Refeitório',
        descricao: 'Sistema de controle do refeitório',
      },
    }),
    prisma.sistema.upsert({
      where: { nome: 'Sistema CDO' },
      update: {},
      create: {
        nome: 'Sistema CDO',
        descricao: 'Sistema de Comissão de Óbitos',
      },
    }),
    prisma.sistema.upsert({
      where: { nome: 'Sistema Almoxarifado' },
      update: {},
      create: {
        nome: 'Sistema Almoxarifado',
        descricao: 'Sistema de controle de almoxarifado',
      },
    }),
    prisma.sistema.upsert({
      where: { nome: 'Sistema Ascom' },
      update: {},
      create: {
        nome: 'Sistema Ascom',
        descricao: 'Sistema de criação de notícias',
      },
    }),
  ]);

  console.log('✅ Sistemas criados:', sistemas.map(s => s.nome));

  // Criar perfis
  const perfis = await Promise.all([
    prisma.perfil.upsert({
      where: { nome: 'Usuário Comum' },
      update: {},
      create: {
        nome: 'Usuário Comum',
        descricao: 'Usuário com acesso básico ao sistema',
        nivel: 1,
      },
    }),
    prisma.perfil.upsert({
      where: { nome: 'Gestor' },
      update: {},
      create: {
        nome: 'Gestor',
        descricao: 'Gestor com acesso intermediário',
        nivel: 2,
      },
    }),
    prisma.perfil.upsert({
      where: { nome: 'Administrador' },
      update: {},
      create: {
        nome: 'Administrador',
        descricao: 'Administrador com acesso total',
        nivel: 3,
      },
    }),
  ]);

  console.log('✅ Perfis criados:', perfis.map(p => p.nome));

  // Criar vínculos
  const vinculos = await Promise.all([
    prisma.vinculo.upsert({
      where: { nome: 'CLT' },
      update: {},
      create: {
        nome: 'CLT',
      },
    }),
    prisma.vinculo.upsert({
      where: { nome: 'Terceirizado' },
      update: {},
      create: {
        nome: 'Terceirizado',
      },
    }),
  ]);

  console.log('✅ Vínculos criados:', vinculos.map(v => v.nome));

  // Criar funcionários
  const adminFuncionario = await prisma.funcionario.upsert({
    where: { cpf: '00000000000' },
    update: {},
    create: {
      nome: 'Administrador do Sistema',
      cpf: '00000000000',
      informacoesFuncionais: {
        create: {
          matricula: 'ADMIN001',
          setorId: setores[2].id, // Administrativo
          cargo: 'Administrador',
          vinculoId: vinculos[0].id, // CLT
          dataAdmissao: new Date(),
          cargaHoraria: '40h',
          salario: 5000,
        }
      }
    },
  });

  const gpFuncionario = await prisma.funcionario.upsert({
    where: { cpf: '11111111111' },
    update: {},
    create: {
      nome: 'Gestor de Pessoas',
      cpf: '11111111111',
      informacoesFuncionais: {
        create: {
          matricula: 'GP001',
          setorId: setores[0].id, // Gestão de Pessoas
          cargo: 'Gestor de RH',
          vinculoId: vinculos[0].id, // CLT
          dataAdmissao: new Date(),
          cargaHoraria: '40h',
          salario: 4000,
        }
      }
    },
  });

  // Criar usuários vinculados aos funcionários
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { funcionarioId: adminFuncionario.id },
    update: {},
    create: {
      email: 'admin@admin.com',
      password: hashedPassword,
      funcionarioId: adminFuncionario.id,
    },
  });

  const gpUser = await prisma.user.upsert({
    where: { funcionarioId: gpFuncionario.id },
    update: {},
    create: {
      email: 'gp@gp.com',
      password: hashedPassword,
      funcionarioId: gpFuncionario.id,
    },
  });

  // Atribuir permissões ao administrador (acesso total a todos os sistemas)
  const adminPermissions = await Promise.all(
    sistemas.map(sistema =>
      prisma.userPermission.upsert({
        where: {
          userId_sistemaId: {
            userId: adminUser.id,
            sistemaId: sistema.id,
          },
        },
        update: {},
        create: {
          userId: adminUser.id,
          sistemaId: sistema.id,
          perfilId: perfis[2].id, // Administrador
        },
      })
    )
  );

  console.log('✅ Permissões de administrador criadas');

  // Atribuir permissões ao usuário de GP
  await Promise.all([
    // Acesso total ao Sistema GP
    prisma.userPermission.upsert({
      where: {
        userId_sistemaId: {
          userId: gpUser.id,
          sistemaId: sistemas[0].id, // Sistema GP
        },
      },
      update: {},
      create: {
        userId: gpUser.id,
        sistemaId: sistemas[0].id,
        perfilId: perfis[2].id, // Administrador
      },
    }),
    // Acesso básico ao Sistema Refeitório
    prisma.userPermission.upsert({
      where: {
        userId_sistemaId: {
          userId: gpUser.id,
          sistemaId: sistemas[1].id, // Sistema Refeitório
        },
      },
      update: {},
      create: {
        userId: gpUser.id,
        sistemaId: sistemas[1].id,
        perfilId: perfis[0].id, // Usuário Comum
      },
    }),
  ]);

  console.log('✅ Usuário de GP criado:', gpFuncionario.cpf);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 