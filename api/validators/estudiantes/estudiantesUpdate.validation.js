import { body, param, validationResult } from 'express-validator';

const estudiantesUpdateValidation = [
    param('id')
        .exists().withMessage('El identificador del estudiante en la ruta es obligatorio.')
        .isInt({ min: 1 }).withMessage('El identificador del estudiante debe ser un número entero positivo.')
        .toInt(),

    body('documento')
        .exists().withMessage('El documento del estudiante en la ruta es obligatorio.')
        .isString().withMessage('El documento debe ser texto numérico')
        .notEmpty().withMessage('El documento no debe estar vacio')
        .isLength({min: 7, max: 10}).withMessage('El documento debe tener entre 7 y 10 caracteres'),
    
    body('apellido')
        .exists().withMessage('El campo apellido es obligatorio.')
        .isString().withMessage('El apellido debe ser una cadena de texto.')
        .trim()
        .notEmpty().withMessage('El apellido no puede estar vacío.')
        .isLength({ min: 1, max: 45 }).withMessage('El apellido debe tener entre 1 y 45 caracteres.'),

    body('nombres')
        .exists().withMessage('El campo nombres es obligatorio.')
        .isString().withMessage('El nombre debe ser una cadena de texto.')
        .trim()
        .notEmpty().withMessage('El nombre no puede estar vacío.')
        .isLength({ min: 1, max: 45 }).withMessage('El nombre debe tener entre 1 y 45 caracteres.'),

    body('email')
        .exists().withMessage('El campo emial es obligatorio.')
        .isEmail().withMessage('Debe ser una dirección de correo válida'),
    
    body('fecha_nacimiento')
        .exists().withMessage('La fecha de nacimiento es obligatoria.')
        .isBefore('2100-01-01').withMessage('El año de la fecha ingresada excede el límite máximo.')
        .toDate(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default estudiantesUpdateValidation;