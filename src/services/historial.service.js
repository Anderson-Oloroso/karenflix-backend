import HistorialDto from '../dtos/hitorial.dto.js';

export default class HistorialService {
    #historialModel;

    constructor(historialModel) {
        this.#historialModel = historialModel;
    }

    async getByUserId(userId, filters) {
        const entries = await this.#historialModel.getByUserId(userId, filters);
        return HistorialDto.fromArray(entries);
    }
}