import { pool } from '../config/db.config.js';

export default class MoviesModel {

    static async createMovie(movie) {
        const [result] = await pool.query(
            `INSERT INTO movies (
                title,
                description,
                category_id,
                release_year,
                image_url,
                status,
                created_by
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                movie.title,
                movie.description,
                movie.category_id,
                movie.release_year,
                movie.image_url,
                movie.status || 'pending',
                movie.created_by
            ]
        );
        return result;
    }

    static async getAll() {
        const [movies] = await pool.query(
            `SELECT 
                m.id,
                m.title,
                m.description,
                c.name AS category_name,
                m.release_year,
                m.image_url,
                m.status,
                u.username,
                m.created_at
            FROM movies m 
            INNER JOIN categories c
                ON c.id = m.category_id
            INNER JOIN users u 
                ON u.id = m.created_by
            ORDER BY m.created_at DESC`
        );

        return movies;
    }

    static async getById(id) {
        const [movie] = await pool.query(
            `SELECT 
                m.id,
                m.title,
                m.description,
                c.name AS category_name,
                m.release_year,
                m.image_url,
                m.status,
                u.username,
                m.created_at
            FROM movies m 
            INNER JOIN categories c
                ON c.id = m.category_id
            INNER JOIN users u 
                ON u.id = m.created_by
            WHERE m.id = ?`,
            [id]
        );
        return movie[0] ?? null;
    }

    static async getByTitle(title) {
        const [movie] = await pool.query(
            `SELECT 
                m.id,
                m.title,
                m.description,
                c.name AS category_name,
                m.release_year,
                m.image_url,
                m.status,
                u.username,
                m.created_at
            FROM movies m 
            INNER JOIN categories c
                ON c.id = m.category_id
            INNER JOIN users u 
                ON u.id = m.created_by
            WHERE m.title LIKE ?
            ORDER BY m.created_at DESC`,
            [`%${title}%`]
        );

        return movie;
    }

    static async getByCategory(categoryId) {
        const [movie] = await pool.query(
            `SELECT 
                m.id,
                m.title,
                m.description,
                c.name AS category_name,
                m.release_year,
                m.image_url,
                m.status,
                u.username,
                m.created_at
            FROM movies m 
            INNER JOIN categories c
                ON c.id = m.category_id
            INNER JOIN users u 
                ON u.id = m.created_by
            WHERE m.category_id = ?
            ORDER BY m.created_at DESC`,
            [categoryId]
        );

        return movie;
    }

    static async exists(id) {
        const [rows] = await pool.query(
            `SELECT id FROM movies WHERE id = ?`,
            [id]
        );

        return rows.length > 0;
    }

    static async existTitle(title) {
        const [rows] = await pool.query(
            `SELECT id FROM movies WHERE title = ?`,
            [title]
        );

        return rows.length > 0;
    }

    static async updateMovie(id, movie) {
        const [result] = await pool.query(
            `UPDATE movies
            SET
                title = COALESCE(?, title),
                description = COALESCE(?, description),
                category_id = COALESCE(?, category_id),
                release_year = COALESCE(?, release_year),
                image_url = COALESCE(?, image_url),
                status = COALESCE(?, status)
            WHERE id = ?`,
            [
                movie.title ?? null,
                movie.description ?? null,
                movie.category_id ?? null,
                movie.release_year ?? null,
                movie.image_url ?? null,
                movie.status ?? null,
                id
            ]
        );

        return result;
    }

    static async approve(id) {
        const [result] = await pool.query(
            `UPDATE movies SET status = 'approved' WHERE id = ?`,
            [id]
        );
        return result;
    }

    static async deleteMovie(id) {
        const [result] = await pool.query(
            `DELETE FROM movies WHERE id = ?`,
            [id]
        );
        return result;
    }
}
