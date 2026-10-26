-- 02-seeds.sql
USE karenflix_db;

-- Usuario Admin por defecto (password: Admin123! hasheado con bcrypt)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin_karen', 'admin@karenflix.com', '$2b$10$e8R54m48d70/Gf.w3qHhR.1aL3L2uFqK9aP5lq8aQ3f.Jz2e5.t8S', 'admin'),
('user_geek', 'geek@karenflix.com', '$2b$10$e8R54m48d70/Gf.w3qHhR.1aL3L2uFqK9aP5lq8aQ3f.Jz2e5.t8S', 'user');

-- Categorías Geek Base
INSERT INTO categories (name, description) VALUES
('Anime', 'Series y películas de animación japonesa'),
('Ciencia Ficción', 'Viajes espaciales, tecnología y futuros distópicos'),
('Superhéroes', 'Cómics adaptados al cine y la televisión'),
('Fantasía', 'Mundos mágicos, dragones y aventuras épicas');

-- Películas Aprobadas Iniciales
INSERT INTO movies (title, description, category_id, release_year, image_url, status, created_by) VALUES
('Interstellar', 'Un grupo de exploradores viaja a través de un agujero de gusano en el espacio.', 2, 2014, 'https://example.com/interstellar.jpg', 'approved', 1),
('Spider-Man: Into the Spider-Verse', 'Miles Morales se convierte en el Spider-Man de su universo.', 3, 2018, 'https://example.com/spiderverse.jpg', 'approved', 1);