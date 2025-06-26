/*
  Warnings:

  - You are about to drop the column `matricula` on the `funcionarios` table. All the data in the column will be lost.
  - You are about to drop the column `setorId` on the `funcionarios` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `funcionarios` DROP FOREIGN KEY `funcionarios_setorId_fkey`;

-- DropIndex
DROP INDEX `funcionarios_matricula_key` ON `funcionarios`;

-- DropIndex
DROP INDEX `funcionarios_setorId_fkey` ON `funcionarios`;

-- AlterTable
ALTER TABLE `funcionarios` DROP COLUMN `matricula`,
    DROP COLUMN `setorId`,
    ADD COLUMN `bairro` VARCHAR(191) NULL,
    ADD COLUMN `cartaoSus` VARCHAR(191) NULL,
    ADD COLUMN `cbo` VARCHAR(191) NULL,
    ADD COLUMN `cep` VARCHAR(191) NULL,
    ADD COLUMN `cidade` VARCHAR(191) NULL,
    ADD COLUMN `complemento` VARCHAR(191) NULL,
    ADD COLUMN `conselhoProfissional` VARCHAR(191) NULL,
    ADD COLUMN `ctps` VARCHAR(191) NULL,
    ADD COLUMN `dataConclusao` DATETIME(3) NULL,
    ADD COLUMN `dataEmissaoTitulo` DATETIME(3) NULL,
    ADD COLUMN `dataExpedicaoConselho` DATETIME(3) NULL,
    ADD COLUMN `dataExpedicaoRg` DATETIME(3) NULL,
    ADD COLUMN `dataIngresso` DATETIME(3) NULL,
    ADD COLUMN `dataNascimento` DATETIME(3) NULL,
    ADD COLUMN `dispensado` BOOLEAN NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `endereco` VARCHAR(191) NULL,
    ADD COLUMN `estadoCivil` VARCHAR(191) NULL,
    ADD COLUMN `faculdade` VARCHAR(191) NULL,
    ADD COLUMN `fatorRh` VARCHAR(191) NULL,
    ADD COLUMN `formacaoProfissional` VARCHAR(191) NULL,
    ADD COLUMN `foto` VARCHAR(191) NULL,
    ADD COLUMN `genero` VARCHAR(191) NULL,
    ADD COLUMN `grauEscolaridade` VARCHAR(191) NULL,
    ADD COLUMN `ministerio` VARCHAR(191) NULL,
    ADD COLUMN `nacionalidade` VARCHAR(191) NULL,
    ADD COLUMN `naturalidade` VARCHAR(191) NULL,
    ADD COLUMN `nomeMae` VARCHAR(191) NULL,
    ADD COLUMN `nomePai` VARCHAR(191) NULL,
    ADD COLUMN `nomeSocial` VARCHAR(191) NULL,
    ADD COLUMN `numeroConselho` VARCHAR(191) NULL,
    ADD COLUMN `numeroEstacionamento` VARCHAR(191) NULL,
    ADD COLUMN `numeroReservista` VARCHAR(191) NULL,
    ADD COLUMN `observacoes` VARCHAR(191) NULL,
    ADD COLUMN `orgaoExpedidorRg` VARCHAR(191) NULL,
    ADD COLUMN `pisPasep` VARCHAR(191) NULL,
    ADD COLUMN `placaVeiculo` VARCHAR(191) NULL,
    ADD COLUMN `rg` VARCHAR(191) NULL,
    ADD COLUMN `secaoEleitoral` VARCHAR(191) NULL,
    ADD COLUMN `serieCtps` VARCHAR(191) NULL,
    ADD COLUMN `telefoneCelular` VARCHAR(191) NULL,
    ADD COLUMN `telefoneResidencial` VARCHAR(191) NULL,
    ADD COLUMN `tipoSanguineo` VARCHAR(191) NULL,
    ADD COLUMN `tipoVeiculo` VARCHAR(191) NULL,
    ADD COLUMN `tituloEleitor` VARCHAR(191) NULL,
    ADD COLUMN `zonaEleitoral` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `informacoes_funcionais` (
    `id` VARCHAR(191) NOT NULL,
    `funcionarioId` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `setorId` VARCHAR(191) NOT NULL,
    `cargo` VARCHAR(191) NOT NULL,
    `vinculoId` VARCHAR(191) NOT NULL,
    `situacao` VARCHAR(191) NOT NULL DEFAULT 'ATIVO',
    `dataAdmissao` DATETIME(3) NOT NULL,
    `dataDemissao` DATETIME(3) NULL,
    `cargaHoraria` VARCHAR(191) NOT NULL,
    `salario` DECIMAL(65, 30) NOT NULL,
    `refeicao` BOOLEAN NOT NULL DEFAULT true,
    `numeroPastaFisica` VARCHAR(191) NULL,
    `rhBahia` VARCHAR(191) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `informacoes_funcionais_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `informacoes_funcionais` ADD CONSTRAINT `informacoes_funcionais_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `informacoes_funcionais` ADD CONSTRAINT `informacoes_funcionais_setorId_fkey` FOREIGN KEY (`setorId`) REFERENCES `setores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `informacoes_funcionais` ADD CONSTRAINT `informacoes_funcionais_vinculoId_fkey` FOREIGN KEY (`vinculoId`) REFERENCES `vinculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
