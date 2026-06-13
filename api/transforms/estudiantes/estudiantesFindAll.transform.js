import EstudiantesFindAllDTO from "../../dtos/estudiantes/estudiantesFindAll.dto.js";

const estudiantesFindAllTransform = (req, res, next) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {idEstudiante : "ASC"};

    const idEstudianteQuery = req.query.id_estudiante;
    const terminoQuery = req.query.termino || req.query.nombres || req.query.apellido;
    const documentoQuery = req.query.documento;

    const order = req.query.order;
    const asc = req.query.asc;

    if (idEstudianteQuery) {
        filterObj.idEstudiante = Number(idEstudianteQuery);
    }

    if (terminoQuery){
        filterObj.termino = String(terminoQuery).trim();
    }

    if (documentoQuery) {
        filterObj.documento = String(documentoQuery).trim();
    }

    if(order){
        delete orderObj.id_estudiante;
        orderObj[order] = asc === "true" ? "ASC" : "DESC";
    }

    req.filter = filterObj;
    req.order = orderObj;

    req.limit = limit;
    req.offset = offset;

    next();
};

export default estudiantesFindAllTransform;