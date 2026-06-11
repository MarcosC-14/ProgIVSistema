import { body, param, validationResult } from 'express-validator';

const cursosUpdateValidation = [
    param('id')
        .exists().withMessage('El identificador del curso en la ruta es obligatorio.')
        .isInt({ min: 1 }).withMessage('El identificador del curso debe ser un número entero positivo.')
        .toInt(),

    body('nombre')
        .exists().withMessage('El campo nombre es obligatorio.')
        .isString().withMessage('El nombre debe ser una cadena de texto.')
        .trim()
        .notEmpty().withMessage('El nombre no puede estar vacío.')
        .isLength({ min: 5, max: 45 }).withMessage('El nombre debe tener entre 5 y 45 caracteres.'),
        
    body('descripcion')
        .exists().withMessage('El campo descripción es obligatorio.')
        .isString().withMessage('La descripción debe ser una cadena de texto.')
        .trim()
        .notEmpty().withMessage('La descripción no puede estar vacía.')
        .isLength({ min: 5, max: 500 }).withMessage('La descripción debe tener entre 5 y 500 caracteres.'),
        
    body('fechaInicio')
        .exists().withMessage('La fecha de inicio es obligatoria.')
        .isBefore('2100-01-01').withMessage('El año de la fecha ingresada excede el límite máximo.')
        .isDate(),

    body('cantidadHoras')
        .exists().withMessage('La cantidad de horas es obligatoria.')
        .isInt({ min: 1, max: 5000 }).withMessage('La cantidad de horas debe ser un número entero entre 1 y 5000.')
        .toInt(),

    body('inscriptosMax')
        .exists().withMessage('El cupo máximo es obligatorio.')
        .isInt({ min: 1, max: 200 }).withMessage('El cupo máximo debe ser un número entero positivo entre 1 y 10000.')
        .toInt(),

    body('idCursoEstado')
        .exists().withMessage('El estado del curso es obligatorio.')
        .isInt({ min: 1 }).withMessage('El identificador del estado debe ser un número entero válido.')
        .toInt(),

    body('idUsuarioModificacion')
        .exists().withMessage('El identificador de usuario es obligatorio.')
        .isInt({ min: 1 }).withMessage('El identificador del usuario debe ser un número entero válido.')
        .toInt(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default cursosUpdateValidation;