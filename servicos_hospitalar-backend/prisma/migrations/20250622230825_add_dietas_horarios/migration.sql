-- AlterTable
ALTER TABLE `configuracoes_refeitorio` ADD COLUMN `horarioFimDietas` VARCHAR(191) NOT NULL DEFAULT '20:00',
    ADD COLUMN `horarioInicioDietas` VARCHAR(191) NOT NULL DEFAULT '06:00';
