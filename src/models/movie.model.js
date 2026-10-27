import { pool } from '../config/db.config.js';


export default class MoviesModel {

    static async createMovie(movie){
        const [ result ] = await pool.query(
            `INSERT INTO movies (
                title,
                description,
                category_id,
                release_year,
                imagen_url,
                status,
                create_by) 
            VALUES(?, ?, ?, ?, ?, ?, ?)`,[
                movie.title,
                movie.descripotion,
                movie.category_id,
                movie.release_year,
                movie.image_url,
                movie.status,
                movie.create_by
            ]
        );
        return result;
    }

    static async getAll(){
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
                m.create_at
            FROM movies m 
            INNER JOIN categorias c
                ON c.id = m.category_id
            INNER JOIN users u 
                ON u.id = m.create_at
            ORDER BY m.create_at 
            DESC 
            `
        );

        return movies;
    }

    static async getById(id){
        
        cosnt [ movie ] = await pool.query(
            `SELECT 
                m.id,
                m.title,
                m.description,
                c.name AS category_name,
                m.release_year,
                m.image_url,
                m.status,
                u.username,
                m.create_at
            FROM movies m 
            INNER JOIN categorias c
                ON c.id = m.category_id
            INNER JOIN users u 
                ON u.id = m.create_at
            WHERE m.id = ? 
            `,[id]
        );
        return movie[0];
    }

    static async getByTitle(title){
        const [ movie ] = await pool.query(
           `SELECT 
                m.id,
                m.title,
                m.description,
                c.name AS category_name,
                m.release_year,
                m.image_url,
                m.status,
                u.username,
                m.create_at
            FROM movies m 
            INNER JOIN categorias c
                ON c.id = m.category_id
            INNER JOIN users u 
                ON u.id = m.create_at
            WHERE m.title LIKE ?
            ORDER BY m.create_at
            DESC 
            `,[`%${title}%`]
        );

        return movie();
    }

    static async getByCategory(categoryId){
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
                m.create_at
            FROM movies m 
            INNER JOIN categorias c
                ON c.id = m.category_id
            INNER JOIN users u 
                ON u.id = m.create_at
            WHERE c.category_id = ?
            ORDER BY m.create_at
            DESC
            `,[categoryId]
        );

        return movie;
    }

    static async exists(id){
        cosnt [rows] = await pool.query(`
            SELECT id
            FROM movies
            WHERE id = ?
            `,[id]
        );

        return rows.length > 0;
    }

    static async existTitle(title){
        cosnt [rows] = await pool.query(`
            SELECT id
            FROM movies
            WHERE title = ?
            `, [title]
        );

        return rows.length > 0;
    }

    static async updateMovie(id, movie){
        cosnt  [result] = await pool.query(`
            UPDATE movies
                title = ?,
                description = ?,
                category_id = ?,
                release_year = ?,
                image_url = ?,
                status = ?
            `,[
                movie.title,
                movie.descripotion,
                movie.category_id,
                movie.release_year,
                movie.image_url,
                movie.status,
                id
            ]
        );

        return result;
    }

    static async approve(id){
        cosnt [result] = await pool.query(`
            UPDATE movies
            SET status = 'approved'
            WHERE id = ?
            `, [id]
        );
        return result;
    }

    static async deleteMovie(id){
        const [result] = await pool.query(`
            DELETE FROM movies
            WHERE id = ?
            `, [id]
        );
        return result();
    }
}