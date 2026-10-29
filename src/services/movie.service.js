import MovieDTO from '../dtos/movie.dto.js';
import AppError from '../utils/appError.util.js';

export default class MovieService {
    #movieModel;

    constructor(movieModel) {
        this.#movieModel = movieModel;
    }

    async create(movieData) {
        const existsTitle = await this.#movieModel.existTitle(movieData.title);

        if (existsTitle) {
            throw AppError.conflict('Ya existe una película con este título.');
        }

        if (!(await this.#movieModel.categoryExists(movieData.category_id))) {
            throw AppError.notFound(`La categoría con id ${movieData.category_id} no existe.`);
        }

        try {
            return await this.#movieModel.createMovie(movieData);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw AppError.conflict('Ya existe una película con este título.');
            }
            throw error;
        }
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
            throw AppError.notFound('La película no existe.');
        }

        return new MovieDTO(movie).data;
    }
    
    async update(id, movieData) {
        const movieExists = await this.#movieModel.exists(id);

        if (!movieExists) {
            throw AppError.notFound('La película no existe.');
        }

        if (movieData.title) {
            const titleExists = await this.#movieModel.existTitle(movieData.title, id);

            if (titleExists) {
                throw AppError.conflict('Ya existe una película con este título.');
            }
        }

        if (movieData.category_id && !(await this.#movieModel.categoryExists(movieData.category_id))) {
            throw AppError.notFound(`La categoría con id ${movieData.category_id} no existe.`);
        }

        try {
            return await this.#movieModel.updateMovie(id, movieData);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw AppError.conflict('Ya existe una película con este título.');
            }
            throw error;
        }
    }

    async approve(id) {
        const movieExists = await this.#movieModel.exists(id);

        if (!movieExists) {
            throw AppError.notFound('La película no existe.');
        }

        return await this.#movieModel.approve(id);
    }

    async deleteMovie(id) {
        const movieExists = await this.#movieModel.exists(id);

        if (!movieExists) {
            throw AppError.notFound('La película no existe.');
        }

        return await this.#movieModel.deleteMovie(id);
    }
}
