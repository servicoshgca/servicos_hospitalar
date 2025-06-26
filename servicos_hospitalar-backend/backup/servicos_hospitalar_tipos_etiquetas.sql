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
-- Table structure for table `tipos_etiquetas`
--

DROP TABLE IF EXISTS `tipos_etiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_etiquetas` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cor` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tipos_etiquetas_nome_key` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_etiquetas`
--

LOCK TABLES `tipos_etiquetas` WRITE;
/*!40000 ALTER TABLE `tipos_etiquetas` DISABLE KEYS */;
INSERT INTO `tipos_etiquetas` VALUES ('cmc6c8ll30000usf4kfpnnmdo','Atestado Médico','medical','Atestado médico para afastamento do trabalho','#EF4444',1,'2025-06-21 14:32:31.815','2025-06-21 14:32:31.815'),('cmc6c8llm0001usf4h7hwi0aq','Licença Maternidade','heart','Licença para gestantes e mães','#EC4899',1,'2025-06-21 14:32:31.834','2025-06-21 14:32:31.834'),('cmc6c8llt0002usf450vohidw','Licença Paternidade','heart','Licença para pais','#3B82F6',1,'2025-06-21 14:32:31.842','2025-06-21 14:32:31.842'),('cmc6c8lly0003usf4d7cev2zu','Licença por Doença','pill','Licença por motivo de doença','#F59E0B',1,'2025-06-21 14:32:31.846','2025-06-21 14:32:31.846'),('cmc6c8lm70004usf4bmzzwzh9','Licença por Acidente','ambulance','Licença por acidente de trabalho','#DC2626',1,'2025-06-21 14:32:31.855','2025-06-21 14:32:31.855'),('cmc6c8lmi0005usf4tnnq0v65','Licença para Tratamento','stethoscope','Licença para tratamento de saúde','#8B5CF6',1,'2025-06-21 14:32:31.866','2025-06-21 14:32:31.866'),('cmc6c8lms0006usf4a43e5dyf','Licença Capacitação','document','Licença para capacitação profissional','#10B981',1,'2025-06-21 14:32:31.876','2025-06-21 14:32:31.876'),('cmc6c8lmy0007usf4g3mdq0zx','Licença Sem Vencimentos','calendar','Licença sem remuneração','#6B7280',1,'2025-06-21 14:32:31.882','2025-06-21 14:32:31.882');
/*!40000 ALTER TABLE `tipos_etiquetas` ENABLE KEYS */;
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
