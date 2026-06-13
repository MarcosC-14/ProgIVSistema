import passport from 'passport';
import jwt from 'jsonwebtoken';

export default class AuthController {
    
    async login(req, res, next) {
        
        passport.authenticate('local', { session: false }, (err, usuario, info) => {
            
            if (err) {
                console.error("Error crítico en el proceso de autenticación:", err);
                return res.status(500).json({ error: 'Error interno del servidor al procesar el ingreso.' });
            }

            if (!usuario) {
                
                return res.status(401).json({ error: info.message || 'Credenciales inválidas.' });
            }

            try {
                const payload = { 
                    idUsuario: usuario.idUsuario, 
                    nombreUsuario: usuario.nombreUsuario 
                };

    
                const token = jwt.sign(
                    payload, 
                    process.env.JWT_SECRET, 
                    { expiresIn: '2h' }
                );

                return res.status(200).json({
                    mensaje: '¡Inicio de sesión exitoso!',
                    token: token,
                    usuario: {
                        idUsuario: usuario.idUsuario,
                        nombreUsuario: usuario.nombre_usuario,
                        nombreCompleto: usuario.nombreCompleto
                    }
                });

            } catch (tokenError) {
                console.error("Error al firmar el token JWT:", tokenError);
                return res.status(500).json({ error: 'Error al generar el token de seguridad.' });
            }

        })(req, res, next); 
    }
}