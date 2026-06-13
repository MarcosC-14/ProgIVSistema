import { body, validationResult } from 'express-validator';

const estudiantesCreateValidation = [
    body('documento')
        .notEmpty().withMessage('El documento es obligatorio')
        .isString().withMessage('El documento debe ser texto numerico')
        .isLength({ min: 7, max: 10 }).withMessage('El documento debe tener entre 7 y 10 caracteres'),

    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isString().withMessage('El apellido debe ser una cadena de texto'),

    body('nombres')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser una cadena de texto'),

    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('El email debe ser una dirección de correo valida'),

    body('fecha_nacimiento')
        .exists().withMessage('La fecha de nacimiento es obligatoria.')
        .isBefore('2100-01-01').withMessage('El anio de la fecha ingresada excede el límite máximo.')
        .toDate(),
        
    body('id_usuario_modificacion')
        .exists().withMessage('El identificador de usuario es obligatorio.')
        .isInt({ min: 1 }).withMessage('El identificador del usuario debe ser un número entero valido.')
        .toInt(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default estudiantesCreateValidation;