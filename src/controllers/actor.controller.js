export default class ActorController {
    #actorService;

    constructor(actorService) {
        this.#actorService = actorService;
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res, next) {
        try {
            const actors = await this.#actorService.getAll();

            return res.status(200).json({
                status: 'Success',
                total: actors.length,
                data: actors
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const actor = await this.#actorService.getById(id);

            return res.status(200).json({
                status: 'Success',
                data: actor
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { name, biography, birth_date, photo_url } = req.body;
            const newActor = await this.#actorService.create({ name, biography, birth_date, photo_url });

            return res.status(201).json({
                status: 'Success',
                message: 'Actor creado exitosamente',
                data: newActor
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updatedActor = await this.#actorService.update(id, req.body);

            return res.status(200).json({
                status: 'Success',
                message: 'Actor actualizado exitosamente',
                data: updatedActor
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await this.#actorService.delete(id);

            return res.status(200).json({
                status: 'Success',
                message: 'Actor eliminado exitosamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
