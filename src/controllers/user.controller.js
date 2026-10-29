import UserDTO from '../dtos/user.dto.js';

export default class UserController {
    #userService;

    constructor(userService) {
        this.#userService = userService;
        this.getAll = this.getAll.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.deleteProfile = this.deleteProfile.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res, next) {
        try {
            const users = await this.#userService.getAll();

            res.status(200).json({
                status: 'Success',
                total: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const user = await this.#userService.getById(req.user.id);
            const toIsoDate = timestamp =>
                timestamp ? new Date(timestamp * 1000).toISOString() : null;

            res.status(200).json({
                status: 'Success',
                data: {
                    ...user,
                    iat: toIsoDate(req.user.iat),
                    exp: toIsoDate(req.user.exp)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const dto = new UserDTO(req.body);
            const user = await this.#userService.update(req.user.id, dto.data);

            res.status(200).json({
                status: 'Success',
                message: 'Perfil actualizado correctamente',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteProfile(req, res, next) {
        try {
            const result = await this.#userService.delete(req.user.id);

            if (res.clearCookie) {
                res.clearCookie('access_token');
            }

            res.status(200).json({
                status: 'Success',
                message: 'Cuenta eliminada correctamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const dto = new UserDTO(req.body);
            const user = await this.#userService.update(req.params.id, dto.data);

            res.status(200).json({
                status: 'Success',
                message: 'Usuario actualizado correctamente',
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const result = await this.#userService.delete(req.params.id);

            res.status(200).json({
                status: 'Success',
                message: 'Cuenta de usuario eliminada correctamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
