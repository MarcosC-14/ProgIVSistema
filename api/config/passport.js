import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import UsuariosService from '../services/usuarios.services.js';
const service = new UsuariosService();

export const localStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await service.verificarCredenciales(username, password);
        if (!user) {
            return done(null, false, { message: 'Nombre de usuario y/o contraseña incorrectos.' });
        }
        return done(null, user, { message: '¡Login correcto!' });
    } catch (error) {
        return done(error);
    }
});

export const jwtStrategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, done) => {
    try {
        const user = await service.verificarUsuarioPorId(jwtPayload.idUsuario);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Token inválido o usuario dado de baja.' });
        }
    } catch (error) {
        return done(error, false);
    }
});