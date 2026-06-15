import estudiantesCreateDTO from "../../dtos/estudiantes/estudiantesCreate.dto.js";

const estudiantesCreateTransform = (req, res, next) => {
    
    req.body = new estudiantesCreateDTO (req.body);

    next();
};

export default estudiantesCreateTransform;