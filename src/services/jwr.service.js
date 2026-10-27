import jwt from 'jsonwebtoken';

export class JwtService {
    constructor(secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRES_IN || '24h') {
        if (!secret) {
            throw new Error('JWT_SECRET no configurado en variables de entorno.');
        }
        this.secret = secret;
        this.expiresIn = expiresIn;
    }

    sign(payload) {
        return jwt.sign(payload, this.secret, {
            algorithm: 'HS256',
            expiresIn: this.expiresIn
        });
    }

    verify(token) {
        try {
            return jwt.verify(token, this.secret, { algorithms: ['HS256'] });
        } catch (error) {
            return null;
        }
    }
}