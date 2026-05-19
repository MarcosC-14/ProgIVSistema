import CursosRepository from "../repositories/cursos.repository.js";
import CursoResponseDTO from "../dtos/curso.response.dto.js";
import BaseService from './base.services.js';

export default class CursosService extends BaseService {

    static KEYS_MAP = {
        idCurso: 'id_curso',
        nombre: 'nombre',
        descripcion: 'descripcion',
        fechaInicio: 'fecha_inicio',
        cantidadHoras: 'cantidad_horas',
        inscriptosMax: 'inscriptos_max',
        idCursoEstado: 'id_curso_estado',
        idUsuarioModificacion: 'id_usuario_modificacion',
        fechaHoraModificacion: 'fecha_hora_modificacion'
    };

    constructor() {
        super();
        this.repository = new CursosRepository();
    }

    async getAll(filter, limit, offset, order) {
        const sqlFilter = this.mapKeysToColumns(filter, CursosService.KEYS_MAP);
        const sqlOrder = this.mapKeysToColumns(order, CursosService.KEYS_MAP);

        const respuestaBD = await this.repository.getAll(sqlFilter, limit, offset, sqlOrder);
        const respuesta = respuestaBD.map(curso => (new CursoResponseDTO(curso)));
        return respuesta;
    }

    async getById(id){
        const cursoBD = await this.repository.getById(id);
        if (!cursoBD){
            throw new Error ("Curso no encontrado");
        }

        return new CursoResponseDTO(cursoBD);
    }

    async create(data){
        const nuevoCurso = await this.repository.create(data);
        return new CursoResponseDTO(nuevoCurso);
        }

    async update(id, data){
        await this.getById(id);
        const datosMap = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            fecha_inicio: data.fechaInicio,
            cantidad_horas: data.cantidadHoras,
            inscriptos_max: data.inscriptosMax,
            id_curso_estado: data.idCursoEstado,
            id_usuario_modificacion: data.idUsuarioModificacion
        };

        const nuevoCurso = await this.repository.update(id, datosMap);
        return new CursoResponseDTO(nuevoCurso);
    }
    async borrar(id){
        await this.getById(id);
 
        const nuevoCurso = await this.repository.borrar(id);
        return {id: nuevoCurso.id_curso, mensaje: "Curso eliminado correctamente"};
    }
}