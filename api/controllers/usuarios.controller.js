import UsuariosRepository from "../repositories/usuarios.repository.js";

export default class UsuariosController {
    constructor() {
        this.usuariosRepository = new UsuariosRepository();
    }

    async register(req, res) {
        const { apellido, nombre, nombre_usuario, contrasenia } = req.body;

        try {
            if (!apellido || !nombre || !nombre_usuario || !contrasenia) {
                return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
            }

            const nuevoUsuario = await this.usuariosRepository.create({
                apellido,
                nombre,
                nombre_usuario,
                contrasenia
            });

            return res.status(201).json({
                mensaje: "Usuario registrado con éxito",
                usuario: nuevoUsuario
            });

        } catch (error) {
            return res.status(500).json({ mensaje: error.message });
        }
    }

    async login(req, res) {
        const { nombre_usuario, contrasenia } = req.body;

        try {
            if (!nombre_usuario || !contrasenia) {
                return res.status(400).json({ mensaje: "Usuario y contraseña requeridos." });
            }

            const usuarioValido = await this.usuariosRepository.verifyCredentials(nombre_usuario, contrasenia);

            if (!usuarioValido) {
                return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos." });
            }

            return res.json({
                mensaje: "Autenticación exitosa",
                token: "token-jwt-seguro-uner", 
                usuario: usuarioValido.nombre_usuario
            });

      } catch (error) {
            console.error("Error detallado en el controlador de login:", error);
            return res.status(500).json({ mensaje: "Error interno en el sistema de login.", error: error.message });
        }
    }
}