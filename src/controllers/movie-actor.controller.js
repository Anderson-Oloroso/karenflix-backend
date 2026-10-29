export default class MovieActorController {
    #movieActorService;

    constructor(movieActorService) {
        this.#movieActorService = movieActorService;
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.getByMovieId = this.getByMovieId.bind(this);
        this.getByActorId = this.getByActorId.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res, next) {
        try {
            const filters = {
                movie_id: req.query.movie_id ? Number(req.query.movie_id) : null,
                actor_id: req.query.actor_id ? Number(req.query.actor_id) : null
            };

            const items = await this.#movieActorService.getAll(filters);

            return res.status(200).json({
                status: 'success',
                total: items.length,
                data: items
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            const item = await this.#movieActorService.getById(id);

            return res.status(200).json({
                status: 'success',
                data: item
            });
        } catch (error) {
            next(error);
        }
    }

    async getByMovieId(req, res, next) {
        try {
            const movieId = Number(req.params.movieId);
            const items = await this.#movieActorService.getByMovieId(movieId);

            return res.status(200).json({
                status: 'success',
                total: items.length,
                data: items
            });
        } catch (error) {
            next(error);
        }
    }

    async getByActorId(req, res, next) {
        try {
            const actorId = Number(req.params.actorId);
            const items = await this.#movieActorService.getByActorId(actorId);

            return res.status(200).json({
                status: 'success',
                total: items.length,
                data: items
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const created = await this.#movieActorService.create({
                movie_id: Number(req.body.movie_id),
                actor_id: Number(req.body.actor_id),
                character_name: req.body.character_name
            });

            return res.status(201).json({
                status: 'success',
                message: 'Actor asignado a la película correctamente',
                data: created
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            const updated = await this.#movieActorService.update(id, req.body);

            return res.status(200).json({
                status: 'success',
                message: 'Asignación actualizada correctamente',
                data: updated
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = Number(req.params.id);
            const result = await this.#movieActorService.delete(id);

            return res.status(200).json({
                status: 'success',
                message: 'Asignación eliminada correctamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
