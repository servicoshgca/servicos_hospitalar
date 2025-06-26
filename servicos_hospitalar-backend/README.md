# Sistema de Controle de Acesso - Serviços Hospitalares

Este projeto implementa um sistema completo de controle de acesso para múltiplos sistemas hospitalares, permitindo gerenciar usuários, permissões e hierarquias de acesso.

## 🏗️ Estrutura do Sistema

### Tabelas Principais

1. **Users** - Usuários do sistema
2. **Setores** - Departamentos/Setores da instituição
3. **Sistemas** - Diferentes sistemas disponíveis
4. **Perfis** - Níveis de acesso (Usuário Comum, Gestor, Administrador)
5. **UserPermissions** - Relacionamento entre usuários, sistemas e perfis

### Sistemas Disponíveis

- **Sistema GP** - Gestão de Pessoal
- **Sistema Refeitório** - Controle do refeitório
- **Sistema CDO** - Comissão de Óbitos
- **Sistema Almoxarifado** - Controle de estoque
- **Sistema Ascom** - Criação de notícias

### Níveis de Acesso

- **Nível 1** - Usuário Comum (acesso básico)
- **Nível 2** - Gestor (acesso intermediário)
- **Nível 3** - Administrador (acesso total)

## 🚀 Configuração e Instalação

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Banco de Dados
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/servicos_hospitalar"
```

### 3. Gerar Cliente Prisma
```bash
npm run db:generate
```

### 4. Sincronizar Schema com Banco
```bash
npm run db:push
```

### 5. Executar Seed (Dados Iniciais)
```bash
npm run db:seed
```

### 6. Iniciar Servidor
```bash
npm run start:dev
```

## 📊 Dados Iniciais Criados

O seed cria automaticamente:

### Setores
- Gestão de Pessoas
- Nutrição
- Administrativo
- Almoxarifado
- Comunicação

### Sistemas
- Sistema GP
- Sistema Refeitório
- Sistema CDO
- Sistema Almoxarifado
- Sistema Ascom

### Perfis
- Usuário Comum (Nível 1)
- Gestor (Nível 2)
- Administrador (Nível 3)

### Usuários de Exemplo
- **000.000.000-00** / admin123 (Administrador com acesso total)
- **111.111.111-11** / admin123 (Gestor de Pessoas com acesso específico)

## 🔐 Como Usar o Sistema de Permissões

### 1. Criar Usuário
```bash
POST /users
{
  "name": "João Silva",
  "email": "joao@hospital.com",
  "password": "senha123",
  "cpf": "123.456.789-00",
  "matricula": "FUNC001",
  "setorId": "id-do-setor"
}
```

### 2. Fazer Login
```bash
POST /users/login
{
  "cpf": "123.456.789-00",
  "password": "senha123"
}
```

### 2. Atribuir Permissão
```bash
POST /users/{userId}/permissions
{
  "sistemaId": "id-do-sistema",
  "perfilId": "id-do-perfil"
}
```

### 3. Verificar Permissões
```bash
GET /users/{userId}/permissions
```

### 4. Remover Permissão
```bash
DELETE /users/{userId}/permissions/{sistemaId}
```

## 🛡️ Implementando Controle de Acesso nos Controllers

### 1. Importar Dependências
```typescript
import { UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequireSistema, RequireNivel } from '../auth/decorators/require-permission.decorator';
```

### 2. Aplicar Guard no Controller
```typescript
@Controller('meu-sistema')
@UseGuards(PermissionGuard)
export class MeuSistemaController {
  // endpoints aqui
}
```

### 3. Definir Permissões nos Endpoints
```typescript
// Acesso básico (nível 1)
@Get('dados')
@RequireSistema('Sistema GP')
@RequireNivel(1)
getDados() {
  // lógica aqui
}

// Acesso de gestor (nível 2)
@Post('dados')
@RequireSistema('Sistema GP')
@RequireNivel(2)
createDados() {
  // lógica aqui
}

// Acesso de administrador (nível 3)
@Delete('dados/:id')
@RequireSistema('Sistema GP')
@RequireNivel(3)
deleteDados() {
  // lógica aqui
}
```

## 📋 Exemplos de Uso

### Cenário 1: Usuário do Setor de Gestão de Pessoas
- **Acesso ao Sistema GP**: Administrador (nível 3)
- **Acesso ao Sistema Refeitório**: Usuário Comum (nível 1)
- **Outros sistemas**: Sem acesso

### Cenário 2: Usuário Geral
- **Acesso ao Sistema Refeitório**: Usuário Comum (nível 1)
- **Outros sistemas**: Sem acesso

### Cenário 3: Administrador do Sistema
- **Todos os sistemas**: Administrador (nível 3)

## 🔧 Endpoints Disponíveis

### Usuários
- `GET /users` - Listar todos os usuários
- `GET /users/:id` - Buscar usuário por ID
- `POST /users` - Criar usuário
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Remover usuário
- `GET /users/:id/permissions` - Ver permissões do usuário
- `POST /users/:id/permissions` - Atribuir permissão
- `DELETE /users/:id/permissions/:sistemaId` - Remover permissão

### Sistemas
- `GET /sistemas` - Listar todos os sistemas
- `GET /sistemas/:id` - Buscar sistema por ID
- `POST /sistemas` - Criar sistema
- `PATCH /sistemas/:id` - Atualizar sistema
- `DELETE /sistemas/:id` - Remover sistema

## 🚨 Importante

1. **Autenticação**: Este sistema assume que você implementará autenticação (JWT, Session, etc.) e que o usuário estará disponível em `request.user`

2. **Segurança**: Sempre valide e sanitize os dados de entrada

3. **Backup**: Faça backup regular do banco de dados

4. **Logs**: Implemente logs para auditoria de acessos

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
