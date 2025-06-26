-- CreateTable
CREATE TABLE `funcionario_etiquetas` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioId` VARCHAR(191) NOT NULL,
    `tipoEtiquetaId` VARCHAR(191) NOT NULL,
    `dataInicio` DATETIME(3) NOT NULL,
    `dataFim` DATETIME(3) NULL,
    `arquivoPdf` VARCHAR(191) NULL,
    `observacoes` TEXT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `funcionario_etiquetas` ADD CONSTRAINT `funcionario_etiquetas_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `funcionario_etiquetas` ADD CONSTRAINT `funcionario_etiquetas_tipoEtiquetaId_fkey` FOREIGN KEY (`tipoEtiquetaId`) REFERENCES `tipos_etiquetas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
