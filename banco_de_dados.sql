-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_servicos
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alocacao_equipamentos`
--

DROP TABLE IF EXISTS `alocacao_equipamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alocacao_equipamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_equipamento` int NOT NULL,
  `id_servico` int NOT NULL,
  `data` date DEFAULT NULL,
  `hora` int DEFAULT NULL,
  `valor_hora_alocado` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_equipamento` (`id_equipamento`),
  KEY `id_servico` (`id_servico`),
  CONSTRAINT `alocacao_equipamentos_ibfk_1` FOREIGN KEY (`id_equipamento`) REFERENCES `equipamentos` (`id`),
  CONSTRAINT `alocacao_equipamentos_ibfk_2` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alocacao_equipamentos`
--

LOCK TABLES `alocacao_equipamentos` WRITE;
/*!40000 ALTER TABLE `alocacao_equipamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `alocacao_equipamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alocacao_funcionarios`
--

DROP TABLE IF EXISTS `alocacao_funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alocacao_funcionarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_funcionario` int NOT NULL,
  `id_servico` int NOT NULL,
  `data` date DEFAULT NULL,
  `hora` int DEFAULT NULL,
  `valor_dia_alocado` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_funcionario` (`id_funcionario`),
  KEY `id_servico` (`id_servico`),
  CONSTRAINT `alocacao_funcionarios_ibfk_1` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionarios` (`id`),
  CONSTRAINT `alocacao_funcionarios_ibfk_2` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alocacao_funcionarios`
--

LOCK TABLES `alocacao_funcionarios` WRITE;
/*!40000 ALTER TABLE `alocacao_funcionarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `alocacao_funcionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_cliente` enum('fisico','juridico') NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cpf_cnpj` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipamentos`
--

DROP TABLE IF EXISTS `equipamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `descricao` text,
  `status` enum('operacionarl','quebrado') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipamentos`
--

LOCK TABLES `equipamentos` WRITE;
/*!40000 ALTER TABLE `equipamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_servico` int NOT NULL,
  `id_funcionario` int NOT NULL,
  `comentario` text,
  `data` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_servico` (`id_servico`),
  KEY `id_funcionario` (`id_funcionario`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`id_servico`) REFERENCES `servicos` (`id`),
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cpf` varchar(15) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `cargo` varchar(255) DEFAULT NULL,
  `status` enum('ferias','operacional') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionarios`
--

LOCK TABLES `funcionarios` WRITE;
/*!40000 ALTER TABLE `funcionarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `funcionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametrizacao_equipamentos`
--

DROP TABLE IF EXISTS `parametrizacao_equipamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parametrizacao_equipamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_equipamento` int NOT NULL,
  `valor_hora` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk` (`id_equipamento`),
  CONSTRAINT `fk` FOREIGN KEY (`id_equipamento`) REFERENCES `equipamentos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametrizacao_equipamentos`
--

LOCK TABLES `parametrizacao_equipamentos` WRITE;
/*!40000 ALTER TABLE `parametrizacao_equipamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `parametrizacao_equipamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametrizacao_funcionarios`
--

DROP TABLE IF EXISTS `parametrizacao_funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parametrizacao_funcionarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_funcionario` int NOT NULL,
  `valor_diaria` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_funcionario` (`id_funcionario`),
  CONSTRAINT `parametrizacao_funcionarios_ibfk_1` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametrizacao_funcionarios`
--

LOCK TABLES `parametrizacao_funcionarios` WRITE;
/*!40000 ALTER TABLE `parametrizacao_funcionarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `parametrizacao_funcionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicos`
--

DROP TABLE IF EXISTS `servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `descricao` text,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `tempo_expediente` int DEFAULT NULL,
  `status` enum('agendado','em execução','concluido') DEFAULT NULL,
  `orcamento` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_servico_cliente` (`id_cliente`),
  CONSTRAINT `fk_servico_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicos`
--

LOCK TABLES `servicos` WRITE;
/*!40000 ALTER TABLE `servicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `servicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_funcionario` int DEFAULT NULL,
  `papel` enum('funcionario','administrador') DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_funcionario` (`id_funcionario`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_funcionario`) REFERENCES `funcionarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-23 17:06:38
