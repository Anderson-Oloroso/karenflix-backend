import AuthDTO from '../dtos/user.dto.js';

export default class AuthController {
    #authService;

    constructor(authService) {
        this.#authService = authService;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.profile = this.profile.bind(this);
    }

    async register(req, res, next) {
        try {
            const dto = new AuthDTO(req.body);
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

            if (res.cookie) {
                res.cookie('access_token', result.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000
                });
            }

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
            if (res.clearCookie) {
                res.clearCookie('access_token');
            }
            res.status(200).json({
                status: 'Success',
                message: 'Sesión cerrada exitosamente'
            });
        } catch (err) {
            next(err);
        }
    }

    async profile(req, res, next) {
        try {
            const { iat, exp, ...user } = req.user;
            const toIsoDate = (timestamp) =>
                timestamp ? new Date(timestamp * 1000).toISOString() : null;

            res.status(200).json({
                status: 'Success',
                data: {
                    ...user,
                    iat: toIsoDate(iat),
                    exp: toIsoDate(exp)
                }
            });
        } catch (err) {
            next(err);
        }
    }
}
