const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPermissions() {
  try {
    console.log('🔍 Testando funcionalidades de permissões...\n');

    // 1. Verificar se existem usuários
    const users = await prisma.user.findMany({
      include: {
        funcionario: true,
        permissoes: {
          include: {
            sistema: true,
            perfil: true,
          },
        },
      },
    });

    console.log(`📊 Total de usuários: ${users.length}`);
    
    if (users.length === 0) {
      console.log('❌ Nenhum usuário encontrado. Crie usuários primeiro.');
      return;
    }

    // 2. Verificar se existem sistemas
    const sistemas = await prisma.sistema.findMany({
      where: { ativo: true },
    });

    console.log(`📊 Total de sistemas ativos: ${sistemas.length}`);
    
    if (sistemas.length === 0) {
      console.log('❌ Nenhum sistema encontrado. Crie sistemas primeiro.');
      return;
    }

    // 3. Verificar se existem perfis
    const perfis = await prisma.perfil.findMany({
      where: { ativo: true },
    });

    console.log(`📊 Total de perfis ativos: ${perfis.length}`);
    
    if (perfis.length === 0) {
      console.log('❌ Nenhum perfil encontrado. Crie perfis primeiro.');
      return;
    }

    // 4. Verificar usuários administradores
    const admins = users.filter(user => 
      user.permissoes.some(permissao => permissao.perfil.nivel >= 3)
    );

    console.log(`👑 Usuários administradores: ${admins.length}`);
    
    if (admins.length === 0) {
      console.log('⚠️  Nenhum usuário administrador encontrado.');
      console.log('   Para usar o sistema de permissões, você precisa de um usuário com nível 3 ou superior.');
    } else {
      console.log('✅ Usuários administradores encontrados:');
      admins.forEach(admin => {
        console.log(`   - ${admin.funcionario.nome} (${admin.funcionario.cpf})`);
      });
    }

    // 5. Mostrar permissões existentes
    const allPermissions = await prisma.userPermission.findMany({
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

    console.log(`\n📋 Total de permissões: ${allPermissions.length}`);
    
    if (allPermissions.length > 0) {
      console.log('📋 Permissões existentes:');
      allPermissions.forEach(permission => {
        console.log(`   - ${permission.user.funcionario.nome} → ${permission.sistema.nome} (${permission.perfil.nome})`);
      });
    }

    // 6. Mostrar dados disponíveis para atribuição
    console.log('\n📋 Dados disponíveis para atribuição de permissões:');
    
    console.log('\n👥 Usuários:');
    users.forEach(user => {
      console.log(`   - ${user.funcionario.nome} (${user.funcionario.cpf})`);
    });

    console.log('\n🖥️  Sistemas:');
    sistemas.forEach(sistema => {
      console.log(`   - ${sistema.nome}${sistema.descricao ? ` - ${sistema.descricao}` : ''}`);
    });

    console.log('\n👤 Perfis:');
    perfis.forEach(perfil => {
      console.log(`   - ${perfil.nome} (Nível ${perfil.nivel})${perfil.descricao ? ` - ${perfil.descricao}` : ''}`);
    });

    console.log('\n✅ Teste concluído!');
    console.log('\n📝 Para usar o sistema de permissões:');
    console.log('   1. Faça login com um usuário administrador');
    console.log('   2. Clique em "Gerenciar Permissões" na página principal');
    console.log('   3. Use a interface para atribuir, editar ou remover permissões');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPermissions(); 