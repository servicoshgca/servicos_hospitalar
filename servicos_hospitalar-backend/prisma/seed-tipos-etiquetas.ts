import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de tipos de etiquetas...');

  const tiposEtiquetas = [
    {
      nome: 'Atestado Médico',
      icone: 'medical',
      descricao: 'Atestado médico para afastamento do trabalho',
      cor: '#EF4444', // Vermelho
    },
    {
      nome: 'Licença Maternidade',
      icone: 'heart',
      descricao: 'Licença para gestantes e mães',
      cor: '#EC4899', // Rosa
    },
    {
      nome: 'Licença Paternidade',
      icone: 'heart',
      descricao: 'Licença para pais',
      cor: '#3B82F6', // Azul
    },
    {
      nome: 'Licença por Doença',
      icone: 'pill',
      descricao: 'Licença por motivo de doença',
      cor: '#F59E0B', // Amarelo
    },
    {
      nome: 'Licença por Acidente',
      icone: 'ambulance',
      descricao: 'Licença por acidente de trabalho',
      cor: '#DC2626', // Vermelho escuro
    },
    {
      nome: 'Licença para Tratamento',
      icone: 'stethoscope',
      descricao: 'Licença para tratamento de saúde',
      cor: '#8B5CF6', // Roxo
    },
    {
      nome: 'Licença Capacitação',
      icone: 'document',
      descricao: 'Licença para capacitação profissional',
      cor: '#10B981', // Verde
    },
    {
      nome: 'Licença Sem Vencimentos',
      icone: 'calendar',
      descricao: 'Licença sem remuneração',
      cor: '#6B7280', // Cinza
    },
  ];

  for (const tipo of tiposEtiquetas) {
    try {
      await prisma.tipoEtiqueta.upsert({
        where: { nome: tipo.nome },
        update: {},
        create: tipo,
      });
      console.log(`✅ Tipo de etiqueta "${tipo.nome}" criado/atualizado`);
    } catch (error) {
      console.error(`❌ Erro ao criar tipo de etiqueta "${tipo.nome}":`, error);
    }
  }

  console.log('🎉 Seed de tipos de etiquetas concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 