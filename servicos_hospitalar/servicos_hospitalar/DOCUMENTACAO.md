# Documentação do Sistema de Serviços Hospitalares

## Funcionalidades Implementadas

### 1. Sistema de Autenticação e Autorização
- Login com JWT
- Controle de permissões por sistema e perfil
- Middleware de autenticação

### 2. Gestão de Funcionários (Sistema GP)
- CRUD completo de funcionários
- Upload de fotos
- Informações pessoais e funcionais
- Relacionamento com setores e vínculos

### 3. Gestão de Setores
- CRUD de setores/departamentos
- Upload de imagens dos setores
- Informações de contato

### 4. Gestão de Vínculos
- CRUD de tipos de vínculo
- Upload de imagens dos vínculos

### 5. Sistema de Notícias (ASCOM)
- CRUD de notícias
- Upload de imagens e vídeos
- Sistema de publicação

### 6. Tipos de Etiquetas (Sistema GP)
- CRUD de tipos de etiquetas para atestados e licenças
- Seleção de ícones específicos para área médica
- Cores personalizáveis
- Interface intuitiva para gestão

## Tipos de Etiquetas

### Funcionalidades
- **Criação**: Adicionar novos tipos de etiquetas com nome, ícone, descrição e cor
- **Edição**: Modificar tipos de etiquetas existentes
- **Exclusão**: Remover tipos de etiquetas (soft delete)
- **Visualização**: Lista organizada com preview dos ícones e cores

### Ícones Disponíveis
O sistema oferece uma variedade de ícones específicos para área médica:
- 🏥 Médico
- 📅 Calendário
- 📄 Documento
- ⏰ Relógio
- ⚠️ Aviso
- ✅ Verificado
- ❌ Negado
- ❤️ Coração
- 💊 Medicamento
- 🚑 Ambulância
- 🩺 Estetoscópio
- 💉 Seringa
- 🩹 Bandagem
- 🌡️ Termômetro
- 🔬 Microscópio
- 🧬 DNA
- 🧠 Cérebro
- 🦴 Osso
- 🦷 Dente
- 👁️ Olho

### Tipos Pré-configurados
O sistema já vem com os seguintes tipos de etiquetas configurados:
1. **Atestado Médico** - Para afastamentos médicos
2. **Licença Maternidade** - Para gestantes e mães
3. **Licença Paternidade** - Para pais
4. **Licença por Doença** - Para doenças
5. **Licença por Acidente** - Para acidentes de trabalho
6. **Licença para Tratamento** - Para tratamentos de saúde
7. **Licença Capacitação** - Para capacitação profissional
8. **Licença Sem Vencimentos** - Sem remuneração

### Permissões
- **Usuários comuns**: Visualizar tipos de etiquetas
- **Administradores**: Criar, editar e excluir tipos de etiquetas

## Tecnologias Utilizadas

### Backend
- NestJS
- Prisma ORM
- MySQL
- JWT para autenticação
- Multer para upload de arquivos

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Axios para requisições HTTP

## Estrutura do Projeto

```
servicos_hospitalar/
├── servicos_hospitalar-backend/     # API NestJS
│   ├── src/
│   │   ├── tipos-etiquetas/         # Módulo de tipos de etiquetas
│   │   ├── funcionarios/            # Módulo de funcionários
│   │   ├── setores/                 # Módulo de setores
│   │   └── ...
│   └── prisma/
│       └── schema.prisma            # Schema do banco de dados
└── servicos_hospitalar-frontend/    # Frontend Next.js
    └── src/
        └── app/
            └── sistemas/
                └── gp/              # Sistema GP
                    ├── components/  # Componentes React
                    └── services/    # Serviços de API
```

## Como Usar

### 1. Configuração do Banco de Dados
```bash
cd servicos_hospitalar-backend
npx prisma migrate dev
npx ts-node prisma/seed-tipos-etiquetas.ts
```

### 2. Iniciar o Backend
```bash
cd servicos_hospitalar-backend
npm run start:dev
```

### 3. Iniciar o Frontend
```bash
cd servicos_hospitalar-frontend
npm run dev
```

### 4. Acessar o Sistema
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## API Endpoints - Tipos de Etiquetas

### GET /tipos-etiquetas
Lista todos os tipos de etiquetas ativos

### GET /tipos-etiquetas/icones
Retorna lista de ícones disponíveis

### GET /tipos-etiquetas/:id
Busca um tipo de etiqueta específico

### POST /tipos-etiquetas
Cria um novo tipo de etiqueta
```json
{
  "nome": "Nome da Etiqueta",
  "icone": "medical",
  "descricao": "Descrição opcional",
  "cor": "#FF0000"
}
```

### PATCH /tipos-etiquetas/:id
Atualiza um tipo de etiqueta existente

### DELETE /tipos-etiquetas/:id
Remove um tipo de etiqueta (soft delete) 