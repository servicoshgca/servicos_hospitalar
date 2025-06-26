/*
  Warnings:

  - You are about to drop the column `horarioFechamentoRefeitorio` on the `configuracoes_refeitorio` table. All the data in the column will be lost.
  - You are about to drop the column `horarioFimPedidos` on the `configuracoes_refeitorio` table. All the data in the column will be lost.
  - You are about to drop the column `horarioInicioPedidos` on the `configuracoes_refeitorio` table. All the data in the column will be lost.
  - You are about to drop the column `horarioInicioRefeitorio` on the `configuracoes_refeitorio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `configuracoes_refeitorio` DROP COLUMN `horarioFechamentoRefeitorio`,
    DROP COLUMN `horarioFimPedidos`,
    DROP COLUMN `horarioInicioPedidos`,
    DROP COLUMN `horarioInicioRefeitorio`,
    ADD COLUMN `horarioFimAlmoco` VARCHAR(191) NOT NULL DEFAULT '14:00',
    ADD COLUMN `horarioFimCafe` VARCHAR(191) NOT NULL DEFAULT '10:00',
    ADD COLUMN `horarioFimCeia` VARCHAR(191) NOT NULL DEFAULT '22:00',
    ADD COLUMN `horarioFimJantar` VARCHAR(191) NOT NULL DEFAULT '20:00',
    ADD COLUMN `horarioFimPedidosAlmoco` VARCHAR(191) NOT NULL DEFAULT '13:00',
    ADD COLUMN `horarioFimPedidosCafe` VARCHAR(191) NOT NULL DEFAULT '09:00',
    ADD COLUMN `horarioFimPedidosCeia` VARCHAR(191) NOT NULL DEFAULT '21:00',
    ADD COLUMN `horarioFimPedidosJantar` VARCHAR(191) NOT NULL DEFAULT '19:00',
    ADD COLUMN `horarioInicioAlmoco` VARCHAR(191) NOT NULL DEFAULT '11:00',
    ADD COLUMN `horarioInicioCafe` VARCHAR(191) NOT NULL DEFAULT '06:00',
    ADD COLUMN `horarioInicioCeia` VARCHAR(191) NOT NULL DEFAULT '20:00',
    ADD COLUMN `horarioInicioJantar` VARCHAR(191) NOT NULL DEFAULT '17:00',
    ADD COLUMN `horarioInicioPedidosAlmoco` VARCHAR(191) NOT NULL DEFAULT '10:00',
    ADD COLUMN `horarioInicioPedidosCafe` VARCHAR(191) NOT NULL DEFAULT '06:00',
    ADD COLUMN `horarioInicioPedidosCeia` VARCHAR(191) NOT NULL DEFAULT '19:00',
    ADD COLUMN `horarioInicioPedidosJantar` VARCHAR(191) NOT NULL DEFAULT '16:00';
