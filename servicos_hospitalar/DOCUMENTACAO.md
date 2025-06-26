# Sistema de Controle de Acesso - Documentação Completa

## 📋 Visão Geral

Este projeto implementa um sistema completo de controle de acesso para múltiplos sistemas hospitalares, permitindo gerenciar usuários, permissões e hierarquias de acesso de forma flexível e segura.

## 🏗️ Arquitetura

### Backend (NestJS + Prisma + MySQL)
- **Framework**: NestJS
- **ORM**: Prisma
- **Banco de Dados**: MySQL
- **Validação**: class-validator
- **Criptografia**: bcrypt

### Frontend (Next.js + TypeScript + Tailwind CSS)
- **Framework**: Next.js 14
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Estado**: React Hooks

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### 1. Users (Usuários)
```sql
- id: String (CUID)
- name: String
- email: String (único)
- password: String (criptografada)
- cpf: String (único)
- matricula: String (único)
- ativo: Boolean
- setorId: String (FK para Setor)
- createdAt: DateTime
- updatedAt: DateTime
```

#### 2. Setores (Departamentos)
```sql
- id: String (CUID)
- nome: String (único)
- descricao: String
- ativo: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

#### 3. Sistemas
```sql
- id: String (CUID)
- nome: String (único)
- descricao: String
- ativo: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

#### 4. Perfis (Níveis de Acesso)
```sql
- id: String (CUID)
- nome: String (único)
- descricao: String
- nivel: Int (1=usuário, 2=gestor, 3=admin)
- ativo: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

#### 5. UserPermissions (Permissões)
```sql
- id: String (CUID)
- userId: String (FK para User)
- sistemaId: String (FK para Sistema)
- perfilId: String (FK para Perfil)
- ativo: Boolean
- createdAt: DateTime
- updatedAt: DateTime
- UNIQUE(userId, sistemaId)
```

## 🔐 Sistema de Permissões

### Níveis de Acesso
1. **Nível 1 - Usuário Comum**: Acesso básico de leitura
2. **Nível 2 - Gestor**: Acesso intermediário (criar, editar)
3. **Nível 3 - Administrador**: Acesso total (criar, editar, deletar)

### Sistemas Disponíveis
- **Sistema GP**: Gestão de Pessoal
- **Sistema Refeitório**: Controle do refeitório
- **Sistema CDO**: Comissão de Óbitos
- **Sistema Almoxarifado**: Controle de estoque
- **Sistema Ascom**: Criação de notícias

## 🚀 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### 1. Configurar Backend

```bash
cd servicos_hospitalar-backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações de banco

# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema com banco
npm run db:push

# Executar seed (dados iniciais)
npm run db:seed

# Iniciar servidor
npm run start:dev
```

### 2. Configurar Frontend

```bash
cd servicos_hospitalar-frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📊 Dados Iniciais

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

### Usuários de Teste
- **admin@hospital.com** / admin123 (Administrador com acesso total)
- **gp@hospital.com** / admin123 (Gestor de Pessoas com acesso específico)

## 🔧 API Endpoints

### Usuários
```
GET    /users                    # Listar todos os usuários
GET    /users/:id               # Buscar usuário por ID
POST   /users                   # Criar usuário
PATCH  /users/:id               # Atualizar usuário
DELETE /users/:id               # Remover usuário
GET    /users/:id/permissions   # Ver permissões do usuário
POST   /users/:id/permissions   # Atribuir permissão
DELETE /users/:id/permissions/:sistemaId # Remover permissão
```

### Sistemas
```
GET    /sistemas                # Listar todos os sistemas
GET    /sistemas/:id            # Buscar sistema por ID
POST   /sistemas                # Criar sistema
PATCH  /sistemas/:id            # Atualizar sistema
DELETE /sistemas/:id            # Remover sistema
```

## 🛡️ Implementando Controle de Acesso

### 1. Backend - Criar Controller com Permissões

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { RequireSistema, RequireNivel } from '../auth/decorators/require-permission.decorator';

@Controller('meu-sistema')
@UseGuards(PermissionGuard)
export class MeuSistemaController {
  
  // Acesso básico (nível 1)
  @Get('dados')
  @RequireSistema('Sistema GP')
  @RequireNivel(1)
  getDados() {
    return { message: 'Dados do sistema' };
  }

  // Acesso de gestor (nível 2)
  @Post('dados')
  @RequireSistema('Sistema GP')
  @RequireNivel(2)
  createDados() {
    return { message: 'Dados criados' };
  }

  // Acesso de administrador (nível 3)
  @Delete('dados/:id')
  @RequireSistema('Sistema GP')
  @RequireNivel(3)
  deleteDados() {
    return { message: 'Dados deletados' };
  }
}
```

### 2. Frontend - Verificar Permissões

```typescript
// Hook para verificar permissões
const usePermissions = (sistemaId: string, nivelMinimo: number = 1) => {
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    // Verificar permissão com a API
    checkPermission(sistemaId, nivelMinimo);
  }, [sistemaId, nivelMinimo]);
  
  return hasPermission;
};

// Componente condicional
const ProtectedComponent = ({ sistemaId, nivelMinimo, children }) => {
  const hasPermission = usePermissions(sistemaId, nivelMinimo);
  
  if (!hasPermission) {
    return <div>Acesso negado</div>;
  }
  
  return children;
};
```

## 📋 Exemplos de Uso

### Cenário 1: Usuário do Setor de Gestão de Pessoas
```json
{
  "user": {
    "name": "João Silva",
    "email": "joao@gp.hospital.com",
    "setor": "Gestão de Pessoas"
  },
  "permissions": [
    {
      "sistema": "Sistema GP",
      "nivel": 3,
      "perfil": "Administrador"
    },
    {
      "sistema": "Sistema Refeitório",
      "nivel": 1,
      "perfil": "Usuário Comum"
    }
  ]
}
```

### Cenário 2: Usuário Geral
```json
{
  "user": {
    "name": "Maria Santos",
    "email": "maria@hospital.com",
    "setor": "Enfermagem"
  },
  "permissions": [
    {
      "sistema": "Sistema Refeitório",
      "nivel": 1,
      "perfil": "Usuário Comum"
    }
  ]
}
```

### Cenário 3: Administrador do Sistema
```json
{
  "user": {
    "name": "Admin",
    "email": "admin@hospital.com",
    "setor": "Administrativo"
  },
  "permissions": [
    {
      "sistema": "Sistema GP",
      "nivel": 3,
      "perfil": "Administrador"
    },
    {
      "sistema": "Sistema Refeitório",
      "nivel": 3,
      "perfil": "Administrador"
    },
    {
      "sistema": "Sistema CDO",
      "nivel": 3,
      "perfil": "Administrador"
    },
    {
      "sistema": "Sistema Almoxarifado",
      "nivel": 3,
      "perfil": "Administrador"
    },
    {
      "sistema": "Sistema Ascom",
      "nivel": 3,
      "perfil": "Administrador"
    }
  ]
}
```

## 🔒 Segurança

### Boas Práticas Implementadas
1. **Criptografia de Senhas**: bcrypt com salt
2. **Validação de Dados**: class-validator
3. **Controle de Acesso**: Guards e Decorators
4. **Relacionamentos Seguros**: Foreign Keys com CASCADE
5. **Índices Únicos**: Evita duplicatas de permissões

### Recomendações Adicionais
1. **Implementar JWT**: Para autenticação stateless
2. **Rate Limiting**: Limitar requisições por IP
3. **Logs de Auditoria**: Registrar todas as ações
4. **HTTPS**: Em produção, sempre usar HTTPS
5. **Backup Regular**: Do banco de dados

## 🧪 Testes

### Executar Testes Backend
```bash
cd servicos_hospitalar-backend
npm run test
npm run test:e2e
```

### Executar Testes Frontend
```bash
cd servicos_hospitalar-frontend
npm run test
```

## 📈 Monitoramento e Logs

### Logs Recomendados
- Login/Logout de usuários
- Criação/edição de permissões
- Acesso negado a sistemas
- Erros de validação
- Operações críticas (deletar usuário, etc.)

### Métricas Importantes
- Usuários ativos por sistema
- Tentativas de acesso negado
- Tempo de resposta da API
- Uso de recursos do banco

## 🚀 Deploy

### Backend (Produção)
```bash
# Build
npm run build

# Start
npm run start:prod
```

### Frontend (Produção)
```bash
# Build
npm run build

# Start
npm start
```

### Variáveis de Ambiente (Produção)
```env
# Backend
DATABASE_URL="mysql://user:pass@host:3306/db"
JWT_SECRET="seu-jwt-secret-aqui"
NODE_ENV="production"

# Frontend
NEXT_PUBLIC_API_URL="https://api.seu-dominio.com"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs
3. Abra uma issue no repositório
4. Entre em contato com a equipe

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes. 