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
-- Table structure for table `configuracoes_refeitorio`
--

DROP TABLE IF EXISTS `configuracoes_refeitorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracoes_refeitorio` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valorCafe` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `valorAlmoco` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `valorJantar` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `valorCeia` decimal(65,30) NOT NULL DEFAULT '0.000000000000000000000000000000',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `horarioFimDietas` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '20:00',
  `horarioInicioDietas` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '06:00',
  `horarioFimAlmoco` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '14:00',
  `horarioFimCafe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '10:00',
  `horarioFimCeia` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '22:00',
  `horarioFimJantar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '20:00',
  `horarioFimPedidosAlmoco` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '13:00',
  `horarioFimPedidosCafe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '09:00',
  `horarioFimPedidosCeia` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '21:00',
  `horarioFimPedidosJantar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '19:00',
  `horarioInicioAlmoco` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '11:00',
  `horarioInicioCafe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '06:00',
  `horarioInicioCeia` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '20:00',
  `horarioInicioJantar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '17:00',
  `horarioInicioPedidosAlmoco` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '10:00',
  `horarioInicioPedidosCafe` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '06:00',
  `horarioInicioPedidosCeia` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '19:00',
  `horarioInicioPedidosJantar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '16:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracoes_refeitorio`
--

LOCK TABLES `configuracoes_refeitorio` WRITE;
/*!40000 ALTER TABLE `configuracoes_refeitorio` DISABLE KEYS */;
INSERT INTO `configuracoes_refeitorio` VALUES ('',11.240000000000000000000000000000,24.490000000000000000000000000000,22.260000000000000000000000000000,14.770000000000000000000000000000,1,'2025-06-23 00:22:15.399','2025-06-26 13:44:11.125','09:00','07:00','14:15','07:15','00:00','20:45','09:00','21:00','19:59','14:00','11:00','05:30','23:00','19:30','06:00','20:00','18:00','10:00');
/*!40000 ALTER TABLE `configuracoes_refeitorio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-26 17:45:26
