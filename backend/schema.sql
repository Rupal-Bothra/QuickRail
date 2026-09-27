-- Fallback schema SQL for manual MySQL setup for QuickRail

CREATE DATABASE IF NOT EXISTS `quickrail_db`;
USE `quickrail_db`;

DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `passengers`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `seat_inventory`;
DROP TABLE IF EXISTS `routes`;
DROP TABLE IF EXISTS `trains`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'USER',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `trains` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `train_number` VARCHAR(20) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `source` VARCHAR(100) NOT NULL,
  `destination` VARCHAR(100) NOT NULL,
  `departure_time` VARCHAR(20) NOT NULL,
  `arrival_time` VARCHAR(20) NOT NULL,
  `duration` VARCHAR(50) NOT NULL,
  `classes_available` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `routes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `train_id` INT NOT NULL,
  `stops` TEXT NOT NULL,
  `distance` INT NOT NULL,
  FOREIGN KEY (`train_id`) REFERENCES `trains`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `seat_inventory` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `train_id` INT NOT NULL,
  `class` VARCHAR(10) NOT NULL,
  `date` VARCHAR(10) NOT NULL,
  `total_seats` INT NOT NULL,
  `available_seats` INT NOT NULL,
  `rac_count` INT NOT NULL DEFAULT 0,
  `waitlist_count` INT NOT NULL DEFAULT 0,
  UNIQUE KEY `uniq_train_class_date` (`train_id`, `class`, `date`),
  FOREIGN KEY (`train_id`) REFERENCES `trains`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `train_id` INT NOT NULL,
  `pnr` VARCHAR(20) NOT NULL UNIQUE,
  `class` VARCHAR(10) NOT NULL,
  `journey_date` VARCHAR(10) NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `total_fare` DECIMAL(10, 2) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`train_id`) REFERENCES `trains`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `passengers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `age` INT NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `berth_preference` VARCHAR(50) NOT NULL,
  `seat_number` VARCHAR(50) DEFAULT NULL,
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `method` VARCHAR(50) NOT NULL,
  `transaction_id` VARCHAR(100) NOT NULL UNIQUE,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
