export default class FavoriteController {
    #favoriteService;

    constructor(favoriteService) {
        this.#favoriteService = favoriteService;
        this.getAll = this.getAll.bind(this);
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res, next) {
        try {
            const userId = req.user.id ?? req.user.sub;
            const favorites = await this.#favoriteService.getByUser(userId);

            return res.status(200).json({
                status: 'success',
                total: favorites.length,
                data: favorites
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const userId = req.user.id ?? req.user.sub;
            const favorite = await this.#favoriteService.create(
                userId,
                Number(req.body.movie_id)
            );

            return res.status(201).json({
                status: 'success',
                message: 'Película agregada a favoritos',
                data: favorite
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const userId = req.user.id ?? req.user.sub;
            const result = await this.#favoriteService.delete(
                Number(req.params.id),
                userId
            );

            return res.status(200).json({
                status: 'success',
                message: 'Favorito eliminado correctamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}