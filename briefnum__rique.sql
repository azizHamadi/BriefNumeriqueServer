-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  Dim 15 déc. 2019 à 15:03
-- Version du serveur :  5.7.19
-- Version de PHP :  5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `briefnumérique`
--

-- --------------------------------------------------------

--
-- Structure de la table `affaire`
--

DROP TABLE IF EXISTS `affaire`;
CREATE TABLE IF NOT EXISTS `affaire` (
  `num_Aff` varchar(255) NOT NULL,
  `degre` varchar(255) NOT NULL,
  `sujet` varchar(1000) NOT NULL,
  `date` date NOT NULL,
  `etat` varchar(255) NOT NULL,
  `id_Clt` int(11) NOT NULL,
  `id_Crl` int(11) NOT NULL,
  `id_Av` int(11) NOT NULL,
  `num_Cas_Prec` varchar(255) DEFAULT NULL,
  `num_Av_Cont` varchar(255) NOT NULL,
  `etat_Av_Cont` tinyint(1) NOT NULL,
  `nomAff` varchar(1000) NOT NULL,
  PRIMARY KEY (`num_Aff`,`id_Clt`,`id_Av`) USING BTREE,
  KEY `id_Clt` (`id_Clt`),
  KEY `id_Crl` (`id_Crl`),
  KEY `num_Cas_Prec` (`num_Cas_Prec`),
  KEY `id_Av` (`id_Av`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `affaire`
--

INSERT INTO `affaire` (`num_Aff`, `degre`, `sujet`, `date`, `etat`, `id_Clt`, `id_Crl`, `id_Av`, `num_Cas_Prec`, `num_Av_Cont`, `etat_Av_Cont`, `nomAff`) VALUES
('2121546', 'محكمة 1', 'موضوع قضية 1', '2019-12-14', 'etat', 1, 1, 1, NULL, '2154687', 1, 'قضية سرقة');

-- --------------------------------------------------------

--
-- Structure de la table `avocat`
--

DROP TABLE IF EXISTS `avocat`;
CREATE TABLE IF NOT EXISTS `avocat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomComplet` varchar(255) DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `adresseBureau` varchar(255) DEFAULT NULL,
  `adresseDomicile` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `avocat`
--

INSERT INTO `avocat` (`id`, `nomComplet`, `grade`, `adresseBureau`, `adresseDomicile`, `tel`, `email`, `img`, `password`) VALUES
(1, 'عزيز حمادي', '2', 'باردو 2000', NULL, '24350799', 'aziz.hamadi@esprit.tn', '', '1');

-- --------------------------------------------------------

--
-- Structure de la table `bureauenquete`
--

DROP TABLE IF EXISTS `bureauenquete`;
CREATE TABLE IF NOT EXISTS `bureauenquete` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `num` int(11) DEFAULT NULL,
  `juge` varchar(255) DEFAULT NULL,
  `telJuge` varchar(255) DEFAULT NULL,
  `secretaire` varchar(255) DEFAULT NULL,
  `telSecretaire` varchar(255) DEFAULT NULL,
  `acteurMinisterePublic` varchar(255) DEFAULT NULL,
  `telActeur` varchar(255) DEFAULT NULL,
  `id_Trib` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `bureauenquete`
--

INSERT INTO `bureauenquete` (`id`, `num`, `juge`, `telJuge`, `secretaire`, `telSecretaire`, `acteurMinisterePublic`, `telActeur`, `id_Trib`) VALUES
(1, 1, 'jjk', '3215466', 'azdaf', '65484', 'afaaf', '654324', 1);

-- --------------------------------------------------------

--
-- Structure de la table `cercle`
--

DROP TABLE IF EXISTS `cercle`;
CREATE TABLE IF NOT EXISTS `cercle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `degre` varchar(255) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `numBureau` int(11) DEFAULT NULL,
  `numSalle` int(11) DEFAULT NULL,
  `dateSessions` date DEFAULT NULL,
  `nomPresident` varchar(255) DEFAULT NULL,
  `telPresident` varchar(255) DEFAULT NULL,
  `nomPremierMembre` varchar(255) DEFAULT NULL,
  `telMembreP` varchar(255) DEFAULT NULL,
  `nomDeuxiemeMembre` varchar(255) DEFAULT NULL,
  `telMembreD` varchar(255) DEFAULT NULL,
  `acteurMinisterePublic` varchar(255) DEFAULT NULL,
  `telActeur` varchar(255) DEFAULT NULL,
  `secretaire` varchar(255) DEFAULT NULL,
  `telSecretaire` varchar(255) DEFAULT NULL,
  `id_Trib` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_Trib` (`id_Trib`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `cercle`
--

INSERT INTO `cercle` (`id`, `degre`, `num`, `numBureau`, `numSalle`, `dateSessions`, `nomPresident`, `telPresident`, `nomPremierMembre`, `telMembreP`, `nomDeuxiemeMembre`, `telMembreD`, `acteurMinisterePublic`, `telActeur`, `secretaire`, `telSecretaire`, `id_Trib`) VALUES
(1, 'محكمة 1', 20151486, 12, 2, '2019-12-10', 'إسم 1', '25133489', 'إسم 3', '24568794', 'إسم 4', '26487485', NULL, NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomComplet` varchar(255) DEFAULT NULL,
  `cin_pass` varchar(255) DEFAULT NULL,
  `dateEmission` date DEFAULT NULL,
  `numPasseport` varchar(255) DEFAULT NULL,
  `periodeValPass` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `lieuNaissance` varchar(255) DEFAULT NULL,
  `nom_Comp_pere` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `proffession` varchar(255) DEFAULT NULL,
  `lieuTravail` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`, `nomComplet`, `cin_pass`, `dateEmission`, `numPasseport`, `periodeValPass`, `tel`, `dateNaissance`, `lieuNaissance`, `nom_Comp_pere`, `adresse`, `proffession`, `lieuTravail`, `mail`) VALUES
(1, 'غسان مساعد', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `contrat`
--

DROP TABLE IF EXISTS `contrat`;
CREATE TABLE IF NOT EXISTS `contrat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sujet` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `somme` float DEFAULT NULL,
  `dateEnregistrement` date DEFAULT NULL,
  `numEnregistrement` int(11) DEFAULT NULL,
  `etat` varchar(255) DEFAULT NULL,
  `causeRetard` varchar(255) DEFAULT NULL,
  `id_Av` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_Av` (`id_Av`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `dataavocat`
--

DROP TABLE IF EXISTS `dataavocat`;
CREATE TABLE IF NOT EXISTS `dataavocat` (
  `num` varchar(255) NOT NULL,
  `cin` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  PRIMARY KEY (`num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `demande`
--

DROP TABLE IF EXISTS `demande`;
CREATE TABLE IF NOT EXISTS `demande` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomDemande` varchar(255) NOT NULL,
  `partieConcernée` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `sujet` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `id_Aff` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_Aff` (`id_Aff`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `expert`
--

DROP TABLE IF EXISTS `expert`;
CREATE TABLE IF NOT EXISTS `expert` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomComplet` varchar(255) DEFAULT NULL,
  `specialite` varchar(255) DEFAULT NULL,
  `adresseBureau` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `huissierdejustice`
--

DROP TABLE IF EXISTS `huissierdejustice`;
CREATE TABLE IF NOT EXISTS `huissierdejustice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomComplet` varchar(255) DEFAULT NULL,
  `adresseBureau` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `huissiernotaire`
--

DROP TABLE IF EXISTS `huissiernotaire`;
CREATE TABLE IF NOT EXISTS `huissiernotaire` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomComplet` varchar(255) DEFAULT NULL,
  `adresseBureau` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `mission`
--

DROP TABLE IF EXISTS `mission`;
CREATE TABLE IF NOT EXISTS `mission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomMission` varchar(255) NOT NULL,
  `date` datetime DEFAULT NULL,
  `duree` varchar(255) DEFAULT NULL,
  `partieConcernee` varchar(255) DEFAULT NULL,
  `adressePartieC` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `requis` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `id_Aff` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_Aff` (`id_Aff`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `mission`
--

INSERT INTO `mission` (`id`, `nomMission`, `date`, `duree`, `partieConcernee`, `adressePartieC`, `type`, `requis`, `notes`, `id_Aff`) VALUES
(1, 'مهمة 1', '2019-12-15 15:00:00', '1 heur', 'قباضة', 'قباضة باردو', 'oui', '', '', '2121546'),
(2, 'مهمة 2', '2019-12-17 11:20:00', '2 heur', 'بلدية', 'بلدية باردو', 'oui', '', '', '2121546');

-- --------------------------------------------------------

--
-- Structure de la table `rendezvous`
--

DROP TABLE IF EXISTS `rendezvous`;
CREATE TABLE IF NOT EXISTS `rendezvous` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `sujet` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `id_Av` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_Av` (`id_Av`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `rendezvous`
--

INSERT INTO `rendezvous` (`id`, `date`, `adresse`, `sujet`, `notes`, `id_Av`) VALUES
(1, '2019-12-15 10:15:00', 'باردو', 'باردو', '', 1),
(2, '2019-12-17 07:25:00', 'باردو 2', 'باردو 2', '', 1);

-- --------------------------------------------------------

--
-- Structure de la table `session`
--

DROP TABLE IF EXISTS `session`;
CREATE TABLE IF NOT EXISTS `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomSession` varchar(255) NOT NULL,
  `date` datetime DEFAULT NULL,
  `sujet` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `Disp_prep` varchar(1000) DEFAULT NULL,
  `Cpt_Rd_Sess` varchar(1000) DEFAULT NULL,
  `id_Aff` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_Aff` (`id_Aff`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `session`
--

INSERT INTO `session` (`id`, `nomSession`, `date`, `sujet`, `notes`, `Disp_prep`, `Cpt_Rd_Sess`, `id_Aff`) VALUES
(1, 'جلسة 1', '2019-12-18 12:00:00', 'جلسة 1', 'جلسة 1', 'جلسة 1', 'جلسة 1', '2121546'),
(2, 'جلسة 2', '2019-12-20 09:00:00', 'جلسة 2', 'جلسة 2', 'جلسة 2', 'جلسة 2', '2121546');

-- --------------------------------------------------------

--
-- Structure de la table `tribunal`
--

DROP TABLE IF EXISTS `tribunal`;
CREATE TABLE IF NOT EXISTS `tribunal` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `degre` varchar(255) DEFAULT NULL,
  `etat` varchar(255) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `nomPresident` varchar(255) DEFAULT NULL,
  `nomAgentRepublique` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `tribunal`
--

INSERT INTO `tribunal` (`id`, `nom`, `degre`, `etat`, `adresse`, `tel`, `nomPresident`, `nomAgentRepublique`) VALUES
(1, 'محكمة 1', 'محكمة', 'oui', 'محكمة', '20152456', NULL, NULL);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `affaire`
--
ALTER TABLE `affaire`
  ADD CONSTRAINT `Affaire_ibfk_1` FOREIGN KEY (`id_Clt`) REFERENCES `client` (`id`),
  ADD CONSTRAINT `Affaire_ibfk_2` FOREIGN KEY (`id_Crl`) REFERENCES `cercle` (`id`),
  ADD CONSTRAINT `Affaire_ibfk_3` FOREIGN KEY (`num_Cas_Prec`) REFERENCES `affaire` (`num_Aff`),
  ADD CONSTRAINT `Affaire_ibfk_4` FOREIGN KEY (`id_Av`) REFERENCES `avocat` (`id`);

--
-- Contraintes pour la table `cercle`
--
ALTER TABLE `cercle`
  ADD CONSTRAINT `Cercle_ibfk_1` FOREIGN KEY (`id_Trib`) REFERENCES `tribunal` (`id`);

--
-- Contraintes pour la table `contrat`
--
ALTER TABLE `contrat`
  ADD CONSTRAINT `Contrat_ibfk_1` FOREIGN KEY (`id_Av`) REFERENCES `avocat` (`id`);

--
-- Contraintes pour la table `demande`
--
ALTER TABLE `demande`
  ADD CONSTRAINT `Demande_ibfk_1` FOREIGN KEY (`id_Aff`) REFERENCES `affaire` (`num_Aff`);

--
-- Contraintes pour la table `mission`
--
ALTER TABLE `mission`
  ADD CONSTRAINT `Mission_ibfk_1` FOREIGN KEY (`id_Aff`) REFERENCES `affaire` (`num_Aff`);

--
-- Contraintes pour la table `rendezvous`
--
ALTER TABLE `rendezvous`
  ADD CONSTRAINT `RendezVous_ibfk_1` FOREIGN KEY (`id_Av`) REFERENCES `avocat` (`id`);

--
-- Contraintes pour la table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `Session_ibfk_1` FOREIGN KEY (`id_Aff`) REFERENCES `affaire` (`num_Aff`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
