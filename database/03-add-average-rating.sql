-- 03-add-average-rating.sql
-- Migración: agrega la columna average_rating a la tabla movies
-- para soportar el cálculo transaccional del promedio ponderado de reseñas.
USE karenflix_db;

ALTER TABLE movies
    ADD COLUMN average_rating DECIMAL(4,2) DEFAULT NULL
        COMMENT 'Promedio ponderado de ratings calculado transaccionalmente'
    AFTER status;
