const inscripcionesCreateTransform = (req, res, next) => {
    const { idCurso, idEstudiante, idUsuarioModificacion } = req.body;

    req.data = {
        idCurso,
        idEstudiante,
        idUsuarioModificacion
    };

    next();
};

export default inscripcionesCreateTransform;