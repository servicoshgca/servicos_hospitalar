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
-- Table structure for table `setores`
--

DROP TABLE IF EXISTS `setores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `setores` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `coordenador` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagem` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setores_nome_key` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setores`
--

LOCK TABLES `setores` WRITE;
/*!40000 ALTER TABLE `setores` DISABLE KEYS */;
INSERT INTO `setores` VALUES ('cmc3ha33f0000us9gj64c0kfd','SENUT','Setor responsável pelo refeitório e alimentação',1,'2025-06-19 14:30:20.715','2025-06-21 14:10:44.690','','','',''),('cmc3ha33i0001us9g675b5168','ALMOXARIFADO','Setor responsável pelo controle de estoque',1,'2025-06-19 14:30:20.715','2025-06-21 14:10:10.297','','','',''),('cmc3ha33j0002us9gaemdho9v','Comunicação','Setor responsável pela comunicação institucional',0,'2025-06-19 14:30:20.715','2025-06-21 14:09:49.371',NULL,NULL,NULL,NULL),('cmc3ha33k0003us9gs4jycppn','GESTÃO DE PESSOAS','Setor responsável pela gestão de recursos humanos',1,'2025-06-19 14:30:20.715','2025-06-21 14:11:21.289','Patricia','','',''),('cmc3ha33l0004us9gfi4k6dha','Administrativo','Setor administrativo geral',1,'2025-06-19 14:30:20.715','2025-06-19 14:30:20.715',NULL,NULL,NULL,NULL),('cmc3ibrfk0006uszg8y7kpx8t','ASCOM','Setor responsável pela comunicação institucional',1,'2025-06-19 14:59:38.528','2025-06-21 14:10:20.305','','ascom@hospital.com','',''),('cmc6bdocu0000usucao5qfl9v','NTIC','Núcleo de Tecnologia da Informação e Comunicação',1,'2025-06-21 14:08:29.071','2025-06-21 14:08:29.071','Francisco','ti@hospital.com','','75 3333-3333'),('cmc6bofso0009usuc4sev5zh2','COMISSÃO DE ÓBITO','',1,'2025-06-21 14:16:51.192','2025-06-21 14:16:51.192','','','',''),('cmc8alp640000usn8x8dvfbu8','DIRETORIA MÉDICA','',1,'2025-06-22 23:22:16.108','2025-06-22 23:22:16.108','','','',''),('cmc8am1um0001usn88ah3upvt','DIRETORIA ADMINISTRATIVA','',1,'2025-06-22 23:22:32.542','2025-06-22 23:22:32.542','','','',''),('cmc8amce60002usn8xt8r50zu','DIRETORIA GERAL','',1,'2025-06-22 23:22:46.206','2025-06-22 23:22:46.206','','','',''),('cmc8amsrx0003usn8lric91op','UCI','UNIDADE DE CUIDADOS INTENSIVOS',1,'2025-06-22 23:23:07.438','2025-06-22 23:23:07.438','','','',''),('cmc8an5r50004usn8hpbhccxg','SEMI INTENSIVA','',1,'2025-06-22 23:23:24.258','2025-06-22 23:23:24.258','','','',''),('cmc8anq1h0005usn82l65oqm0','UTI01','UNIDADE DE CUIDADOS INTENSIVO 01',1,'2025-06-22 23:23:50.549','2025-06-22 23:23:50.549','','','',''),('cmc8ao2rh0006usn8ntc8ndw4','UTI02','UNIDADE DE CUIDADOS INTENSIVO 02',1,'2025-06-22 23:24:07.038','2025-06-22 23:24:07.038','','','',''),('cmc8aofml0007usn8h1op37cg','UTI03','UNIDADE DE CUIDADOS INTENSIVO 03',1,'2025-06-22 23:24:23.710','2025-06-22 23:24:23.710','','','',''),('cmc8aonzg0008usn8vslxf91a','UTI04','UNIDADE DE CUIDADOS INTENSIVO 04',1,'2025-06-22 23:24:34.540','2025-06-22 23:24:34.540','','','',''),('cmc8ap20d0009usn82yntkeyo','UTI05','UNIDADE DE CUIDADOS INTENSIVO 05',1,'2025-06-22 23:24:52.718','2025-06-22 23:24:52.718','','','',''),('cmc8apa1o000ausn8rpbnzyn2','SALA DE ALTA','',1,'2025-06-22 23:25:03.133','2025-06-22 23:25:03.133','','','',''),('cmc8apifx000busn8adgxv9dc','ADMINISTRAÇÃO DA NEUROCIRURGIA','',1,'2025-06-22 23:25:14.014','2025-06-22 23:25:14.014','','','',''),('cmc8apvet000cusn8co39qpp6','UAVC','UNIDADE AVC',1,'2025-06-22 23:25:30.821','2025-06-22 23:25:30.821','','','',''),('cmc8aqd45000dusn8mugoy41v','CONFORTO MÉDICO','',1,'2025-06-22 23:25:53.765','2025-06-22 23:25:53.765','','','',''),('cmc8aqva5000eusn8vyvz1yrr','CENTRO CIRÚRGICO','',1,'2025-06-22 23:26:17.310','2025-06-22 23:26:17.310','','','',''),('cmc8ar3bx000fusn89bhg5cx5','REFEITÓRIO','',1,'2025-06-22 23:26:27.742','2025-06-22 23:26:27.742','','','',''),('cmc8ark59000gusn8holm8fqw','COPA','',1,'2025-06-22 23:26:49.534','2025-06-22 23:26:49.534','','','',''),('cmc8ary0l000husn8lsuguz5g','CHDI','CENTRO DE HEMORRAGIA DIGESTIVA DO INTERIOR',1,'2025-06-22 23:27:07.509','2025-06-22 23:27:07.509','','','',''),('cmc8as5gd000iusn8wq0gskw3','CME','',1,'2025-06-22 23:27:17.150','2025-06-22 23:27:17.150','','','',''),('cmc8at44s000jusn8o8oizjw8','DIRETORIA DE ENFERMAGEM','',1,'2025-06-22 23:28:02.093','2025-06-22 23:28:02.093','','','','');
/*!40000 ALTER TABLE `setores` ENABLE KEYS */;
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
