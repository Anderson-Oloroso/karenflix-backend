export default class DirectorController {
    #directorService;

    constructor(directorService) {
        this.#directorService = directorService;
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(_req, res, next) {
        try {
            const directors = await this.#directorService.getAll();
            return res.status(200).json({
                status: 'success',
                total: directors.length,
                data: directors
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const includeMovies = req.query.includeMovies === 'true';
            const director = await this.#directorService.getById(req.params.id, includeMovies);
            return res.status(200).json({ status: 'success', data: director });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const director = await this.#directorService.create(req.body);
            return res.status(201).json({
                status: 'success',
                message: 'Director creado correctamente.',
                data: director
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const director = await this.#directorService.update(req.params.id, req.body);
            return res.status(200).json({
                status: 'success',
                message: 'Director actualizado correctamente.',
                data: director
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const result = await this.#directorService.delete(req.params.id);
            return res.status(200).json({
                status: 'success',
                message: 'Director eliminado correctamente.',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
