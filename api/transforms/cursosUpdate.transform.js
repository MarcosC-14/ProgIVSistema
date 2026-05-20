const cursosUpdateTransform = (req, res, next) => {
    req.id = req.params.id;
    const { nombre, descripcion, fechaInicio, cantidadHoras, inscriptosMax, idCursoEstado, idUsuarioModificacion} = req.body;

    req.data = {
        nombre,
        descripcion,
        fechaInicio,
        cantidadHoras,
        inscriptosMax,
        idCursoEstado,
        idUsuarioModificacion
    };

    next();
};

export default cursosUpdateTransform;