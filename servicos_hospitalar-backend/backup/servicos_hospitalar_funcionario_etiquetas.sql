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
-- Table structure for table `funcionario_etiquetas`
--

DROP TABLE IF EXISTS `funcionario_etiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionario_etiquetas` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `funcionarioId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipoEtiquetaId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataInicio` datetime(3) NOT NULL,
  `dataFim` datetime(3) DEFAULT NULL,
  `arquivoPdf` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `funcionario_etiquetas_funcionarioId_fkey` (`funcionarioId`),
  KEY `funcionario_etiquetas_tipoEtiquetaId_fkey` (`tipoEtiquetaId`),
  CONSTRAINT `funcionario_etiquetas_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `funcionario_etiquetas_tipoEtiquetaId_fkey` FOREIGN KEY (`tipoEtiquetaId`) REFERENCES `tipos_etiquetas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionario_etiquetas`
--

LOCK TABLES `funcionario_etiquetas` WRITE;
/*!40000 ALTER TABLE `funcionario_etiquetas` DISABLE KEYS */;
INSERT INTO `funcionario_etiquetas` VALUES ('cmc6mf1f20001us8g1qy56ke8','cmc6cyp690000us5cwx1cnekj','cmc6c8ll30000usf4kfpnnmdo','2025-06-12 00:00:00.000','2025-06-13 00:00:00.000','ANATOMIA COM IMAGEM.pdf','',0,'2025-06-21 19:17:28.430','2025-06-21 19:23:04.864'),('cmc6mnh1v0001usvk7g3ur2yj','cmc6cyp690000us5cwx1cnekj','cmc6c8ll30000usf4kfpnnmdo','2025-06-12 00:00:00.000','2025-06-13 00:00:00.000',NULL,'',0,'2025-06-21 19:24:01.938','2025-06-21 19:39:59.140'),('cmc6n89210001uslc04038b9c','cmc6cyp690000us5cwx1cnekj','cmc6c8ll30000usf4kfpnnmdo','2025-06-20 00:00:00.000','2025-06-20 00:00:00.000','aa17c839-bbba-441e-b16b-7f4095981742.pdf','',1,'2025-06-21 19:40:11.353','2025-06-21 19:40:22.973');
/*!40000 ALTER TABLE `funcionario_etiquetas` ENABLE KEYS */;
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
