-- AlterTable
ALTER TABLE `pedidos_refeicao` ADD COLUMN `setorPedidoId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `pedidos_refeicao` ADD CONSTRAINT `pedidos_refeicao_setorPedidoId_fkey` FOREIGN KEY (`setorPedidoId`) REFERENCES `setores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
