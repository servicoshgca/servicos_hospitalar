/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `funcionarios` ADD COLUMN `dataAdmissao` DATETIME(3) NULL,
    ADD COLUMN `dataDesligamento` DATETIME(3) NULL,
    ADD COLUMN `escolaridade` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `ultimoAcesso` DATETIME(3) NULL;

-- Update existing users with default email
UPDATE `users` SET `email` = CONCAT('user_', id, '@example.com') WHERE `email` IS NULL;

-- Make email required after setting default values
ALTER TABLE `users` MODIFY COLUMN `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);
