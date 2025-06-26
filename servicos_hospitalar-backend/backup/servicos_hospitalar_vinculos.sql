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
-- Table structure for table `vinculos`
--

DROP TABLE IF EXISTS `vinculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vinculos` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagem` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vinculos_nome_key` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vinculos`
--

LOCK TABLES `vinculos` WRITE;
/*!40000 ALTER TABLE `vinculos` DISABLE KEYS */;
INSERT INTO `vinculos` VALUES ('cmc3ha34t000dus9goo0yiget','Terceirizado',NULL,0,'2025-06-19 14:30:20.765','2025-06-21 14:12:49.588'),('cmc3ha34t000eus9gbbtdg4p3','CLT',NULL,0,'2025-06-19 14:30:20.765','2025-06-21 14:12:51.754'),('cmc6bj6n30001usucqptbv7y3','FESF - PRIMEIRO EMPREGO','http://localhost:3001/uploads/40def872-071f-4afe-a483-2ff874e040a8.jpg',1,'2025-06-21 14:12:46.048','2025-06-21 14:12:46.048'),('cmc6bjmhj0002usucuelmrucl','SESAB','http://localhost:3001/uploads/b735f4e3-a965-44af-abe8-8c662f936809.png',1,'2025-06-21 14:13:06.583','2025-06-21 14:13:06.583'),('cmc6bjuiu0003usuceem2p96m','PJ','http://localhost:3001/uploads/20a0b58b-0a94-4a25-904c-13f8858d643a.png',1,'2025-06-21 14:13:16.999','2025-06-21 14:13:16.999'),('cmc6bk8gf0004usucwedhscxv','R8','http://localhost:3001/uploads/cd3366e7-c609-47ac-b662-62ae44a6cc57.png',1,'2025-06-21 14:13:35.055','2025-06-21 14:13:35.055'),('cmc6bklnz0005usuc4hf12a78','CRETA','http://localhost:3001/uploads/3da37278-10bb-4414-aeab-131e3ebd8245.jpg',1,'2025-06-21 14:13:52.176','2025-06-21 14:13:52.176'),('cmc6blqvj0006usucw5o95pj7','QUADRANTE','http://localhost:3001/uploads/c5606032-9776-4677-ab35-77ea20f1c56e.png',1,'2025-06-21 14:14:45.583','2025-06-21 14:14:45.583'),('cmc6bmi6n0007usucc446qr68','HGCA','http://localhost:3001/uploads/55ae131b-a3a7-445a-9010-87e6c2707d78.png',1,'2025-06-21 14:15:20.976','2025-06-21 14:15:20.976'),('cmc6bmvp30008usucfng94c4m','FESFSUS','http://localhost:3001/uploads/37c66a74-bd42-4e5e-a988-82c12bb3ffe0.jpg',1,'2025-06-21 14:15:38.487','2025-06-21 14:15:38.487');
/*!40000 ALTER TABLE `vinculos` ENABLE KEYS */;
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
