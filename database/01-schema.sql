-- 01-schema.sql
CREATE DATABASE IF NOT EXISTS karenflix_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;
USE karenflix_db;

-- 1. Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    token_version INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabla de Directores
CREATE TABLE IF NOT EXISTS directors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Tabla de Películas / Series (Con todos los metadatos y restricciones)
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    director_id INT NOT NULL,
    release_year INT NOT NULL,
    duration_minutes INT NOT NULL,
    age_rating VARCHAR(10) DEFAULT 'PG-13',
    category_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    banner_url VARCHAR(255) NULL,
    trailer_url VARCHAR(255) NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    average_rating DECIMAL(4,2) NOT NULL DEFAULT 0.00 COMMENT 'Promedio ponderado calculado automáticamente por triggers (soporta hasta 10.00)',
    likes_count INT NOT NULL DEFAULT 0 COMMENT 'Cantidad de usuarios que agregaron la película a favoritos',
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_movies_category_status (category_id, status),
    KEY idx_movies_release_year (release_year),
    CONSTRAINT fk_movie_director FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE RESTRICT,
    CONSTRAINT fk_movie_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_movie_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Tabla de Actores
CREATE TABLE IF NOT EXISTS actors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    biography TEXT,
    birth_date DATE,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Tabla Intermedia de Películas y Actores
CREATE TABLE IF NOT EXISTS movie_actors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    actor_id INT NOT NULL,
    character_name VARCHAR(100),
    UNIQUE KEY unique_movie_actor (movie_id, actor_id),
    CONSTRAINT fk_ma_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_ma_actor FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. Tabla de Favoritos / Mi Lista de Usuarios
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_movie_favorite (user_id, movie_id),
    CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fav_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Tabla de Reseñas
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 10),
    likes_count INT NOT NULL DEFAULT 0 COMMENT 'Contador de likes calculado automáticamente por triggers',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_movie_user_review (movie_id, user_id),
    CONSTRAINT fk_review_movie FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Tabla de Reacciones (Likes / Dislikes en Reseñas)
CREATE TABLE IF NOT EXISTS review_reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    reaction_type ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_review_reaction (review_id, user_id),
    CONSTRAINT fk_reaction_review FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    CONSTRAINT fk_reaction_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Los índices se declaran junto a sus respectivas tablas.
-- Índices estratégicos para optimizar búsquedas y filtrados en producción
