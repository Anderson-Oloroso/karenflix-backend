export default class CategoryController {
    #categoryService;

    constructor(categoryService) {
        this.#categoryService = categoryService;
        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res, next) {
        try {
            const categories = await this.#categoryService.getAll();

            return res.status(200).json({
                status: 'Success',
                total: categories.length,
                data: categories
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const category = await this.#categoryService.getById(id);

            return res.status(200).json({
                status: 'Success',
                data: category
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { name, description } = req.body;
            const newCategory = await this.#categoryService.create({ name, description });

            return res.status(201).json({
                status: 'Success',
                message: 'Categoría creada exitosamente',
                data: newCategory
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updatedCategory = await this.#categoryService.update(id, req.body);

            return res.status(200).json({
                status: 'Success',
                message: 'Categoría actualizada exitosamente',
                data: updatedCategory
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await this.#categoryService.delete(id);

            return res.status(200).json({
                status: 'Success',
                message: 'Categoría eliminada exitosamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
