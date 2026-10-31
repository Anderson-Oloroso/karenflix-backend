-- 02-seeds.sql
USE karenflix_db;

-- 1. Inserción de Usuarios (1 Administrador y 2 Usuarios normales)
-- Las contraseñas se hashearon con bcrypt (coste 10); credenciales documentadas en entorno de desarrollo.
INSERT INTO users (username, email, password_hash, role) VALUES
('admin_karen', 'admin@karenflix.com', '$2b$10$H0HFV1XtylorbeuVLa08K.W8rV9fS3mbjArcN7gwVltTFdq.KUn0G', 'admin'),
('user_juan', 'juan@gmail.com', '$2b$10$tzfAk/6vdWkPUKJ4yWO/pOYvbxjFODAwHMAgOiLdckdqXkVKGt1KG', 'user'),
('user_maria', 'maria@gmail.com', '$2b$10$jVwF06p4.aEWASZV8aL3S.T6TY3zK7pgb91Syi3/YswoJVLZadd/u', 'user');

-- 2. Inserción de Categorías
INSERT INTO categories (name, description) VALUES
('Ciencia Ficción', 'Películas basadas en el futuro, tecnología avanzada y exploración espacial.'),
('Acción', 'Películas llenas de adrenalina, combates y persecuciones.'),
('Animación', 'Películas animadas para todo público, incluyendo anime y series geek.'),
('Drama', 'Historias profundas centradas en el desarrollo de personajes y conflictos emocionales.');

-- 3. Inserción de Directores (Preparado para la futura experiencia de usuario / perfiles)
INSERT INTO directors (name, biography, photo_url) VALUES
('Christopher Nolan', 'Director, guionista y productor británico-estadounidense, conocido por sus complejos filmes conceptuales.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
('Bob Persichetti', 'Director y animador estadounidense, reconocido por su trabajo en producciones animadas de gran impacto.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
('Lana Wachowski', 'Directora de cine, guionista y productora estadounidense, co-creadora de la saga Matrix.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330');

-- 4. Inserción de Películas / Series (created_by = 1 corresponde a admin_karen)
INSERT INTO movies (title, description, director_id, release_year, duration_minutes, age_rating, category_id, image_url, banner_url, trailer_url, status, created_by) VALUES
(
  'Inception', 
  'Un ladrón que roba secretos corporativos a través de los sueños.', 
  1, -- Christopher Nolan
  2010, 
  148, 
  'PG-13', 
  1, 
  'https://images.unsplash.com/photo-1534447677768-be436bb09401', 
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23', 
  'https://www.youtube.com/watch?v=YoHD9XEInc0', 
  'approved', 
  1
),
(
  'Interstellar', 
  'Un equipo de exploradores viaja a través de un agujero de gusano en busca de un nuevo hogar.', 
  1, -- Christopher Nolan
  2014, 
  169, 
  'PG-13', 
  1, 
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa', 
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86', 
  'https://www.youtube.com/watch?v=zSWdZVtXT7E', 
  'approved', 
  1
),
(
  'Spider-Man: Into the Spider-Verse', 
  'Miles Morales se convierte en el Hombre Araña de su universo y cruza caminos con otros.', 
  2, -- Bob Persichetti
  2018, 
  117, 
  'PG', 
  3, 
  'https://images.unsplash.com/photo-1635805737707-575885ab0820', 
  'https://images.unsplash.com/photo-1563089145-599997674d42', 
  'https://www.youtube.com/watch?v=g4Hbz2jLxvQ', 
  'approved', 
  1
),
(
  'The Matrix', 
  'Un hacker descubre que la realidad cotidiana es una simulación creada por máquinas.', 
  3, -- Lana Wachowski
  1999, 
  136, 
  'R', 
  1, 
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', 
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', 
  'https://www.youtube.com/watch?v=vKQi3bBA1y8', 
  'pending', 
  1
);

-- 5. Inserción de Actores
INSERT INTO actors (name, biography, birth_date, photo_url) VALUES
('Leonardo DiCaprio', 'Actor y productor de cine estadounidense, ganador del Óscar.', '1974-11-11', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
('Matthew McConaughey', 'Actor estadounidense conocido por sus papeles en dramas y ciencia ficción.', '1969-11-04', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
('Keanu Reeves', 'Actor y músico canadiense, protagonista de Matrix y John Wick.', '1964-09-02', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce');

-- 6. Relación Películas - Actores (movie_actors)
INSERT INTO movie_actors (movie_id, actor_id, character_name) VALUES
(1, 1, 'Dom Cobb'),
(2, 2, 'Joseph Cooper'),
(4, 3, 'Neo / Thomas Anderson');

-- 7. Inserción de Favoritos / Mi Lista (favorites)
INSERT INTO favorites (user_id, movie_id) VALUES
(2, 1), -- Juan guardó Inception en su lista
(2, 2), -- Juan guardó Interstellar en su lista
(3, 3); -- María guardó Spider-Verse en su lista

-- 8. Inserción de Reseñas (reviews con rating de 1 a 10)
INSERT INTO reviews (movie_id, user_id, title, comment, rating) VALUES
(1, 2, 'Una obra maestra del cine', 'La trama de los sueños dentro de los sueños es alucinante y la banda sonora es épica.', 10),
(2, 3, 'Emotiva y compleja', 'Me hizo reflexionar mucho sobre el tiempo y el espacio. Visualmente increíble.', 9);

-- 9. Inserción de Reacciones a Reseñas (review_reactions)
INSERT INTO review_reactions (review_id, user_id, reaction_type) VALUES
(1, 3, 'like'), -- María le dio "like" a la reseña de Juan
(2, 2, 'like'); -- Juan le dio "like" a la reseña de María