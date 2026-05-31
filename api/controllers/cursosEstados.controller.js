import CursosEstadosService from "../services/cursosEstados.service.js";

export default class CursosEstadosController {
    constructor() {
        this.service = new CursosEstadosService();
    }

    async getAll(req, res) {
        try {
            const estados = await this.service.getAll();
            res.status(200).json(estados);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los estados de los cursos' });
        }
    }
}