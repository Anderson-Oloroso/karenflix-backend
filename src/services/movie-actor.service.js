import MovieActorDTO from '../dtos/movie-actor.dto.js';
import AppError from '../utils/appError.util.js';

export default class MovieActorService {
    #movieActorModel;

    constructor(movieActorModel) {
        this.#movieActorModel = movieActorModel;
    }

    async getAll(filters = {}) {
        if (filters.movie_id) {
            return this.getByMovieId(filters.movie_id);
        }

        if (filters.actor_id) {
            return this.getByActorId(filters.actor_id);
        }

        const rows = await this.#movieActorModel.getAll();
        return MovieActorDTO.fromArray(rows);
    }

    async getById(id) {
        const item = await this.#movieActorModel.getById(id);
        if (!item) {
            throw AppError.notFound(`No se encontró la asignación con ID ${id}`);
        }
        return new MovieActorDTO(item).data;
    }

    async getByMovieId(movieId) {
        const movieExists = await this.#movieActorModel.movieExists(movieId);
        if (!movieExists) {
            throw AppError.notFound(`La película con ID ${movieId} no existe`);
        }

        const rows = await this.#movieActorModel.getByMovieId(movieId);
        return MovieActorDTO.fromArray(rows);
    }

    async getByActorId(actorId) {
        const actorExists = await this.#movieActorModel.actorExists(actorId);
        if (!actorExists) {
            throw AppError.notFound(`El actor con ID ${actorId} no existe`);
        }

        const rows = await this.#movieActorModel.getByActorId(actorId);
        return MovieActorDTO.fromArray(rows);
    }

    async create(data) {
        const movieId = Number(data.movie_id);
        const actorId = Number(data.actor_id);

        const movieExists = await this.#movieActorModel.movieExists(movieId);
        if (!movieExists) {
            throw AppError.notFound(`La película con ID ${movieId} no existe`);
        }

        const actorExists = await this.#movieActorModel.actorExists(actorId);
        if (!actorExists) {
            throw AppError.notFound(`El actor con ID ${actorId} no existe`);
        }

        const relationExists = await this.#movieActorModel.existsRelation(movieId, actorId);
        if (relationExists) {
            throw AppError.conflict('El actor ya se encuentra asignado a esta película');
        }

        const insertId = await this.#movieActorModel.create({
            movie_id: movieId,
            actor_id: actorId,
            character_name: data.character_name ?? null
        });

        const created = await this.#movieActorModel.getById(insertId);
        if (!created) {
            throw AppError.internal('No se pudo recuperar el registro recién creado');
        }

        return new MovieActorDTO(created).data;
    }

    async update(id, data) {
        const existing = await this.#movieActorModel.getById(id);
        if (!existing) {
            throw AppError.notFound(`No se encontró la asignación con ID ${id}`);
        }

        const targetMovieId = data.movie_id ? Number(data.movie_id) : existing.movie_id;
        const targetActorId = data.actor_id ? Number(data.actor_id) : existing.actor_id;

        if (data.movie_id) {
            const movieExists = await this.#movieActorModel.movieExists(targetMovieId);
            if (!movieExists) {
                throw AppError.notFound(`La película con ID ${targetMovieId} no existe`);
            }
        }

        if (data.actor_id) {
            const actorExists = await this.#movieActorModel.actorExists(targetActorId);
            if (!actorExists) {
                throw AppError.notFound(`El actor con ID ${targetActorId} no existe`);
            }
        }

        if (data.movie_id || data.actor_id) {
            const relationExists = await this.#movieActorModel.existsRelation(targetMovieId, targetActorId, id);
            if (relationExists) {
                throw AppError.conflict('Ya existe otra asignación con esta película y actor');
            }
        }

        await this.#movieActorModel.update(id, data);
        const updated = await this.#movieActorModel.getById(id);
        return new MovieActorDTO(updated).data;
    }

    async delete(id) {
        const deleted = await this.#movieActorModel.delete(id);
        if (!deleted) {
            throw AppError.notFound(`No se encontró la asignación con ID ${id}`);
        }
        return { id: Number(id) };
    }
}
