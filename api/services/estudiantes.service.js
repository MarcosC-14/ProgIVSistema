import EstudiantesRepository from "../repositories/estudiantes.repository.js";
import EstudianteResponseDTO from "../dtos/estudiantes/estudiante.response.dto.js";
import BaseService from './base.services.js';

export default class EstudiantesService extends BaseService {

    static KEYS_MAP = {
        idEstudiante: 'id_estudiante',
        documento: 'documento',
        apellido: 'apellido',
        nombres: 'nombres',
        email: 'email',
        fechaNacimiento: 'fecha_nacimiento',
        activo: 'activo',
        idUsuarioModificacion: 'id_usuario_modificacion',
        termino: 'termino'
    };

    constructor() {
        super();
        this.repository = new EstudiantesRepository();
    }

    async getAll(filter, limit, offset, order) {
        const sqlFilter = this.mapKeysToColumns(filter, EstudiantesService.KEYS_MAP);
        const sqlOrder = this.mapKeysToColumns(order, EstudiantesService.KEYS_MAP);

        const respuestaBD = await this.repository.getAll(sqlFilter, limit, offset, sqlOrder);
        const lista = respuestaBD.rows.map(estudiante => (new EstudianteResponseDTO(estudiante)));
        return {
            respuesta: lista,
            totalEstudiantes: respuestaBD.total
        };
    }
    
    async getById(id) {
        const estudianteBD = await this.repository.getById(id);
        if (!estudianteBD) {
            throw new Error ("Estudiante no encontrado");
        }
        return new EstudianteResponseDTO(estudianteBD);
    }

    async create(data) {
        const nuevoEstudiante = await this.repository.create(data);
        return new EstudianteResponseDTO(nuevoEstudiante);
    }

    async update(id, data) {
        await this.getById(id);
        const nuevoEstudiante = await this.repository.update(id, data);
        return new EstudianteResponseDTO(nuevoEstudiante);
    }

    async borrar(id, data) {
        const estudianteBorrado = await this.repository.borrar(id, data);
        if (!estudianteBorrado) {
            return null;
        }
        return {id: estudianteBorrado.id_estudiante, mensaje: "Estudiante eliminado correctamente"};
    }
}