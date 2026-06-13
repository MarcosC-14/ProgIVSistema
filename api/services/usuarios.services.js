import UsuariosRepository from "../repositories/usuarios.repository.js";
import BaseService from "./base.services.js"; 
import crypto from 'crypto'; 

export default class UsuariosService extends BaseService {
    static KEYS_MAP = {
        idUsuario: 'id_usuario',
        apellido: 'apellido',
        nombre: 'nombre',
        nombreUsuario: 'nombre_usuario',
        contrasenia: 'contrasenia',
        activo: 'activo'
    }

    constructor() {
        super();
        this.repository = new UsuariosRepository();
    }

    async verificarCredenciales(username, password) {
        const usuario = await this.repository.getByNombreUsuario(username);

        if (!usuario || usuario.activo !== 1) {
            return null;
        }

        const contraseniaHasheada = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        if (usuario.contrasenia !== contraseniaHasheada) {
            return null;
        }

        return {
            idUsuario: usuario.id_usuario,
            nombreUsuario: usuario.nombre_usuario,
            nombreCompleto: `${usuario.nombre} ${usuario.apellido}`
        };
    }

    async verificarUsuarioPorId(id) {
        const usuario = await this.repository.getById(id);
        if (!usuario || usuario.activo !== 1) {
            return null;
        }
        return usuario;
    }
}