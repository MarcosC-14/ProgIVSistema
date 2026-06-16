import CursosUpdateDTO from "../../dtos/cursos/cursosUpdate.dto.js";

const cursosUpdateTransform = (req, res, next) => {
    req.id = req.params.id;

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
    req.body.idUsuarioModificacion = Number(req.user.id_usuario);
    req.dto = new CursosUpdateDTO(req.body);

    next();
};

export default cursosUpdateTransform;