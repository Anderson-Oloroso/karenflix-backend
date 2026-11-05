export default class HistorialController {
    #historialService;

    constructor(historialService) {
        this.#historialService = historialService;
        this.getMine = this.getMine.bind(this);
    }

    async getMine(req, res, next) {
        try {
            const userId = req.user?.id ?? req.user?.sub;
            const entries = await this.#historialService.getByUserId(userId, req.query);

            return res.status(200).json({
                status: 'success',
                total: entries.length,
                data: entries
            });
        } catch (error) {
            next(error);
        }
    }
}