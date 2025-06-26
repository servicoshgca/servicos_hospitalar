const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAuth() {
  try {
    console.log('🔐 Testando autenticação...\n');

    // 1. Testar login
    console.log('1. Testando login...');
    const loginResponse = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpf: '00000000000',
        password: 'admin123'
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.log('❌ Erro no login:', errorData);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login bem-sucedido!');
    console.log('Token:', loginData.access_token.substring(0, 50) + '...');
    console.log('Usuário:', loginData.user.funcionario.nome);

    // 2. Testar acesso às permissões com token
    console.log('\n2. Testando acesso às permissões...');
    const permissionsResponse = await fetch('http://localhost:3001/permissions', {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
      },
    });

    if (!permissionsResponse.ok) {
      const errorData = await permissionsResponse.json();
      console.log('❌ Erro ao acessar permissões:', errorData);
      return;
    }

    const permissionsData = await permissionsResponse.json();
    console.log('✅ Acesso às permissões bem-sucedido!');
    console.log('Total de permissões:', permissionsData.length);

    // 3. Testar dados disponíveis
    console.log('\n3. Testando dados disponíveis...');
    const availableDataResponse = await fetch('http://localhost:3001/permissions/available-data', {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
      },
    });

    if (!availableDataResponse.ok) {
      const errorData = await availableDataResponse.json();
      console.log('❌ Erro ao acessar dados disponíveis:', errorData);
      return;
    }

    const availableData = await availableDataResponse.json();
    console.log('✅ Dados disponíveis acessados!');
    console.log('Usuários:', availableData.users.length);
    console.log('Sistemas:', availableData.sistemas.length);
    console.log('Perfis:', availableData.perfis.length);

    console.log('\n✅ Todos os testes passaram!');
    console.log('\n📝 Agora você pode:');
    console.log('   1. Fazer logout no frontend');
    console.log('   2. Fazer login novamente');
    console.log('   3. Acessar "Gerenciar Permissões"');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

testAuth(); 