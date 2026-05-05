CREATE DATABASE IF NOT EXISTS xplora_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE xplora_db;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS category_follows;
DROP TABLE IF EXISTS experiences;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500) DEFAULT 'https://via.placeholder.com/40',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  usage_duration VARCHAR(100) DEFAULT NULL,
  pros TEXT DEFAULT NULL,
  cons TEXT DEFAULT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_product_name (product_name),
  KEY idx_products_user_id (user_id),
  KEY idx_products_category_id (category_id),
  CONSTRAINT fk_products_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE experiences (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  location VARCHAR(255) DEFAULT NULL,
  rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
  product_id INT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_experiences_title (title),
  KEY idx_experiences_user_id (user_id),
  KEY idx_experiences_category_id (category_id),
  KEY idx_experiences_product_id (product_id),
  CONSTRAINT fk_experiences_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_experiences_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_experiences_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE SET NULL,
  CONSTRAINT chk_experiences_rating
    CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE category_follows (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_category_follows_user_category (user_id, category_id),
  KEY idx_category_follows_category_id (category_id),
  CONSTRAINT fk_category_follows_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_category_follows_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  type VARCHAR(50) NOT NULL,
  reference_id INT UNSIGNED DEFAULT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_user_id (user_id),
  KEY idx_notifications_is_read (is_read),
  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO categories (name, icon) VALUES
  ('Accessories', NULL),
  ('Automotive', NULL),
  ('Beauty & Personal Care', NULL),
  ('Books & Stationery', NULL),
  ('City', 'map-pin'),
  ('Fashion & Apparel', NULL),
  ('Garden & DIY', NULL),
  ('Grocery / Supermarket', NULL),
  ('Health & Wellness', NULL),
  ('Home & Living', NULL),
  ('Mother & Baby', NULL),
  ('Office Supplies', NULL),
  ('Pet Supplies', NULL),
  ('Shoes & Bags', NULL),
  ('Sports & Outdoors', NULL),
  ('Toys & Hobbies', NULL),
  ('Workshop', 'hammer');