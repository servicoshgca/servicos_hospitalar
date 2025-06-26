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
-- Table structure for table `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionarios` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cpf` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `bairro` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cartaoSus` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cbo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cep` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cidade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complemento` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conselhoProfissional` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctps` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataConclusao` datetime(3) DEFAULT NULL,
  `dataEmissaoTitulo` datetime(3) DEFAULT NULL,
  `dataExpedicaoConselho` datetime(3) DEFAULT NULL,
  `dataExpedicaoRg` datetime(3) DEFAULT NULL,
  `dataIngresso` datetime(3) DEFAULT NULL,
  `dataNascimento` datetime(3) DEFAULT NULL,
  `dispensado` tinyint(1) DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estadoCivil` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `faculdade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fatorRh` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formacaoProfissional` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `genero` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grauEscolaridade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ministerio` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nacionalidade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `naturalidade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomeMae` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomePai` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomeSocial` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numeroConselho` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numeroEstacionamento` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numeroReservista` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observacoes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orgaoExpedidorRg` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pisPasep` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `placaVeiculo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rg` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `secaoEleitoral` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serieCtps` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefoneCelular` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefoneResidencial` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipoSanguineo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipoVeiculo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tituloEleitor` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zonaEleitoral` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataAdmissao` datetime(3) DEFAULT NULL,
  `dataDesligamento` datetime(3) DEFAULT NULL,
  `escolaridade` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `funcionarios_cpf_key` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionarios`
--

LOCK TABLES `funcionarios` WRITE;
/*!40000 ALTER TABLE `funcionarios` DISABLE KEYS */;
INSERT INTO `funcionarios` VALUES ('cmc3ha356000fus9gm2pquw29','Administrador do Sistema','00000000000',1,'2025-06-19 14:30:20.778','2025-06-19 14:30:20.778',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('cmc3ha35o000ius9g1z1f6c0l','Gestor de Pessoas','11111111111',1,'2025-06-19 14:30:20.796','2025-06-19 14:30:20.796',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('cmc3i7erf0000uszgi8rwtl9e','TESTE FUNCIONARIO','88888888888',1,'2025-06-19 14:56:15.483','2025-06-21 15:34:59.390','CENTRO','','','44245000','FEIRA DE SANTANA','CASA','','','2025-06-13 00:00:00.000',NULL,NULL,'2025-05-02 00:00:00.000','2023-03-08 00:00:00.000','1998-12-19 00:00:00.000',0,'TESTE@HOSPITAL.COM','','SOLTEIRO','IFRN','POSITIVO','','980fa378-2124-400e-9592-3dbd00300e24.jpg','FEMININO','SUPERIOR_COMPLETO','','BRASILEIRA','','','','','','555','','','SSP','','654548','222222222222',NULL,'','','','B','CARRO','',NULL,NULL,NULL,NULL),('cmc3iynmy0000usc8rtxh2bpz','FUNCI ASCOM','33333333333',1,'2025-06-19 15:17:26.698','2025-06-21 15:36:25.832','','','','','','','','',NULL,NULL,NULL,NULL,NULL,NULL,0,'','','CASADO','','NEGATIVO','','884fa1e3-933d-4390-80c0-f499d6bbd39a.jpg','FEMININO','','','BRASILEIRA','','','','','','','','',NULL,'','','',NULL,'','','','B','','',NULL,NULL,NULL,NULL),('cmc6cyp690000us5cwx1cnekj','CRISLAYNE SOARES RAMOS','86616845524',1,'2025-06-21 14:52:49.521','2025-06-21 20:03:03.242','PARQUE LAGOA DO SUBAÉ','706 8062 4914 2025','','44079-232','FEIRA DE SANTANA','CASA','','9836151',NULL,NULL,NULL,NULL,'2025-02-16 00:00:00.000','1998-10-26 00:00:00.000',0,'CRISSOARES346@GMAIL.COM','RUA SÃO JOSÉ - 41','SOLTEIRO','UNIASSELVI','POSITIVO','TÉCNICO EM INFORMÁTICA','62ee1c73-e882-41bb-9365-1c8c75ac8c28.jpeg','FEMININO','SUPERIOR_INCOMPLETO','','BRASILEIRA','SERGIPANA','JOSEFA SOARES DO CARMO','MARCONDES SANTOS RAMOS','CRISLAYNE','','','','','SSP','228.07860.95-7','','2254020331','0293','','75 98238-9323','','O','','','',NULL,NULL,NULL),('cmc6p5bxw0000ustg0s825o95','ANILAILTON CARDOSO DA SILVA','54979617549',1,'2025-06-21 20:33:54.356','2025-06-21 20:33:54.356',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'MASCULINO',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('cmc6p7okq0006ustg43sd5fyo','FRANCISCO FORTUNATO MAGALHÃES MORAES SEGUNDO','03678708510',1,'2025-06-21 20:35:44.042','2025-06-21 20:38:17.869','CENTRO','','','','CONCEIÇÃO DO JACUÍPE','','','',NULL,NULL,NULL,NULL,NULL,NULL,0,'francisco.fortunato@saude.ba.gov.br','OTAVIO MANGABEIRA.06','SOLTEIRO','IFRN','','','http://localhost:3001/uploads/d3d434ec-48bb-4685-8d0f-9e6d29c28286.jpg','MASCULINO','SUPERIOR_COMPLETO','','','','TÂNEA REGINA DA SILVA','FRANCISCO FORTUNATO MAGALHÃES MORAES SEGUNDO','','','','','','','','','','','','','','','CARRO','','',NULL,NULL,NULL),('cmc6pj0520000usvggnbfxji6','PATRICIA OLIVEIRA DA SILVA SOUZA','95391479568',1,'2025-06-21 20:44:32.246','2025-06-21 20:44:32.246',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'FEMININO',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `funcionarios` ENABLE KEYS */;
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
