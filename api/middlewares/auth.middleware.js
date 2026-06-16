import passport from 'passport';

export const verificarToken = (req, res, next) => {
    
    passport.authenticate('jwt', { session: false }, (err, usuario, info) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error interno en el servidor de autenticación' });
        }
        
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Acceso denegado. Token inválido o inexistente.' });
        }
        
        req.user = usuario;
        next();
    })(req, res, next);
};