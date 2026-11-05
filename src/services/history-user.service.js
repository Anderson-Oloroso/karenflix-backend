import { HistoryUserDto } from '../dtos/history-user.dto.js';
import AppError from '../utils/appError.util.js';

export default class HistoryUserService {
  #historyUserModel;

  constructor(historyUserModel) {
    this.#historyUserModel = historyUserModel;
  }

  async createHistory(history) {
    const historyDto = new HistoryUserDto(history);
    const result = await this.#historyUserModel.createHistory(historyDto.data);
    return result;
  }

  async getUserHistory(userId, filters = {}) {
    try {
      const rows = await this.#historyUserModel.getUserById(userId, filters);
      return HistoryUserDto.fromArray(rows);
    } catch (error) {
      throw AppError.internal('Error al obtener el historial del usuario', error);
    }
  }
}
