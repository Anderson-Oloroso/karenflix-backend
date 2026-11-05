import AppError from '../utils/appError.util.js';
import { ROLES } from '../constants/role.constant.js';

export default class HistoryUserController {
  #historyUserService;

  constructor(historyUserService) {
    this.#historyUserService = historyUserService;
    this.getUserHistory = this.getUserHistory.bind(this);
  }

  async getUserHistory(req, res, next) {
    try {
      const userId = Number(req.params.id);
      const authenticatedUserId = Number(req.user.id ?? req.user.sub);
      if (userId !== authenticatedUserId && req.user.role !== ROLES.ADMIN) {
        throw AppError.forbidden('Solo puedes consultar tu propio historial.');
      }

      const filters = {
        action_type: req.query.action_type || null,
        start_date: req.query.start_date || null,
        end_date: req.query.end_date || null
      };
      const history = await this.#historyUserService.getUserHistory(userId, filters);

      return res.status(200).json({
        status: 'success',
        data: history
      });
    } catch (error) {
      next(error);
    }
  }
}
