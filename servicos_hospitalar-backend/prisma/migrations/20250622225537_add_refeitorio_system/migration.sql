-- CreateTable
CREATE TABLE `configuracoes_refeitorio` (
    `id` VARCHAR(191) NOT NULL,
    `valorCafe` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `valorAlmoco` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `valorJantar` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `valorCeia` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `horarioInicioRefeitorio` VARCHAR(191) NOT NULL DEFAULT '06:00',
    `horarioFechamentoRefeitorio` VARCHAR(191) NOT NULL DEFAULT '22:00',
    `horarioInicioPedidos` VARCHAR(191) NOT NULL DEFAULT '06:00',
    `horarioFimPedidos` VARCHAR(191) NOT NULL DEFAULT '21:00',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cardapios` (
    `id` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `imagem` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cardapios_data_key`(`data`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidos_refeicao` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioId` VARCHAR(191) NOT NULL,
    `cardapioId` VARCHAR(191) NOT NULL,
    `tipoRefeicao` VARCHAR(191) NOT NULL,
    `dataRefeicao` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDENTE',
    `observacoes` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pedidos_refeicao` ADD CONSTRAINT `pedidos_refeicao_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedidos_refeicao` ADD CONSTRAINT `pedidos_refeicao_cardapioId_fkey` FOREIGN KEY (`cardapioId`) REFERENCES `cardapios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
