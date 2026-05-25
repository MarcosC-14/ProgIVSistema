import { param, validationResult } from 'express-validator';

const inscripcionesGetByIdValidation = [
    param('id')
        .exists().withMessage('El identificador de la inscripción en la ruta es obligatorio.')
        .isInt({ min: 1 }).withMessage('El identificador de la inscripción debe ser un número entero positivo.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default inscripcionesGetByIdValidation;