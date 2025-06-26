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
-- Table structure for table `informacoes_funcionais`
--

DROP TABLE IF EXISTS `informacoes_funcionais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `informacoes_funcionais` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `funcionarioId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matricula` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setorId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cargo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vinculoId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `situacao` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ATIVO',
  `dataAdmissao` datetime(3) NOT NULL,
  `dataDemissao` datetime(3) DEFAULT NULL,
  `cargaHoraria` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salario` decimal(65,30) NOT NULL,
  `refeicao` tinyint(1) NOT NULL DEFAULT '1',
  `numeroPastaFisica` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rhBahia` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `informacoes_funcionais_matricula_key` (`matricula`),
  KEY `informacoes_funcionais_funcionarioId_fkey` (`funcionarioId`),
  KEY `informacoes_funcionais_setorId_fkey` (`setorId`),
  KEY `informacoes_funcionais_vinculoId_fkey` (`vinculoId`),
  CONSTRAINT `informacoes_funcionais_funcionarioId_fkey` FOREIGN KEY (`funcionarioId`) REFERENCES `funcionarios` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `informacoes_funcionais_setorId_fkey` FOREIGN KEY (`setorId`) REFERENCES `setores` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `informacoes_funcionais_vinculoId_fkey` FOREIGN KEY (`vinculoId`) REFERENCES `vinculos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `informacoes_funcionais`
--

LOCK TABLES `informacoes_funcionais` WRITE;
/*!40000 ALTER TABLE `informacoes_funcionais` DISABLE KEYS */;
INSERT INTO `informacoes_funcionais` VALUES ('cmc3ha356000hus9gl82yje33','cmc3ha356000fus9gm2pquw29','ADMIN001','cmc3ha33l0004us9gfi4k6dha','Administrador','cmc3ha34t000eus9gbbtdg4p3','ATIVO','2025-06-19 14:30:20.773',NULL,'40h',5000.000000000000000000000000000000,1,NULL,NULL,1,'2025-06-19 14:30:20.778','2025-06-19 14:30:20.778'),('cmc3ha35o000kus9gavj27j2o','cmc3ha35o000ius9g1z1f6c0l','GP001','cmc3ha33k0003us9gs4jycppn','Gestor de RH','cmc3ha34t000eus9gbbtdg4p3','ATIVO','2025-06-19 14:30:20.794',NULL,'40h',4000.000000000000000000000000000000,1,NULL,NULL,1,'2025-06-19 14:30:20.796','2025-06-19 14:30:20.796'),('cmc3i7erf0002uszgcj6m2fin','cmc3i7erf0000uszgi8rwtl9e','55555','cmc3ha33l0004us9gfi4k6dha','ATENDENNTE','cmc3ha34t000dus9goo0yiget','ATIVO','2023-06-16 00:00:00.000',NULL,'180H',150000.000000000000000000000000000000,1,'','',1,'2025-06-19 14:56:15.483','2025-06-19 14:56:15.483'),('cmc3i7erf0003uszgx2mcbrs8','cmc3i7erf0000uszgi8rwtl9e','6666','cmc3ha33l0004us9gfi4k6dha','ATENDENNTE','cmc3ha34t000eus9gbbtdg4p3','ATIVO','2024-07-19 00:00:00.000',NULL,'180H',151800.000000000000000000000000000000,1,'','',1,'2025-06-19 14:56:15.483','2025-06-19 14:56:15.483'),('cmc3iynn30001usc8chy0j92y','cmc3iynmy0000usc8rtxh2bpz','1456465','cmc3ibrfk0006uszg8y7kpx8t','','cmc3ha34t000eus9gbbtdg4p3','ATIVO','1970-01-01 00:00:00.000',NULL,'240H',0.000000000000000000000000000000,1,'','',1,'2025-06-19 15:17:26.703','2025-06-19 15:17:26.703'),('cmc6cyp6f0001us5c39j4m50t','cmc6cyp690000us5cwx1cnekj','200061','cmc6bdocu0000usucao5qfl9v','AUXILIAR TÉCNICO EM INFORMÁTICA','cmc6bj6n30001usucqptbv7y3','ATIVO','2024-10-22 00:00:00.000',NULL,'240H',151800.000000000000000000000000000000,1,'','',1,'2025-06-21 14:52:49.527','2025-06-21 20:03:03.242'),('cmc6p5by10001ustgkr8uk93n','cmc6p5bxw0000ustg0s825o95','000001','cmc3ha33k0003us9gs4jycppn','','cmc6bmi6n0007usucc446qr68','ATIVO','1970-01-01 00:00:00.000',NULL,'240H',0.000000000000000000000000000000,1,'','',1,'2025-06-21 20:33:54.361','2025-06-21 20:33:54.361'),('cmc6p7oku0007ustg4dogamdc','cmc6p7okq0006ustg43sd5fyo','92110136','cmc6bdocu0000usucao5qfl9v','COORDENADOR','cmc6bjmhj0002usucuelmrucl','ATIVO','1970-01-01 00:00:00.000',NULL,'240H',0.000000000000000000000000000000,1,'','',1,'2025-06-21 20:35:44.047','2025-06-21 20:38:17.869'),('cmc6pj0570001usvgn7mo8ibk','cmc6pj0520000usvggnbfxji6','000002','cmc3ha33k0003us9gs4jycppn','COORDENADOR','cmc6bmi6n0007usucc446qr68','ATIVO','1970-01-01 00:00:00.000',NULL,'240H',0.000000000000000000000000000000,1,'','',1,'2025-06-21 20:44:32.251','2025-06-21 20:44:32.251');
/*!40000 ALTER TABLE `informacoes_funcionais` ENABLE KEYS */;
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
