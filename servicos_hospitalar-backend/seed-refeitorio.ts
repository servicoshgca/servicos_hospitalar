import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do sistema Refeitório...');

  // Remover sistema Copa se existir (limpeza)
  const sistemaCopa = await prisma.sistema.findFirst({
    where: {
      nome: 'Copa',
    },
  });

  if (sistemaCopa) {
    console.log('Removendo sistema Copa antigo...');
    
    // Remover permissões associadas ao sistema Copa
    await prisma.userPermission.deleteMany({
      where: {
        sistemaId: sistemaCopa.id,
      },
    });
    
    // Remover o sistema Copa
    await prisma.sistema.delete({
      where: {
        id: sistemaCopa.id,
      },
    });
    
    console.log('Sistema Copa removido com sucesso!');
  }

  // Procurar por qualquer sistema que contenha 'refeit' (case insensitive)
  const sistemaExistente = await prisma.sistema.findFirst({
    where: {
      nome: {
        contains: 'refeit',
      },
    },
  });

  let sistemaRefeitorio;
  if (sistemaExistente) {
    // Atualizar o nome para 'Refeitório' se necessário
    if (sistemaExistente.nome !== 'Refeitório') {
      sistemaRefeitorio = await prisma.sistema.update({
        where: { id: sistemaExistente.id },
        data: { nome: 'Refeitório' },
      });
      console.log('Nome do sistema atualizado para: Refeitório');
    } else {
      sistemaRefeitorio = sistemaExistente;
      console.log('Sistema Refeitório já existe:', sistemaRefeitorio.nome);
    }
  } else {
    // Criar o sistema Refeitório
    sistemaRefeitorio = await prisma.sistema.create({
      data: {
        nome: 'Refeitório',
        descricao: 'Sistema de gestão do refeitório hospitalar',
        ativo: true,
      },
    });
    console.log('Sistema Refeitório criado:', sistemaRefeitorio);
  }

  // Buscar perfis existentes
  const perfis = await prisma.perfil.findMany({
    where: { ativo: true },
  });

  // Buscar usuários existentes
  const usuarios = await prisma.user.findMany({
    where: { ativo: true },
    include: {
      funcionario: {
        include: {
          informacoesFuncionais: {
            include: {
              setor: true,
            },
          },
        },
      },
      permissoes: {
        include: {
          perfil: true,
        },
      },
    },
  });

  // Para cada usuário, configurar permissões do sistema Refeitório
  for (const usuario of usuarios) {
    // Verificar se já existe permissão para o sistema Refeitório
    const permissaoExistente = await prisma.userPermission.findFirst({
      where: {
        userId: usuario.id,
        sistemaId: sistemaRefeitorio.id,
      },
    });

    if (!permissaoExistente) {
      // Verificar se o usuário tem perfil de administrador ou gestor em outros sistemas
      const temPerfilAlto = usuario.permissoes.some(permissao => permissao.perfil.nivel >= 2);
      
      let perfilId;
      if (temPerfilAlto) {
        // Usar o perfil de gestor (nível 2) para acessar a copa
        const perfilGestor = perfis.find(p => p.nivel === 2);
        perfilId = perfilGestor?.id;
        console.log(`Permissão Refeitório criada para usuário: ${usuario.funcionario.nome} (perfil: ${perfilGestor?.nome} - acesso à copa)`);
      } else {
        // Usar o perfil de usuário comum (nível 1) - apenas acesso básico
        const perfilUsuario = perfis.find(p => p.nivel === 1);
        perfilId = perfilUsuario?.id;
        console.log(`Permissão Refeitório criada para usuário: ${usuario.funcionario.nome} (perfil: ${perfilUsuario?.nome} - acesso básico)`);
      }

      if (perfilId) {
        await prisma.userPermission.create({
          data: {
            userId: usuario.id,
            sistemaId: sistemaRefeitorio.id,
            perfilId: perfilId,
            ativo: true,
          },
        });
      }
    } else {
      console.log(`Permissão já existe para usuário: ${usuario.funcionario.nome}`);
    }
  }

  console.log('Seed do sistema Refeitório concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 