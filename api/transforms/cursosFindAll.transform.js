import CursosFindAllDTO from "../dtos/cursosFindAll.dto.js";

const cursosFindAllTransform = (req, res, next) => {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {idCurso : "ASC"};

    const { idCurso, nombre, descripcion, idCursoEstado, order } = req.query;
    /*id, nombre, descripción y estado*/
    if (idCurso) filterObj.idCurso = Number(idCurso);
    if (nombre) filterObj.nombre = nombre;
    if (descripcion) filterObj.descripcion = descripcion;
    if (idCursoEstado) filterObj.idCursoEstado =Number(idCursoEstado);
    if (order) orderObj[order] = req.query.asc === "true" ? "ASC" : "DESC";

    req.filter = filterObj;
    req.order = orderObj;

    //DTO
    req.dto = new CursosFindAllDTO(limit, offset, filterObj,orderObj);

    next();
};


export default cursosFindAllTransform;