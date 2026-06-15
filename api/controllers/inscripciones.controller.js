import InscripcionesService from "../services/inscripciones.service.js";

export default class InscripcionesController {
    constructor() {
        this.service = new InscripcionesService();
    }

    getAll = async (req, res) => {
        try {
            const resultado = await this.service.getAll(req.dto);
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

    async getById(req,res){
        try{
            const inscripcion = await this.service.getById(req.id);

            return res.status(200).json({
                status: "success",
                message: "Inscripción obtenida exitosamente",
                data: inscripcion
            });
        } catch(error){
            if(error.message === "Inscripción no encontrada"){
                return res.status(400).json({
                    status: "fail",
                    message: error.message
                });
            }

            return res.status(500).json({
                status: "error",
                message: "Fallo estructural al procesar la inscripción",
                detail: error.message
            });
        }
    }

    async create(req, res){
        try {
            const nuevaInscripcion = await this.service.create(req.dto);

            return res.status(201).json({
                status: "success",
                message: "Inscripción registrada exitosamente",
                data: nuevaInscripcion
            });
        } catch (error) {
            const erroresNegocio = [
                "El estudiante ya está registrado en el curso.",
                "El curso no existe.",
                "El curso no admite inscripciones.",
                "El curso alcanzó su máximo de inscripciones."
            ];

            if (erroresNegocio.includes(error.message)) {
                return res.status(400).json({
                    status: "fail",
                    message: error.message
                });
            }
            return res.status(500).json({
                status: "error",
                message: "Fallo estructural al procesar la inscripción",
                detail: error.message
            });
        }
    };

    async borrar(req,res){
        try{
            const inscripcionBorrada = await this.service.borrar(req.id);
            if (!inscripcionBorrada) throw new Error('La inscripción no existe');
            
            return res.status(200).json({
                status: "success",
                message: "Inscripción borrada exitosamente",
                data: inscripcionBorrada
            });
        } catch (error){
            console.error(error);
            if(error.message === 'La inscripción no existe'){
                return res.status(404).json({
                    status: "fail",
                    message: error.message
                });
            }

            return res.status(500).json({
                status: "error",
                message: "Fallo estructural al procesar la eliminación de la inscripción",
                detail: error.message
            });
        }
    }

    async generarDiploma(req, res){
        try{
            const diplomaGenerado = await this.service.generarDiploma(req.id); 
            if (!diplomaGenerado) throw new Error('La inscripcion no existe.');
            
            res.set(diplomaGenerado.headers);

            return res.status(200).send(diplomaGenerado.buffer);
        }catch(error){
            console.error(error);
            if(error.message === 'La inscripción no existe'){
                return res.status(404).json({
                    status: "fail",
                    message: error.message
                });
            }

            return res.status(500).json({
                status: "error",
                message: "Fallo estructural al procesar la generacion de diploma",
                detail: error.message
            });
        }

    }
}