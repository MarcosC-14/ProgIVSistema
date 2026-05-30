import CursosFindAllDTO from "../../dtos/cursos/cursosFindAll.dto.js";

const cursosFindAllTransform = (req, res, next) => {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const filterObj = {};
    const orderObj = {id_curso: "ASC"};
    
    const idCursoQuery = req.query.idCurso
    const terminoQuery = req.query.termino || req.query.nombre || req.query.descripcion;
    
    const estadoQuery = req.query.idCursoEstado;

    const order = req.query.order;
    const asc = req.query.asc;

    /*id, nombre, descripción y estado*/
    if (idCursoQuery){
        filterObj.id_curso = Number(idCursoQuery);
    } 
    
    if (terminoQuery) {
        filterObj.termino = String(terminoQuery).trim();
    }

    if (estadoQuery) {
        if (Array.isArray(estadoQuery)) {
            // Si son varios, mapeamos cada uno a entero
            filterObj.id_curso_estado = estadoQuery.map(id => parseInt(id, 10));
        } else {
            // Si es uno solo, lo hacemos entero directo
            filterObj.id_curso_estado = parseInt(estadoQuery, 10);
        }
    }
    if (order) {
        delete orderObj.id_curso;
        orderObj[order] = asc === "true" ? "ASC" : "DESC";

    }

    req.filter = filterObj;
    req.order = orderObj;

    //DTO
    req.dto = new CursosFindAllDTO(limit, offset, filterObj,orderObj);

    next();
};


export default cursosFindAllTransform;