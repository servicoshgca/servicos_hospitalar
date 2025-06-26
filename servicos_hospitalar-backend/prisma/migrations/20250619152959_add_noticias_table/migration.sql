-- CreateTable
CREATE TABLE `noticias` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `subtitulo` VARCHAR(191) NULL,
    `conteudo` TEXT NOT NULL,
    `imagem` VARCHAR(191) NULL,
    `autorId` VARCHAR(191) NOT NULL,
    `publicada` BOOLEAN NOT NULL DEFAULT false,
    `dataPublicacao` DATETIME(3) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `noticias` ADD CONSTRAINT `noticias_autorId_fkey` FOREIGN KEY (`autorId`) REFERENCES `funcionarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
