-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 23 May 2024, 06:57:53
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `documents`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `documents`
--

CREATE TABLE `documents` (
  `documentID` int(11) NOT NULL,
  `documentContent` longtext DEFAULT NULL,
  `documentHeader` varchar(255) NOT NULL,
  `documentLink` varchar(255) NOT NULL,
  `documentsTitle` varchar(255) DEFAULT NULL,
  `documentWriter` varchar(255) NOT NULL,
  `documentDate` timestamp NULL DEFAULT current_timestamp(),
  `documentIsActive` int(11) DEFAULT 0,
  `parentDocumentID` tinyint(4) DEFAULT NULL,
  `isMainDocument` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tetikleyiciler `documents`
--
DELIMITER $$
CREATE TRIGGER `generate_documentLink` BEFORE INSERT ON `documents` FOR EACH ROW BEGIN
    DECLARE documentHeader_turkish VARCHAR(255);
    DECLARE header_count INT;
    DECLARE header_link VARCHAR(255);
    DECLARE new_link VARCHAR(255);
    
    SET documentHeader_turkish = REPLACE(NEW.documentHeader, 'ü', 'u');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'Ü', 'U');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'ö', 'o');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'Ö', 'O');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'ı', 'i');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'İ', 'I');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'ç', 'c');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'Ç', 'C');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'ş', 's');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'Ş', 'S');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'ğ', 'g');
    SET documentHeader_turkish = REPLACE(documentHeader_turkish, 'Ğ', 'G');
    
    SET header_link = REPLACE(LOWER(documentHeader_turkish), ' ', '-');
    
    SET header_count = (SELECT COUNT(*) FROM documents WHERE documentHeader = NEW.documentHeader);
    
    IF header_count > 0 THEN
        SET new_link = CONCAT(header_link, header_count);
    ELSE
        SET new_link = header_link;
    END IF;
    
    SET NEW.documentLink = new_link;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `isAdmin`) VALUES
(1, 'admin', 'admin', 1),
(3, 'user', 'user', 0);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`documentID`),
  ADD KEY `parentDocumentID` (`parentDocumentID`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `documents`
--
ALTER TABLE `documents`
  MODIFY `documentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
