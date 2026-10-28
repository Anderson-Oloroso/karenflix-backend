import CategoryDTO from '../dtos/category.dto.js';
import AppError from '../utils/appError.util.js';

export default class CategoryService {
    #categoryModel;

    constructor(categoryModel) {
        this.#categoryModel = categoryModel;
    }

    async getAll() {
        const categories = await this.#categoryModel.get();
        return CategoryDTO.fromArray(categories);
    }

    async getById(id) {
        const category = await this.#categoryModel.getById(id);

        if (!category) {
            throw AppError.notFound(`No se encontró ninguna categoría con el ID ${id}`);
        }

        return new CategoryDTO(category).data;
    }

    async create(data) {
        const nameExists = await this.#categoryModel.existsName(data.name);

        if (nameExists) {
            throw AppError.conflict('Ya existe una categoría con este nombre');
        }

        const insertId = await this.#categoryModel.create(data);

        return {
            id: insertId,
            name: data.name,
            description: data.description
        };
    }

    async update(id, data) {
        const exists = await this.#categoryModel.exists(id);

        if (!exists) {
            throw AppError.notFound(`No se puede actualizar: la categoría con ID ${id} no existe`);
        }

        if (data.name) {
            const nameConflict = await this.#categoryModel.existsName(data.name, id);

            if (nameConflict) {
                throw AppError.conflict('Ya existe otra categoría registrada con este nombre');
            }
        }

        await this.#categoryModel.update(data, id);
        return await this.getById(id);
    }

    async delete(id) {
        const exists = await this.#categoryModel.exists(id);

        if (!exists) {
            throw AppError.notFound(`No se puede eliminar: la categoría con ID ${id} no existe`);
        }

        const moviesCount = await this.#categoryModel.countMoviesByCategory(id);

        if (moviesCount > 0) {
            throw AppError.badRequest(
                `No se puede eliminar la categoría porque tiene ${moviesCount} película(s) asociada(s)`
            );
        }

        await this.#categoryModel.delete(id);

        return {
            id: Number(id),
            message: 'Categoría eliminada exitosamente'
        };
    }
}
