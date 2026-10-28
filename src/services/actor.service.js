import ActorDTO from '../dtos/actor.dto.js';
import AppError from '../utils/appError.util.js';

export default class ActorService {
    #actorModel;

    constructor(actorModel) {
        this.#actorModel = actorModel;
    }

    async getAll() {
        const actors = await this.#actorModel.get();
        return ActorDTO.fromArray(actors);
    }

    async getById(id) {
        const actor = await this.#actorModel.getById(id);

        if (!actor) {
            throw AppError.notFound(`No se encontró ningún actor con el ID ${id}`);
        }

        return new ActorDTO(actor).data;
    }

    async create(data) {
        const nameExists = await this.#actorModel.existsName(data.name);

        if (nameExists) {
            throw AppError.conflict('Ya existe un actor con este nombre');
        }

        const insertId = await this.#actorModel.create(data);

        return {
            id: insertId,
            name: data.name,
            biography: data.biography ?? null,
            birth_date: data.birth_date ?? null,
            photo_url: data.photo_url ?? null
        };
    }

    async update(id, data) {
        const exists = await this.#actorModel.exists(id);

        if (!exists) {
            throw AppError.notFound(`No se puede actualizar: el actor con ID ${id} no existe`);
        }

        if (data.name) {
            const nameConflict = await this.#actorModel.existsName(data.name, id);

            if (nameConflict) {
                throw AppError.conflict('Ya existe otro actor registrado con este nombre');
            }
        }

        await this.#actorModel.update(data, id);
        return await this.getById(id);
    }

    async delete(id) {
        const exists = await this.#actorModel.exists(id);

        if (!exists) {
            throw AppError.notFound(`No se puede eliminar: el actor con ID ${id} no existe`);
        }

        await this.#actorModel.delete(id);

        return {
            id: Number(id),
            message: 'Actor eliminado exitosamente'
        };
    }
}
