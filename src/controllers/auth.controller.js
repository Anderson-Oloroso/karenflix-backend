import UserDTO from '../dtos/user.dto.js';

export default class AuthController {
    #authService;

    constructor(authService) {
        this.#authService = authService;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async register(req, res, next) {
        try {
            const dto = new UserDTO(req.body);
            const newUser = await this.#authService.register(dto.data);

            res.status(201).json({
                status: 'Success',
                message: 'Usuario registrado correctamente',
                data: newUser
            });
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const identifier = req.body.email || req.body.username;
            const { password } = req.body;
            const result = await this.#authService.login(identifier, password);

            res.status(200).json({
                status: 'Success',
                message: 'Inicio de sesión exitoso',
                data: {
                    ...result.user,
                    jwt: result.token
                }
            });
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            await this.#authService.logout(req.user.id);
            res.status(200).json({
                status: 'Success',
                message: 'Sesión cerrada exitosamente'
            });
        } catch (err) {
            next(err);
        }
    }

}
