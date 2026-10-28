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
    }

    async create(req, res) {
        try {
            const movie = {
                ...req.body,
                status: req.body.status || 'pending',
                created_by: req.user?.id || req.user?.sub || req.body.created_by
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
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const filters = {
                category: req.query.category,
                title: req.query.title
            };

            const movies = await this.#movieService.getAll(filters);

            return res.status(200).json({
                status: 'success',
                total: movies.length,
                data: movies
            });
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const movie = await this.#movieService.getById(id);

            return res.status(200).json({
                status: 'success',
                data: movie
            });
        } catch (error) {
            return res.status(404).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            await this.#movieService.update(id, req.body);

            return res.status(200).json({
                status: 'success',
                message: 'Película actualizada correctamente'
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async approve(req, res) {
        try {
            const { id } = req.params;
            await this.#movieService.approve(id);

            return res.status(200).json({
                status: 'success',
                message: 'Película aprobada correctamente'
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await this.#movieService.deleteMovie(id);

            return res.status(200).json({
                status: 'success',
                message: 'Película eliminada correctamente'
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
}
