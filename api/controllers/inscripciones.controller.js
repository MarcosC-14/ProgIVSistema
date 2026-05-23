import InscripcionesService from "../services/inscripciones.service.js";

export default class InscripcionesController {
    constructor() {
        this.service = new InscripcionesService();
    }

    // Maneja la petición GET /api/v1/inscripciones
    getAll = async (req, res) => {
        try {
            // Los atributos req.filter, req.limit, req.offset y req.order 
            // fueron inyectados y normalizados por el middleware de transformación
            const resultado = await this.service.getAll(
                req.filter,
                req.limit,
                req.offset,
                req.order
            );

            return res.status(200).json({
                status: "success",
                totalInscripciones: resultado.totalInscripciones,
                count: resultado.length,
                data: resultado.respuesta
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error interno al obtener el listado de inscripciones",
                detail: error.message
            });
        }
    };

    // Maneja la petición POST /api/v1/inscripciones
    create = async (req, res) => {
        try {
            // req.data fue saneado por el middleware de transformación de alta
            const nuevaInscripcion = await this.service.create(req.data);

            return res.status(201).json({
                status: "success",
                message: "Inscripción registrada exitosamente",
                data: nuevaInscripcion
            });
        } catch (error) {
            // Captura de errores de reglas de negocio (cupo máximo o duplicados)
            // definidos mediante throw new Error() en la capa de servicio
            const erroresNegocio = [
                "El estudiante ya está registrado en el curso.",
                "El curso no existe.",
                "El curso alcanzó su máximo de inscripciones."
            ];

            if (erroresNegocio.includes(error.message)) {
                return res.status(400).json({
                    status: "fail",
                    message: error.message
                });
            }

            // Error genérico del sistema (ej. fallo de conexión con la base de datos)
            return res.status(500).json({
                status: "error",
                message: "Fallo estructural al procesar la inscripción",
                detail: error.message
            });
        }
    };
}