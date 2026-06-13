import EstudiantesUpdateDTO from "../../dtos/estudiantes/estudiantesUpdate.dto.js";

const estudiantesUpdateTransform = (req, res, next) => {
    req.id = req.params.id;

    req.body = new EstudiantesUpdateDTO(req.body);
    next();
};

export default estudiantesUpdateTransform;