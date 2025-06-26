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
-- Table structure for table `pedidos_nao_entregues`
--

DROP TABLE IF EXISTS `pedidos_nao_entregues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos_nao_entregues` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `funcionarioId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pedidoRefeicaoId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipoRefeicao` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataRefeicao` datetime(3) NOT NULL,
  `dataNaoEntrega` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `observacoes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pedidos_nao_entregues_funcionarioId_fkey` (`funcionarioId`),
  KEY `pedidos_nao_entregues_pedidoRefeicaoId_fkey` (`pedidoRefeicaoId`),
  CONSTRAINT `pedidos_nao_entregues_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pedidos_nao_entregues_pedidoRefeicaoId_fkey` FOREIGN KEY (`pedidoRefeicaoId`) REFERENCES `pedidos_refeicao` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedidos_nao_entregues`
--

LOCK TABLES `pedidos_nao_entregues` WRITE;
/*!40000 ALTER TABLE `pedidos_nao_entregues` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos_nao_entregues` ENABLE KEYS */;
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
