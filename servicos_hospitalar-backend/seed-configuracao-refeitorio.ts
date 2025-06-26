import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed da configuração do Refeitório...');

  // Verificar se já existe uma configuração
  const configExistente = await prisma.configuracaoRefeitorio.findFirst({
    where: { ativo: true },
  });

  if (configExistente) {
    console.log('Atualizando configuração existente...');
    
    await prisma.configuracaoRefeitorio.update({
      where: { id: configExistente.id },
      data: {
        // Valores das refeições
        valorCafe: 5.00,
        valorAlmoco: 15.00,
        valorJantar: 12.00,
        valorCeia: 8.00,
        
        // Horários do refeitório por tipo de refeição
        horarioInicioCafe: '05:30',
        horarioFimCafe: '07:15',
        horarioInicioAlmoco: '11:00',
        horarioFimAlmoco: '14:15',
        horarioInicioJantar: '19:30',
        horarioFimJantar: '20:45',
        horarioInicioCeia: '23:00',
        horarioFimCeia: '00:00',
        
        // Horários para pedidos por tipo de refeição
        horarioInicioPedidosCafe: '20:00',
        horarioFimPedidosCafe: '21:00',
        horarioInicioPedidosAlmoco: '06:00',
        horarioFimPedidosAlmoco: '09:00',
        horarioInicioPedidosJantar: '11:00',
        horarioFimPedidosJantar: '14:00',
        horarioInicioPedidosCeia: '18:00',
        horarioFimPedidosCeia: '19:59',
        
        // Horários para dietas
        horarioInicioDietas: '08:00',
        horarioFimDietas: '18:00',
        
        ativo: true,
      },
    });
    
    console.log('Configuração atualizada com sucesso!');
  } else {
    console.log('Criando nova configuração...');
    
    await prisma.configuracaoRefeitorio.create({
      data: {
        // Valores das refeições
        valorCafe: 5.00,
        valorAlmoco: 15.00,
        valorJantar: 12.00,
        valorCeia: 8.00,
        
        // Horários do refeitório por tipo de refeição
        horarioInicioCafe: '05:30',
        horarioFimCafe: '07:15',
        horarioInicioAlmoco: '11:00',
        horarioFimAlmoco: '14:15',
        horarioInicioJantar: '19:30',
        horarioFimJantar: '20:45',
        horarioInicioCeia: '23:00',
        horarioFimCeia: '00:00',
        
        // Horários para pedidos por tipo de refeição
        horarioInicioPedidosCafe: '20:00',
        horarioFimPedidosCafe: '21:00',
        horarioInicioPedidosAlmoco: '06:00',
        horarioFimPedidosAlmoco: '09:00',
        horarioInicioPedidosJantar: '11:00',
        horarioFimPedidosJantar: '14:00',
        horarioInicioPedidosCeia: '18:00',
        horarioFimPedidosCeia: '19:59',
        
        // Horários para dietas
        horarioInicioDietas: '08:00',
        horarioFimDietas: '18:00',
        
        ativo: true,
      },
    });
    
    console.log('Configuração criada com sucesso!');
  }

  console.log('Seed da configuração do Refeitório concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 