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
    SET average_rating = (
        SELECT ROUND(AVG(rating), 2)
        FROM reviews
        WHERE movie_id = p_movie_id
    )
    WHERE id = p_movie_id;
END$$
DELIMITER ;

-- =========================================================================
-- 2. PROCEDIMIENTO: Recálculo de Contador de Likes de una Reseña
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
-- 3. PROCEDIMIENTO: Recálculo Masivo de Calificaciones y Likes
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
    SET m.average_rating = r.avg_rating;

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

-- Las cascadas de claves foráneas no ejecutan triggers sobre las filas eliminadas.
DROP TRIGGER IF EXISTS trg_users_before_delete_recalculate_aggregates;
DELIMITER $$
CREATE TRIGGER trg_users_before_delete_recalculate_aggregates
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
        UPDATE movies m
        LEFT JOIN (
                SELECT movie_id, ROUND(AVG(rating), 2) AS avg_rating
                FROM reviews
                WHERE user_id <> OLD.id
                GROUP BY movie_id
        ) remaining_reviews ON remaining_reviews.movie_id = m.id
        SET m.average_rating = remaining_reviews.avg_rating
        WHERE EXISTS (
                SELECT 1
                FROM reviews deleted_reviews
                WHERE deleted_reviews.movie_id = m.id
                    AND deleted_reviews.user_id = OLD.id
        );

        UPDATE reviews r
        LEFT JOIN (
                SELECT review_id, COUNT(*) AS total_likes
                FROM review_reactions
                WHERE reaction_type = 'like'
                    AND user_id <> OLD.id
                GROUP BY review_id
        ) remaining_likes ON remaining_likes.review_id = r.id
        SET r.likes_count = COALESCE(remaining_likes.total_likes, 0)
        WHERE r.user_id <> OLD.id
            AND EXISTS (
                    SELECT 1
                    FROM review_reactions deleted_reactions
                    WHERE deleted_reactions.review_id = r.id
                        AND deleted_reactions.user_id = OLD.id
            );
END$$
DELIMITER ;

-- =========================================================================
-- 4. TRIGGERS EN TABLA `reviews` (Actualización automática de average_rating)
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
-- 5. TRIGGERS EN TABLA `review_reactions` (Actualización automática de likes_count)
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
-- Sincronización inicial de promedios y contadores con los datos existentes
-- =========================================================================
CALL sp_recalculate_all_ratings();
