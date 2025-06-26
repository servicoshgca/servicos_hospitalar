-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: servicos_hospitalar
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `pedidos_refeicao`
--

DROP TABLE IF EXISTS `pedidos_refeicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos_refeicao` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `funcionarioId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cardapioId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipoRefeicao` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataRefeicao` datetime(3) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDENTE',
  `observacoes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `opcoes` text COLLATE utf8mb4_unicode_ci,
  `setorPedidoId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedidos_refeicao_funcionarioId_fkey` (`funcionarioId`),
  KEY `pedidos_refeicao_cardapioId_fkey` (`cardapioId`),
  KEY `pedidos_refeicao_setorPedidoId_fkey` (`setorPedidoId`),
  CONSTRAINT `pedidos_refeicao_cardapioId_fkey` FOREIGN KEY (`cardapioId`) REFERENCES `cardapios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pedidos_refeicao_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pedidos_refeicao_setorPedidoId_fkey` FOREIGN KEY (`setorPedidoId`) REFERENCES `setores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos_refeicao`
--

LOCK TABLES `pedidos_refeicao` WRITE;
/*!40000 ALTER TABLE `pedidos_refeicao` DISABLE KEYS */;
INSERT INTO `pedidos_refeicao` VALUES ('cmcdgyxl00001usno7yzt53vg','cmc6cyp690000us5cwx1cnekj','cmcdgk8fp0000usg456xithss','JANTAR','2025-06-26 14:19:22.060','PENDENTE','',1,'2025-06-26 14:19:22.116','2025-06-26 14:19:22.116','{\"almoco\":false,\"almocoDieta\":false,\"almocoDietaTropical\":false,\"salada\":true,\"guarnicao\":true,\"acompanhamento1\":true,\"acompanhamento2\":true,\"pratoPrincipal\":false,\"opcao\":true,\"sobremesa\":true,\"suco\":true,\"jantar\":true,\"jantarTropical\":false}',NULL);
/*!40000 ALTER TABLE `pedidos_refeicao` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-26 17:45:25
