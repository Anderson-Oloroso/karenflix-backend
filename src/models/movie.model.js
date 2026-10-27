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
    
}