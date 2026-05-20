const cursosCreateTransform = (req, res, next) => {
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

export default cursosCreateTransform;