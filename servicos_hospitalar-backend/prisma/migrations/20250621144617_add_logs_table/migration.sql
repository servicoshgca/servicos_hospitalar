-- CreateTable
CREATE TABLE `logs` (
    `id` VARCHAR(191) NOT NULL,
    `acao` VARCHAR(191) NOT NULL,
    `entidade` VARCHAR(191) NOT NULL,
    `entidadeId` VARCHAR(191) NOT NULL,
    `sistema` VARCHAR(191) NOT NULL,
    `dadosAnteriores` TEXT NULL,
    `dadosNovos` TEXT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
