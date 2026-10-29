import FavoriteDTO from '../dtos/favorite.dto.js';
import AppError from '../utils/appError.util.js';

export default class FavoriteService {
    #favoriteModel;

    constructor(favoriteModel) {
        this.#favoriteModel = favoriteModel;
    }

    async getByUser(userId) {
        const favorites = await this.#favoriteModel.getByUser(userId);
        return FavoriteDTO.fromArray(favorites);
    }

    async create(userId, movieId) {
        const movieExists = await this.#favoriteModel.movieExists(movieId);
        if (!movieExists) {
            throw AppError.notFound(`La película con ID ${movieId} no existe`);
        }

        const favoriteExists = await this.#favoriteModel.existsByUserAndMovie(userId, movieId);
        if (favoriteExists) {
            throw AppError.conflict('La película ya está en tus favoritos');
        }

        let favoriteId;
        try {
            favoriteId = await this.#favoriteModel.create({
                user_id: userId,
                movie_id: movieId
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw AppError.conflict('La película ya está en tus favoritos');
            }
            throw error;
        }

        const favorite = await this.#favoriteModel.getByIdForUser(favoriteId, userId);
        if (!favorite) {
            throw AppError.internal('No se pudo recuperar el favorito recién creado');
        }

        return new FavoriteDTO(favorite).data;
    }

    async delete(id, userId) {
        const deleted = await this.#favoriteModel.deleteByUser(id, userId);
        if (!deleted) {
            throw AppError.notFound(`No se encontró el favorito con ID ${id}`);
        }

        return { id: Number(id) };
    }
}
