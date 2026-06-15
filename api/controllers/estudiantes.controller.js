import EstudiantesService from "../services/estudiantes.service.js";

export default class EstudiantesController {
    constructor() {
        this.service = new EstudiantesService();
    }

    async getAll(req, res) {
        try {

            const { filter, limit, offset, order} = req;
            const estudiantes = await this.service.getAll(filter, limit, offset, order);
            res.json(estudiantes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los estudiantes' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const estudiante = await this.service.getById(id);
            if (!estudiante) {
                return res.status(404).json({ error: 'Estudiante no encontrado' });
            }
            res.json({ respuesta: estudiante });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el estudiante' });
        }
    }

    async create(req, res) {
        try {
            const nuevoEstudiante = await this.service.create(req.body);
            res.status(200).json({ respuesta: nuevoEstudiante });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el estudiante' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const estudianteActualizado = await this.service.update(id, req.body);
            if (!estudianteActualizado) {
                return res.status(404).json({ error: 'Estudiante no encontrado' });
            }
            res.json({ respuesta: estudianteActualizado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el estudiante' });
        }
    }

    async borrar(req, res) {
        try {
            const { id } = req.params;
            const idUsuarioModificacion = req.usuario?.id_usuario || 1; 
            const estudianteEliminado = await this.service.borrar(id, idUsuarioModificacion);
            if (!estudianteEliminado) {
                return res.status(404).json({ error: 'Estudiante no encontrado' });
            }
            res.json({ mensaje: 'Estudiante eliminado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar el estudiante' });
        }
    }
}