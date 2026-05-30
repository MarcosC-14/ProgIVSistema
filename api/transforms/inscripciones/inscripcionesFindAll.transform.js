import InscripcionesFindAllDTO from "../../dtos/inscripciones/inscripcionesFindAll.dto.js";

const inscripcionesFindAllTransform = (req, res, next) => {
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;
    const offset = req.query.offset !== undefined ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {};

    const { 
        idInscripcion,
        idCurso, 
        idEstudiante, 
        estudianteTermino,
        order, 
        asc 
    } = req.query;

    if (idInscripcion) filterObj.idInscripcion =Number(idInscripcion);
    if (idCurso) filterObj.idCurso =Number(idCurso);
    if (idEstudiante) filterObj.idEstudiante = Number(idEstudiante);
    if (estudianteTermino) filterObj.estudianteTermino = estudianteTermino;

    if (order) {
        orderObj[order] = asc === "true" ? "ASC" : "DESC";
    } else{
        orderObj['idInscripcion'] = "DESC";
    }
    
    req.dto = new InscripcionesFindAllDTO(filterObj,limit,offset,orderObj);
    next();
};

export default inscripcionesFindAllTransform;