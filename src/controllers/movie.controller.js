export default class MovieController {
    #movieService;

    constructor(movieService) {
        this.#movieService = movieService;
        this.create = this.create.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.approve = this.approve.bind(this);
        this.delete = this.delete.bind(this);
        this.getPending = this.getPending.bind(this);
    }

    async create(req, res, next) {
        try {
            const movie = {
                ...req.body,
                status: 'pending',
                created_by: req.user.id ?? req.user.sub
            };

            const result = await this.#movieService.create(movie);

            return res.status(201).json({
                status: 'success',
                message: 'Película creada correctamente',
                data: {
                    id: result.insertId
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const filters = {
                category: req.query.category ? Number(req.query.category) : undefined,
                title: req.query.title,
                page: Number(req.query.page || 1),
                limit: Number(req.query.limit || 20)
            };

            const result = await this.#movieService.getAll(filters);

            return res.status(200).json({
                status: 'success',
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit),
                data: result.movies
            });
        } catch (error) {
            next(error);
        }
    }

    async getPending(req, res, next) {
        try {
            const filters = {
                category: req.query.category ? Number(req.query.category) : undefined,
                title: req.query.title,
                page: Number(req.query.page || 1),
                limit: Number(req.query.limit || 20)
            };
            const result = await this.#movieService.getPending(filters);
            return res.status(200).json({
                status: 'success',
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(result.total / result.limit),
                data: result.movies
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const movie = await this.#movieService.getById(id);

            return res.status(200).json({
                status: 'success',
                data: movie
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            await this.#movieService.update(id, req.body);

            return res.status(200).json({
                status: 'success',
                message: 'Película actualizada correctamente'
            });
        } catch (error) {
            next(error);
        }
    }

    async approve(req, res, next) {
        try {
            const { id } = req.params;
            await this.#movieService.approve(id);

            return res.status(200).json({
                status: 'success',
                message: 'Película aprobada correctamente'
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await this.#movieService.deleteMovie(id);

            return res.status(200).json({
                status: 'success',
                message: 'Película eliminada correctamente'
            });
        } catch (error) {
            next(error);
        }
    }
}
