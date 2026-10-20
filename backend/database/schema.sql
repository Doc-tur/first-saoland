CREATE DATABASE IF NOT EXISTS first_saoland_php CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE first_saoland_php;

CREATE TABLE IF NOT EXISTS users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 role ENUM('admin','customer') NOT NULL DEFAULT 'customer',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS properties (
 id VARCHAR(80) PRIMARY KEY,
 title VARCHAR(150) NOT NULL,
 description TEXT NOT NULL,
 price DECIMAL(16,2) NULL,
 price_period ENUM('total','year','month') NOT NULL DEFAULT 'total',
 type ENUM('Residential','Commercial','Land') NOT NULL,
 purpose ENUM('Buy','Rent') NOT NULL,
 category VARCHAR(80) NOT NULL,
 location VARCHAR(200) NOT NULL,
 image VARCHAR(2048) NOT NULL DEFAULT '/assets/home.jpg',
 bedrooms SMALLINT UNSIGNED NOT NULL DEFAULT 0,
 bathrooms SMALLINT UNSIGNED NOT NULL DEFAULT 0,
 area_sqm DECIMAL(12,2) NULL,
 features TEXT NOT NULL,
 status ENUM('available','sold','rented','draft') NOT NULL DEFAULT 'draft',
 featured TINYINT(1) NOT NULL DEFAULT 0,
 is_example TINYINT(1) NOT NULL DEFAULT 0,
 created_by BIGINT UNSIGNED NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (created_by) REFERENCES users(id),
 INDEX property_filters (status,type,purpose),
 INDEX property_created (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inquiries (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 property_id VARCHAR(80) NULL,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(190) NOT NULL,
 phone VARCHAR(40) NOT NULL DEFAULT '',
 interest VARCHAR(80) NOT NULL,
 location VARCHAR(200) NOT NULL DEFAULT '',
 budget VARCHAR(100) NOT NULL DEFAULT '',
 message TEXT NOT NULL,
 status ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
 INDEX user_inquiries (user_id,created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rate_limits (
 bucket CHAR(64) PRIMARY KEY,
 hits INT UNSIGNED NOT NULL DEFAULT 0,
 expires_at BIGINT UNSIGNED NOT NULL,
 INDEX expires (expires_at)
) ENGINE=InnoDB;
