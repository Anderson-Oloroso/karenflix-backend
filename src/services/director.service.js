import AppError from '../utils/appError.util.js';

export default class DirectorService {
    #directorModel;

    constructor(directorModel) {
        this.#directorModel = directorModel;
    }

    async getAll() {
        return this.#directorModel.getAll();
    }

    async getById(id, includeMovies = false) {
        const director = await this.#directorModel.getById(id);
        if (!director) {
            throw AppError.notFound(`No se encontró un director con ID ${id}.`);
        }

        if (includeMovies) {
            director.movies = await this.#directorModel.getMoviesByDirector(id);
        }
        return director;
    }

    async create(data) {
        if (await this.#directorModel.existsName(data.name)) {
            throw AppError.conflict('Ya existe un director con ese nombre.');
        }

        try {
            const id = await this.#directorModel.create(data);
            return this.getById(id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw AppError.conflict('Ya existe un director con ese nombre.');
            }
            throw error;
        }
    }

    async update(id, data) {
        if (!(await this.#directorModel.exists(id))) {
            throw AppError.notFound(`No se encontró un director con ID ${id}.`);
        }

        if (data.name && await this.#directorModel.existsName(data.name, id)) {
            throw AppError.conflict('Ya existe otro director con ese nombre.');
        }

        try {
            await this.#directorModel.update(id, data);
            return this.getById(id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw AppError.conflict('Ya existe otro director con ese nombre.');
            }
            throw error;
        }
    }

    async delete(id) {
        if (!(await this.#directorModel.exists(id))) {
            throw AppError.notFound(`No se encontró un director con ID ${id}.`);
        }

        try {
            await this.#directorModel.delete(id);
        } catch (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
                throw AppError.conflict('No se puede eliminar el director porque tiene películas asociadas.');
            }
            throw error;
        }

        return { id: Number(id) };
    }
}
