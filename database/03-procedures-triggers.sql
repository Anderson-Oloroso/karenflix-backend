-- 03-procedures-triggers.sql
-- Procedimientos Almacenados y Triggers de Integridad Transaccional
USE karenflix_db;

-- =========================================================================
-- 1. PROCEDIMIENTO: Recálculo de Calificación Promedio de una Película
-- =========================================================================
DROP PROCEDURE IF EXISTS sp_recalculate_movie_rating;
DELIMITER $$
CREATE PROCEDURE sp_recalculate_movie_rating(IN p_movie_id INT)
BEGIN
    UPDATE movies
    SET average_rating = COALESCE((
        SELECT ROUND(AVG(rating), 2)
        FROM reviews
        WHERE movie_id = p_movie_id
    ), 0.00)
    WHERE id = p_movie_id;
END$$
DELIMITER ;

-- =========================================================================
-- 2. PROCEDIMIENTO: Recálculo del total de favoritos de una película
-- =========================================================================
DROP PROCEDURE IF EXISTS sp_recalculate_movie_likes;
DELIMITER $$
CREATE PROCEDURE sp_recalculate_movie_likes(IN p_movie_id INT)
BEGIN
    UPDATE movies
    SET likes_count = (
        SELECT COUNT(*)
        FROM favorites
        WHERE movie_id = p_movie_id
    )
    WHERE id = p_movie_id;
END$$
DELIMITER ;

-- =========================================================================
-- 3. PROCEDIMIENTO: Recálculo de Contador de Likes de una Reseña
-- =========================================================================
DROP PROCEDURE IF EXISTS sp_recalculate_review_likes;
DELIMITER $$
CREATE PROCEDURE sp_recalculate_review_likes(IN p_review_id INT)
BEGIN
    UPDATE reviews
    SET likes_count = (
        SELECT COUNT(*)
        FROM review_reactions
        WHERE review_id = p_review_id AND reaction_type = 'like'
    )
    WHERE id = p_review_id;
END$$
DELIMITER ;

-- =========================================================================
-- 4. PROCEDIMIENTO: Recálculo Masivo de Calificaciones y Likes
-- =========================================================================
DROP PROCEDURE IF EXISTS sp_recalculate_all_ratings;
DELIMITER $$
CREATE PROCEDURE sp_recalculate_all_ratings()
BEGIN
    -- Recalcula el promedio de todas las películas
    UPDATE movies m
    LEFT JOIN (
        SELECT movie_id, ROUND(AVG(rating), 2) AS avg_rating
        FROM reviews
        GROUP BY movie_id
    ) r ON m.id = r.movie_id
    SET m.average_rating = COALESCE(r.avg_rating, 0.00);

    -- Recalcula los favoritos de cada película
    UPDATE movies m
    LEFT JOIN (
        SELECT movie_id, COUNT(*) AS total_likes
        FROM favorites
        GROUP BY movie_id
    ) f ON m.id = f.movie_id
    SET m.likes_count = COALESCE(f.total_likes, 0);

    -- Recalcula los likes de todas las reseñas
    UPDATE reviews rev
    LEFT JOIN (
        SELECT review_id, COUNT(*) AS total_likes
        FROM review_reactions
        WHERE reaction_type = 'like'
        GROUP BY review_id
    ) rr ON rev.id = rr.review_id
    SET rev.likes_count = COALESCE(rr.total_likes, 0);
END$$
DELIMITER ;

-- =========================================================================
-- 5. TRIGGERS EN TABLA `reviews` (Actualización automática de average_rating)
-- =========================================================================

-- Trigger al insertar una reseña
DROP TRIGGER IF EXISTS trg_reviews_after_insert;
DELIMITER $$
CREATE TRIGGER trg_reviews_after_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    CALL sp_recalculate_movie_rating(NEW.movie_id);
END$$
DELIMITER ;

-- Trigger al actualizar una reseña (cambio de rating o película)
DROP TRIGGER IF EXISTS trg_reviews_after_update;
DELIMITER $$
CREATE TRIGGER trg_reviews_after_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    IF OLD.rating <> NEW.rating OR OLD.movie_id <> NEW.movie_id THEN
        CALL sp_recalculate_movie_rating(NEW.movie_id);
        IF OLD.movie_id <> NEW.movie_id THEN
            CALL sp_recalculate_movie_rating(OLD.movie_id);
        END IF;
    END IF;
END$$
DELIMITER ;

-- Trigger al eliminar una reseña
DROP TRIGGER IF EXISTS trg_reviews_after_delete;
DELIMITER $$
CREATE TRIGGER trg_reviews_after_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    CALL sp_recalculate_movie_rating(OLD.movie_id);
END$$
DELIMITER ;

-- =========================================================================
-- 6. TRIGGERS EN TABLA `review_reactions` (Actualización automática de likes_count)
-- =========================================================================

-- Trigger al registrar una reacción (like/dislike)
DROP TRIGGER IF EXISTS trg_reactions_after_insert;
DELIMITER $$
CREATE TRIGGER trg_reactions_after_insert
AFTER INSERT ON review_reactions
FOR EACH ROW
BEGIN
    CALL sp_recalculate_review_likes(NEW.review_id);
END$$
DELIMITER ;

-- Trigger al modificar una reacción (de dislike a like o viceversa)
DROP TRIGGER IF EXISTS trg_reactions_after_update;
DELIMITER $$
CREATE TRIGGER trg_reactions_after_update
AFTER UPDATE ON review_reactions
FOR EACH ROW
BEGIN
    IF OLD.reaction_type <> NEW.reaction_type OR OLD.review_id <> NEW.review_id THEN
        CALL sp_recalculate_review_likes(NEW.review_id);
        IF OLD.review_id <> NEW.review_id THEN
            CALL sp_recalculate_review_likes(OLD.review_id);
        END IF;
    END IF;
END$$
DELIMITER ;

-- Trigger al eliminar una reacción
DROP TRIGGER IF EXISTS trg_reactions_after_delete;
DELIMITER $$
CREATE TRIGGER trg_reactions_after_delete
AFTER DELETE ON review_reactions
FOR EACH ROW
BEGIN
    CALL sp_recalculate_review_likes(OLD.review_id);
END$$
DELIMITER ;

-- =========================================================================
-- 7. TRIGGERS EN `favorites` (Actualización automática de movies.likes_count)
-- =========================================================================
DROP TRIGGER IF EXISTS trg_favorites_after_insert;
DELIMITER $$
CREATE TRIGGER trg_favorites_after_insert
AFTER INSERT ON favorites
FOR EACH ROW
BEGIN
    UPDATE movies
    SET likes_count = likes_count + 1
    WHERE id = NEW.movie_id;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_favorites_after_update;
DELIMITER $$
CREATE TRIGGER trg_favorites_after_update
AFTER UPDATE ON favorites
FOR EACH ROW
BEGIN
    IF OLD.movie_id <> NEW.movie_id THEN
        UPDATE movies
        SET likes_count = likes_count + 1
        WHERE id = NEW.movie_id;
        UPDATE movies
        SET likes_count = likes_count - 1
        WHERE id = OLD.movie_id;
    END IF;
END$$
DELIMITER ;

DROP TRIGGER IF EXISTS trg_favorites_after_delete;
DELIMITER $$
CREATE TRIGGER trg_favorites_after_delete
AFTER DELETE ON favorites
FOR EACH ROW
BEGIN
    UPDATE movies
    SET likes_count = likes_count - 1
    WHERE id = OLD.movie_id;
END$$
DELIMITER ;

-- =========================================================================
-- Sincronización inicial de promedios y contadores con los datos existentes
-- =========================================================================
CALL sp_recalculate_all_ratings();
