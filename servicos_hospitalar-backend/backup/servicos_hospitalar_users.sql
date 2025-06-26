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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `funcionarioId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ultimoAcesso` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_funcionarioId_key` (`funcionarioId`),
  UNIQUE KEY `users_email_key` (`email`),
  CONSTRAINT `users_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('cmc3ha37y000mus9gzcmhfgmd','$2b$10$0OlxMkANdBBeaGMZWKCCnu7TeExbSjDiR2lr80xegfD.j5QMJIK06','cmc3ha356000fus9gm2pquw29',1,'2025-06-19 14:30:20.879','2025-06-19 14:30:20.879','user_cmc3ha37y000mus9gzcmhfgmd@example.com',NULL),('cmc3ha388000ous9gjcnqx2hy','$2b$10$0OlxMkANdBBeaGMZWKCCnu7TeExbSjDiR2lr80xegfD.j5QMJIK06','cmc3ha35o000ius9g1z1f6c0l',1,'2025-06-19 14:30:20.889','2025-06-19 14:30:20.889','user_cmc3ha388000ous9gjcnqx2hy@example.com',NULL),('cmc3i7ev60005uszg2kdctm1p','$2b$10$oK9xLCQOdgEgZ1X5Woh23epuINhtB.ZN3k3IhlwP7UnUhhlU5b1cy','cmc3i7erf0000uszgi8rwtl9e',1,'2025-06-19 14:56:15.618','2025-06-19 14:56:15.618','user_cmc3i7ev60005uszg2kdctm1p@example.com',NULL),('cmc3iynp90003usc80iolenhb','$2b$10$20zvuCaIyB9Ky51Y4PfZ2uRZJOwm9BnZKD.Pv.lkOVZHKuy2Bud1.','cmc3iynmy0000usc8rtxh2bpz',1,'2025-06-19 15:17:26.782','2025-06-19 15:17:26.782','user_cmc3iynp90003usc80iolenhb@example.com',NULL),('cmc6cyp8h0003us5c2bq9pbl6','$2b$10$x8uT8cU4y2NrDfm0Jrv4xeX2FUMB5Cs/9b.zgyMKbUcblFNlQXLUe','cmc6cyp690000us5cwx1cnekj',1,'2025-06-21 14:52:49.601','2025-06-21 14:52:49.601','user_cmc6cyp8h0003us5c2bq9pbl6@example.com',NULL),('cmc6p5bzz0003ustg1gsxa4ev','$2b$10$6Y5vkmxm4zIAO5gWP71MwukaXRdIYvjVh0wOd4rFKr3CapRXoU1KG','cmc6p5bxw0000ustg0s825o95',1,'2025-06-21 20:33:54.431','2025-06-21 20:33:54.431','user_cmc6p5bzz0003ustg1gsxa4ev@example.com',NULL),('cmc6p7oms0009ustgwb0kjn6f','$2b$10$Vax4n.gEHibnuP3o7fcQ5eQSjTL7v3hsVz9vOFvKgRsPUL2XQMZuu','cmc6p7okq0006ustg43sd5fyo',1,'2025-06-21 20:35:44.116','2025-06-21 20:35:44.116','user_cmc6p7oms0009ustgwb0kjn6f@example.com',NULL),('cmc6pj0760003usvgheydc0j1','$2b$10$dkA5uobCw64URN9VMYY5mOV472q99ASoVdD0etzuxkU/e9F7hv/5e','cmc6pj0520000usvggnbfxji6',1,'2025-06-21 20:44:32.322','2025-06-21 20:44:32.322','user_cmc6pj0760003usvgheydc0j1@example.com',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
