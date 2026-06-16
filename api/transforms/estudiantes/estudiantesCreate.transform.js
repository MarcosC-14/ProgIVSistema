import estudiantesCreateDTO from "../../dtos/estudiantes/estudiantesCreate.dto.js";

const estudiantesCreateTransform = (req, res, next) => {
        
    req.body.id_usuario_modificacion = Number(req.user.id_usuario);
    req.body = new estudiantesCreateDTO (req.body);
    next();
};

export default estudiantesCreateTransform;