import MovieDTO from "../dtos/movie.dto.js";

export default class MovieService {
    #movieModel;

    constructor(movieModel) {
        this.#movieModel = movieModel;
    }

    async create(movieData) {
        const existsTitle = await this.#movieModel.existTitle(movieData.title);

        if (existsTitle) {
            throw new Error('Ya existe una pelicula con este titulo.');
        }

        return await this.#movieModel.createMovie(movieData);
    }

    async getAll(filters = {}) {
        let movies;

        if (filters.category) {
            movies = await this.#movieModel.getByCategory(filters.category);
        } else if (filters.title) {
            movies = await this.#movieModel.getByTitle(filters.title);
        } else {
            movies = await this.#movieModel.getAll();
        }

        return MovieDTO.fromArray(movies);
    }

    async getById(id) {
        const movie = await this.#movieModel.getById(id);

        if (!movie) {
            throw new Error('La pelicula no existe ...');
        }

        return new MovieDTO(movie).data;
    }
    
    async update(id, movieData) {
        const movieExists = await this.#movieModel.exists(id);

        if (!movieExists) {
            throw new Error('La pelicula no existe ...');
        }

        if (movieData.title) {
            const titleExists = await this.#movieModel.existTitle(movieData.title);

            if (titleExists) {
                throw new Error('Ya existe una pelicula con este titulo');
            }
        }

        return await this.#movieModel.updateMovie(id, movieData);
    }

    async approve(id) {
        const movieExists = await this.#movieModel.exists(id);

        if (!movieExists) {
            throw new Error('La pelicula no existe ...');
        }

        return await this.#movieModel.approve(id);
    }

    async deleteMovie(id) {
        const movieExists = await this.#movieModel.exists(id);

        if (!movieExists) {
            throw new Error('La pelicula no existe ...');
        }

        return await this.#movieModel.deleteMovie(id);
    }
}
