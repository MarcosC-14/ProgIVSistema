import CursosEstadosRepository from "../repositories/cursosEstados.repository.js";
import CursosEstadosResponseDTO from "../dtos/cursosEstados.response.dto.js";
import BaseService from "./base.services.js";

export default class CursosEstadosService extends BaseService{
    
    static KEYS_MAP = {
        idCursoEstado: 'id_curso_estado',
        descripcion: 'descripcion',
        esActivo: 'es_activo'
    };

    constructor() {
        super();
        this.repository = new CursosEstadosRepository();
    }

    async getAll() {
        const estadosBD = await this.repository.getAll();
        const respuesta = estadosBD.map(estado => (new CursosEstadosResponseDTO(estado)));
        return respuesta;
    }
}