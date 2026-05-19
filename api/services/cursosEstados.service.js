import CursosEstadosRepository from "../repositories/cursosEstados.repository.js";

export default class CursosEstadosService {
    constructor() {
        this.repository = new CursosEstadosRepository();
    }

    async getAll() {
        const estadosBD = await this.repository.getAll();
        
        // Mapeamos a camelCase para que mantenga coherencia con el resto del sistema
        return estadosBD.map(est => ({
            idCursoEstado: est.id_curso_estado,
            descripcion: est.descripcion
        }));
    }
}