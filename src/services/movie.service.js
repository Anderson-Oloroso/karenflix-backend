import MoviesModel from "../models/movie.model.js";
import MoviesDTO from "../dtos/movie.dto.js";

export default class MoviesService {

    static async create(movieData){
        const existsTitle = await MoviesModel.existTitle(movieData.existTitle);

        if(existsTitle){
            throw new Error(
                'Ya existe una pelicula con este titulo.'
            );
        }
        const result = await MoviesModel.createMovie(movieData);
        return result;
    }

    static async getAll(filters = {}){
        let movies;

        if(filters.category){
            movies = await MoviesModel.getByCategory(filters.category);
        }else if(filters.title) {
            movies = await MoviesModel.getByTitle(filters.title);
        }else{
            movies = await MoviesModel.getAll();
        }

        return MoviesDTO.fromArray(movies);
    }

    static async getById(id){

        const movie = await MoviesModel.getById(id);

        if(!movie){
            throw new Error(
                'La pelicula no existe ...'
            );
        }

        return new MoviesDTO(movie).data;
    }
    
    static async update(id, movieData){

        const movieExists = await MoviesModel.exists(id);

        if(!movieExists) {
            throw new Error(
                'La pelicula no existe ...'
            );
        }

        if(movieData.title){
            const titleExists = await MoviesModel.existTitle(movieData.title)

            if(titleExists){
                throw new Error(
                    'Ya existe una pelicula con este titulo'
                );
            }
        }
        return await MoviesModel.update(
            id,
            movieData
        );
    }

    static async approve(id){
        const movieExists = await MoviesModel.exists(id);

        if(!movieExists){
            throw new Error(
                'La pel{icula no existe ...'
            );
        }

        return await MoviesModel.deleteMovie(id);
    }
}