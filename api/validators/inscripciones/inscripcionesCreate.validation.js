import { body, validationResult } from 'express-validator';

const inscripcionesCreateValidation = [
    body('idCurso')
        .exists().withMessage('El idCurso es obligatorio')
        .isInt({ min: 1 }).withMessage('El idCurso debe ser un número entero válido')
        .toInt(),
    body('idEstudiante')
        .exists().withMessage('El idEstudiante es obligatorio')
        .isInt({ min: 1 }).withMessage('El idEstudiante debe ser un número entero válido')
        .toInt(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default inscripcionesCreateValidation;