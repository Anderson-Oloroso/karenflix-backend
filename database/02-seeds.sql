-- 02-seeds.sql
USE karenflix_db;
SET NAMES utf8mb4;

-- Los IDs explícitos mantienen las relaciones consistentes en una base vacía.
INSERT INTO users (id, username, email, password_hash, role) VALUES
  (1, 'admin_karen', 'admin@karenflix.com', '$2b$10$H0HFV1XtylorbeuVLa08K.W8rV9fS3mbjArcN7gwVltTFdq.KUn0G', 'admin'),
  (2, 'user_juan', 'juan@gmail.com', '$2b$10$tzfAk/6vdWkPUKJ4yWO/pOYvbxjFODAwHMAgOiLdckdqXkVKGt1KG', 'user'),
  (3, 'user_maria', 'maria@gmail.com', '$2b$10$jVwF06p4.aEWASZV8aL3S.T6TY3zK7pgb91Syi3/YswoJVLZadd/u', 'user');

INSERT INTO categories (id, name, description) VALUES
  (1, 'Ciencia Ficción', 'Películas basadas en el futuro, tecnología avanzada y exploración espacial.'),
  (2, 'Acción', 'Películas llenas de adrenalina, combates y persecuciones.'),
  (3, 'Animación', 'Películas animadas para todo público, incluyendo anime y series.'),
  (4, 'Drama', 'Historias sobre personajes, decisiones y cambios personales.'),
  (5, 'Aventura', 'Relatos de viajes, descubrimientos y desafíos.'),
  (6, 'Fantasía', 'Historias con mundos imaginarios y elementos extraordinarios.');

INSERT INTO directors (id, name) VALUES
  (1, 'Christopher Nolan'),
  (2, 'Bob Persichetti'),
  (3, 'Lana Wachowski'),
  (4, 'Sofía Beltrán'),
  (5, 'Iván Cruz'),
  (6, 'Hayao Miyazaki'),
  (7, 'Bong Joon-ho'),
  (8, 'Steven Spielberg'),
  (9, 'Peter Jackson'),
  (10, 'Francis Ford Coppola'),
  (11, 'Robert Zemeckis'),
  (12, 'George Lucas'),
  (13, 'Lee Unkrich'),
  (14, 'Katsuhiro Otomo');

INSERT INTO movies (id, title, description, director_id, release_year, duration_minutes, age_rating, category_id, image_url, banner_url, trailer_url, status, created_by) VALUES
  (1, 'Inception', 'Un ladrón roba secretos corporativos dentro de los sueños.', 1, 2010, 148, 'PG-13', 1, 'https://images.unsplash.com/photo-1534447677768-be436bb09401', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'approved', 1),
  (2, 'Interstellar', 'Un equipo explora un agujero de gusano en busca de un nuevo hogar.', 1, 2014, 169, 'PG-13', 1, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'approved', 1),
  (3, 'Spider-Man: Into the Spider-Verse', 'Miles Morales cruza caminos con héroes de otros universos.', 2, 2018, 117, 'PG', 3, 'https://images.unsplash.com/photo-1635805737707-575885ab0820', 'https://images.unsplash.com/photo-1563089145-599997674d42', 'https://www.youtube.com/watch?v=g4Hbz2jLxvQ', 'approved', 1),
  (4, 'The Matrix', 'Un hacker descubre que la realidad es una simulación.', 3, 1999, 136, 'R', 1, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', 'https://www.youtube.com/watch?v=vKQi3bBA1y8', 'pending', 1),
  (5, 'Horizonte de Papel', 'Una cartógrafa descubre rutas que solo aparecen al anochecer.', 4, 2022, 110, 'PG', 5, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', NULL, NULL, 'approved', 1),
  (6, 'La Última Frecuencia', 'Un técnico recibe señales de una estación que dejó de existir.', 5, 2024, 104, 'PG-13', 1, 'https://images.unsplash.com/photo-1519608487953-e999c86e7455', NULL, NULL, 'pending', 1),
  (7, 'Jardín de Ceniza', 'Dos hermanas reconstruyen un invernadero después de una tormenta.', 4, 2021, 126, 'PG-13', 4, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', NULL, 'approved', 1),
  (8, 'Faro de Invierno', 'Una aprendiz cuida un faro que guía barcos entre islas invisibles.', 5, 2023, 98, 'PG', 6, 'https://images.unsplash.com/photo-1518837695005-2083093ee35b', NULL, NULL, 'rejected', 1);

INSERT INTO movies (id, title, description, director_id, release_year, duration_minutes, age_rating, category_id, image_url, banner_url, trailer_url, status, created_by) VALUES
  (9, 'The Dark Knight', 'Batman intenta detener la ola de crímenes del Joker en Gotham City.', 1, 2008, 152, 'PG-13', 2, NULL, NULL, NULL, 'approved', 1),
  (10, 'Spirited Away', 'Chihiro busca rescatar a sus padres en un mundo habitado por espíritus.', 6, 2001, 125, 'PG', 3, NULL, NULL, NULL, 'approved', 1),
  (11, 'Parasite', 'La familia Kim se incorpora gradualmente a la vida de la familia Park.', 7, 2019, 132, 'R', 4, NULL, NULL, NULL, 'approved', 1),
  (12, 'Jurassic Park', 'Un parque con dinosaurios clonados pierde el control de sus sistemas de seguridad.', 8, 1993, 127, 'PG-13', 5, NULL, NULL, NULL, 'approved', 1),
  (13, 'The Lord of the Rings: The Fellowship of the Ring', 'Frodo emprende un viaje para destruir el Anillo Único con la ayuda de una comunidad.', 9, 2001, 178, 'PG-13', 6, NULL, NULL, NULL, 'approved', 1),
  (14, 'The Godfather', 'La familia Corleone afronta conflictos de poder dentro del crimen organizado.', 10, 1972, 175, 'R', 4, NULL, NULL, NULL, 'approved', 1),
  (15, 'Back to the Future', 'Marty McFly viaja accidentalmente al pasado y debe ayudar a que sus padres se conozcan.', 11, 1985, 116, 'PG', 1, NULL, NULL, NULL, 'approved', 1),
  (16, 'Star Wars: Episode IV - A New Hope', 'Luke Skywalker se une a la Alianza Rebelde en su lucha contra el Imperio Galáctico.', 12, 1977, 121, 'PG', 1, NULL, NULL, NULL, 'approved', 1),
  (17, 'Coco', 'Miguel llega al Mundo de los Muertos y descubre la historia de su familia.', 13, 2017, 105, 'PG', 3, NULL, NULL, NULL, 'approved', 1),
  (18, 'Akira', 'En Neo-Tokyo, una banda de motociclistas queda envuelta en una crisis ligada a poderes psíquicos.', 14, 1988, 124, 'R', 1, NULL, NULL, NULL, 'approved', 1);

INSERT INTO actors (id, name, biography, birth_date, photo_url) VALUES
  (1, 'Leonardo DiCaprio', 'Actor conocido por sus papeles en dramas y ciencia ficción.', '1974-11-11', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
  (2, 'Matthew McConaughey', 'Actor conocido por sus papeles en cine dramático.', '1969-11-04', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
  (3, 'Keanu Reeves', 'Actor conocido por sus papeles de acción y ciencia ficción.', '1964-09-02', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce'),
  (4, 'Martina Solís', 'Actriz ficticia que interpreta personajes aventureros.', '1990-03-14', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'),
  (5, 'Tomás Vega', 'Actor ficticio especializado en historias de misterio.', '1987-07-22', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
  (6, 'Nora Campos', 'Actriz ficticia de historias familiares y dramáticas.', '1993-01-08', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330');

INSERT INTO movie_actors (id, movie_id, actor_id, character_name) VALUES
  (1, 1, 1, 'Dom Cobb'),
  (2, 2, 2, 'Joseph Cooper'),
  (3, 4, 3, 'Neo'),
  (4, 5, 4, 'Mara Sol'),
  (5, 5, 5, 'Elías Norte'),
  (6, 6, 5, 'Tadeo'),
  (7, 7, 6, 'Inés');

INSERT INTO favorites (id, user_id, movie_id) VALUES
  (1, 2, 1),
  (2, 2, 2),
  (3, 3, 3),
  (4, 2, 5),
  (5, 3, 7),
  (6, 1, 5);

INSERT INTO reviews (id, movie_id, user_id, title, comment, rating) VALUES
  (1, 1, 2, 'Una gran historia', 'La idea de explorar varios niveles de sueños mantiene el interés.', 10),
  (2, 2, 3, 'Viaje emocionante', 'La familia y la exploración espacial forman una historia memorable.', 9),
  (3, 3, 2, 'Animación excelente', 'El ritmo y los colores hacen que cada escena sea especial.', 8),
  (4, 5, 3, 'Aventura tranquila', 'Los personajes y los paisajes construyen un relato entretenido.', 8),
  (5, 5, 1, 'Buen descubrimiento', 'Una historia sencilla con un mundo interesante.', 7),
  (6, 7, 2, 'Relato conmovedor', 'La relación entre las hermanas se siente cercana.', 9);

INSERT INTO review_reactions (id, review_id, user_id, reaction_type) VALUES
  (1, 1, 3, 'like'),
  (2, 1, 1, 'dislike'),
  (3, 2, 2, 'like'),
  (4, 2, 1, 'like'),
  (5, 3, 3, 'dislike'),
  (6, 3, 1, 'like'),
  (7, 4, 2, 'like'),
  (8, 4, 1, 'dislike'),
  (9, 5, 2, 'like'),
  (10, 5, 3, 'like'),
  (11, 6, 1, 'dislike'),
  (12, 6, 3, 'like');