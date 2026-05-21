import CursosCreateDTO from "../dtos/cursosCreate.dto.js";

const cursosCreateTransform = (req, res, next) => {
    
    /* No es necesario por uso de DTO. Hace lo mismo
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
    */
    //DTO
        req.dto = new CursosCreateDTO(req.body);

    next();
};

export default cursosCreateTransform;