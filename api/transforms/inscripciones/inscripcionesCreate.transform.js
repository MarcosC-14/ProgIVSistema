import InscripcionesCreateDTO from "../../dtos/inscripciones/inscripcionesCreate.dto.js";

const inscripcionesCreateTransform = (req, res, next) => {
    const { idCurso, idEstudiante, idUsuarioModificacion } = req.body;

    const idCursoDTO = Number(idCurso);
    const idEstudianteDTO = Number(idEstudiante);
    const idUsuarioModificacionDTO = Number(idUsuarioModificacion);
    
    req.dto = new InscripcionesCreateDTO (
        idCursoDTO,
        idEstudianteDTO,
        idUsuarioModificacionDTO
    );

    next();
};

export default inscripcionesCreateTransform;