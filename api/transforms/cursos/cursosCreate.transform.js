import CursosCreateDTO from "../../dtos/cursos/cursosCreate.dto.js";

const cursosCreateTransform = (req, res, next) => {
    
    
    //DTO
        req.body.idUsuarioModificacion = Number(req.user.id_usuario);
        req.dto = new CursosCreateDTO(req.body);

    next();
};

export default cursosCreateTransform;