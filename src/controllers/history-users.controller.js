export default class HistoryUserController {
  #historyUserService;

  constructor(historyUserService) {
    this.#historyUserService = historyUserService;
    this.getUserHistory = this.getUserHistory.bind(this);
  }

  async getUserHistory(req, res, next) {
    try {
      
      const userId = req.user.id ?? req.user.sub;
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

  async createHistory(req, res, next) {
    try {
      const history = {
        user_id: req.user.id ?? req.user.sub,
        action_type: req.body.action_type,
        status_code: req.body.status_code,
        url: req.body.url
      };
      const result = await this.#historyUserService.createHistory(history);

      return res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}   
