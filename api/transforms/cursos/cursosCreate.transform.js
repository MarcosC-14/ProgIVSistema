import CursosCreateDTO from "../../dtos/cursos/cursosCreate.dto.js";

const cursosCreateTransform = (req, res, next) => {
    
    
    //DTO
        req.dto = new CursosCreateDTO(req.body);

    next();
};

export default cursosCreateTransform;