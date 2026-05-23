const inscripcionesFindAllTransform = (req, res, next) => {
    req.limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;
    req.offset = req.query.offset !== undefined ? Number(req.query.offset) : 0;

    const filterObj = {};
    /// ESTO TÉCNICAMENTE DEBERÍA FUNCIONAR COMO VIMOS EN BASE DE DATOS CON MARIANO
    const orderObj = { idInscripcion: "DESC" };

    const { 
        idCurso, 
        idEstudiante, 
        cursoNombre, 
        estudianteApellido, 
        estudianteDocumento, 
        order, 
        asc 
    } = req.query;

    if (idCurso) filterObj.idCurso = idCurso;
    if (idEstudiante) filterObj.idEstudiante = idEstudiante;
    if (cursoNombre) filterObj.cursoNombre = cursoNombre;
    if (estudianteApellido) filterObj.estudianteApellido = estudianteApellido;
    if (estudianteDocumento) filterObj.estudianteDocumento = estudianteDocumento;

    if (order) {
        for (const prop of Object.keys(orderObj)) {
            delete orderObj[prop];
        }
        orderObj[order] = asc === "true" ? "ASC" : "DESC";
    }

    req.filter = filterObj;
    req.order = orderObj;

    next();
};

export default inscripcionesFindAllTransform;