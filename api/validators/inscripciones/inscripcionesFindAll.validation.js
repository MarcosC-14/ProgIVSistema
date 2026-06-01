import { query, validationResult } from 'express-validator';

const inscripcionesFindAllValidation = [
    query('idInscripcion')
        .optional()
        .isInt({ min: 1 }).withMessage('idInscripcion debe ser un número entero positivo')
        .toInt(),
    query('idCurso')
        .optional()
        .isInt({ min: 1 }).withMessage('idCurso debe ser un número entero positivo')
        .toInt(),
    query('idEstudiante')
        .optional()
        .isInt({ min: 1 }).withMessage('idEstudiante debe ser un número entero positivo')
        .toInt(),
    query('estudianteTermino')
        .optional()
        .notEmpty().withMessage('estudianteTermino no puede estar vacío')
        .isString().withMessage('estudianteTermino debe ser una cadena de texto'),
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
        .isIn(['idInscripcion', 'idCurso', 'idEstudiante', 'cursoNombre', 'estudianteApellido']).withMessage('Parámetro de ordenamiento no permitido'),
    query('asc')
        .optional()
        .isBoolean().withMessage('asc debe ser un valor booleano (true/false)'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default inscripcionesFindAllValidation;