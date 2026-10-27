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
}