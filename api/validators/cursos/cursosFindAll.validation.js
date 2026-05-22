import { query, validationResult } from 'express-validator';
/*id, nombre, descripción y estado*/
const cursosFindAllValidation = [
    query('idCurso')
        .optional()
        .notEmpty().withMessage('id del curso no puede estar vacío')
        .isInt({min: 0}).withMessage('El id del curso debe ser un entero no negativo')
        .toInt(),
    query('nombre')
        .optional()
        .notEmpty().withMessage('nombre no puede estar vacío')
        .isString().withMessage('nombre debe ser una cadena de texto'),
    query('descripcion')
        .optional()
        .notEmpty().withMessage('descripcion no puede estar vacío')
        .isString().withMessage('descripcion debe ser una cadena de texto'),
    query('idCursoEstado')
        .optional()
        .isInt({min: 0}).withMessage('El id del estado del curso debe ser un entero no negativo')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 0 }).withMessage('limit debe ser un entero no negativo')
        .toInt(),
    query('offset')
        .optional()
        .isInt({ min: 0 }).withMessage('offset debe ser un entero no negativo')
        .toInt(),
    query('order')
        .optional()
        .isIn(['id_curso', 'nombre', 'descripcion', 'id_curso_estado']).withMessage('order debe ser uno de los siguientes valores: id del curso, nombre, descripcion, id del estado del curso'),
    query('asc')
        .optional()
        .isBoolean().withMessage('asc debe ser un valor booleano'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default cursosFindAllValidation;