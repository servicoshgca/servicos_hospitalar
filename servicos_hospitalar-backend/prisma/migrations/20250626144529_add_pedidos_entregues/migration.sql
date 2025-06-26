-- CreateTable
CREATE TABLE `pedidos_entregues` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioId` VARCHAR(191) NOT NULL,
    `pedidoRefeicaoId` VARCHAR(191) NULL,
    `tipoRefeicao` VARCHAR(191) NOT NULL,
    `dataRefeicao` DATETIME(3) NOT NULL,
    `dataEntrega` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `observacoes` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pedidos_entregues` ADD CONSTRAINT `pedidos_entregues_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos_entregues` ADD CONSTRAINT `pedidos_entregues_pedidoRefeicaoId_fkey` FOREIGN KEY (`pedidoRefeicaoId`) REFERENCES `pedidos_refeicao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
