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
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_permissions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sistemaId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `perfilId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_permissions_userId_sistemaId_key` (`userId`,`sistemaId`),
  KEY `user_permissions_sistemaId_fkey` (`sistemaId`),
  KEY `user_permissions_perfilId_fkey` (`perfilId`),
  CONSTRAINT `user_permissions_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `perfis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_permissions_sistemaId_fkey` FOREIGN KEY (`sistemaId`) REFERENCES `sistemas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_permissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
INSERT INTO `user_permissions` VALUES ('cmc3ha38g000tus9gx93cvyvr','cmc3ha37y000mus9gzcmhfgmd','cmc3ha3420007us9glecclnfl','cmc3ha34f000cus9g9bdtcxmz',1,'2025-06-19 14:30:20.896','2025-06-19 14:30:20.896'),('cmc3ha38g000vus9gxkrd4wew','cmc3ha37y000mus9gzcmhfgmd','cmc3ha3420005us9gggrzylv8','cmc3ha34f000cus9g9bdtcxmz',1,'2025-06-19 14:30:20.896','2025-06-19 14:30:20.896'),('cmc3ha38g000wus9gan9y4yw1','cmc3ha37y000mus9gzcmhfgmd','cmc3ha3420006us9g21kp9mr6','cmc3ha34f000cus9g9bdtcxmz',1,'2025-06-19 14:30:20.896','2025-06-19 14:30:20.896'),('cmc3ha38g000xus9g8u6oy2rr','cmc3ha37y000mus9gzcmhfgmd','cmc3jfln00000usn08po4j1ut','cmc3ha34f000cus9g9bdtcxmz',1,'2025-06-19 14:30:20.896','2025-06-19 16:53:10.889'),('cmc3ha38g000yus9g97wpn30l','cmc3ha37y000mus9gzcmhfgmd','cmc3ha3420008us9giygpngfg','cmc3ha34f000cus9g9bdtcxmz',1,'2025-06-19 14:30:20.896','2025-06-19 14:30:20.896'),('cmc3ha38p0011us9g1s165qra','cmc3ha388000ous9gjcnqx2hy','cmc3ha3420006us9g21kp9mr6','cmc3ha34f000cus9g9bdtcxmz',1,'2025-06-19 14:30:20.905','2025-06-19 14:30:20.905'),('cmc3ha38p0012us9gpv1qwk00','cmc3ha388000ous9gjcnqx2hy','cmc3ha3420008us9giygpngfg','cmc3ha34f000bus9gna85zy1m',1,'2025-06-19 14:30:20.905','2025-06-19 14:30:20.905'),('cmc3k23230001usq0oozmd2t4','cmc3iynp90003usc80iolenhb','cmc3jfln00000usn08po4j1ut','cmc3jflnw0001usn0macbssyd',1,'2025-06-19 15:48:06.266','2025-06-19 16:23:06.246'),('cmc6pyguw0001uslo9k65hr8k','cmc6pj0760003usvgheydc0j1','cmc3ha3420006us9g21kp9mr6','cmc3ha34f000aus9g2s4kt4s5',1,'2025-06-21 20:56:33.752','2025-06-21 20:56:33.752'),('cmc6pz87q0003uslopxgf2upq','cmc6p7oms0009ustgwb0kjn6f','cmc3ha3420006us9g21kp9mr6','cmc3ha34f000cus9g9bdtcxmz',1,'2025-06-21 20:57:09.206','2025-06-21 20:57:09.206'),('cmc8bd4720001usyo5bz58wql','cmc3i7ev60005uszg2kdctm1p','cmc3ha3420008us9giygpngfg','cmc3ha34f000bus9gna85zy1m',1,'2025-06-22 23:43:35.294','2025-06-22 23:43:35.294'),('cmc8bd47k0003usyop0rah5cu','cmc3iynp90003usc80iolenhb','cmc3ha3420008us9giygpngfg','cmc3ha34f000bus9gna85zy1m',1,'2025-06-22 23:43:35.312','2025-06-22 23:43:35.312'),('cmc8bd47u0005usyoxl221cwp','cmc6cyp8h0003us5c2bq9pbl6','cmc3ha3420008us9giygpngfg','cmc3ha34f000bus9gna85zy1m',1,'2025-06-22 23:43:35.322','2025-06-26 13:33:17.307'),('cmc8bd4820007usyoohs5qizr','cmc6p5bzz0003ustg1gsxa4ev','cmc3ha3420008us9giygpngfg','cmc3ha34f000bus9gna85zy1m',1,'2025-06-22 23:43:35.330','2025-06-22 23:43:35.330'),('cmc8bd48b0009usyo6s02bw0u','cmc6p7oms0009ustgwb0kjn6f','cmc3ha3420008us9giygpngfg','cmc3ha34f000bus9gna85zy1m',1,'2025-06-22 23:43:35.340','2025-06-22 23:43:35.340'),('cmc8bd48k000busyonzrm1qzs','cmc6pj0760003usvgheydc0j1','cmc3ha3420008us9giygpngfg','cmc3ha34f000bus9gna85zy1m',1,'2025-06-22 23:43:35.348','2025-06-22 23:43:35.348');
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
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
