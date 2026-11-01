import 'dotenv/config';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import Database from './db.config.js';
import UserModel from '../models/user.model.js';

const userModel = new UserModel(Database.getPool());

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await userModel.findAuthStateById(payload.id);
        if (!user || Number(payload.tokenVersion ?? 0) !== Number(user.token_version)) {
            return done(null, false);
        }

        return done(null, {
            ...payload,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        return done(error);
    }
}));

export default passport;
