import { param, validationResult } from 'express-validator';

const cursosBorrarValidation = [
    param('id')
        .exists().withMessage('El identificador del curso en la ruta es obligatorio.')
        .isInt({ min: 1 }).withMessage('El identificador del curso debe ser un número entero positivo.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default cursosBorrarValidation;