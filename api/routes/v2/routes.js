import express from "express";
import CursosController from "../../controllers/cursos.controller.js";
import cursosFindAllValidation from "../../validators/cursos/cursosFindAll.validation.js";
import cursosFindAllTransform from "../../transforms/cursos/cursosFindAll.transform.js";
import cursosGetByIdValidation from "../../validators/cursos/cursosGetById.validation.js";
import cursosGetByIdTransform from "../../transforms/cursos/cursosGetById.transform.js";
import cursosCreateValidation from "../../validators/cursos/cursosCreate.validation.js";
import cursosCreateTransform from "../../transforms/cursos/cursosCreate.transform.js";
import cursosUpdateValidation from "../../validators/cursos/cursosUpdate.validation.js";
import cursosUpdateTransform from "../../transforms/cursos/cursosUpdate.transform.js";
import cursosBorrarValidation from "../../validators/cursos/cursosBorrar.validation.js";
import cursosBorrarTransform from "../../transforms/cursos/cursosBorrar.transform.js";


import EstudiantesController from "../../controllers/estudiantes.controller.js";
import estudiantesFindAllValidation from "../../validators/estudiantes/estudiantesFindAll.validation.js";
import estudiantesFindAllTransform from "../../transforms/estudiantes/estudiantesFindAll.transform.js";
import estudiantesGetByIdTransform from "../../transforms/estudiantes/estudiantesGetById.transform.js";
import estudiantesGetByIdValidation from "../../validators/estudiantes/estudiantesGetById.validation.js";
import estudiantesCreateTransform from "../../transforms/estudiantes/estudiantesCreate.transform.js";
import estudiantesCreateValidation from "../../validators/estudiantes/estudiantesCreate.validation.js";
import estudiantesUpdateTransform from "../../transforms/estudiantes/estudiantesUpdate.transform.js";
import estudiantesUpdateValidation from "../../validators/estudiantes/estudiantesUpdate.validation.js";
import estudianteBorrarTransform from "../../transforms/estudiantes/estudiantesBorrar.transform.js";
import estudiantesBorrarValidation from "../../validators/estudiantes/estudiantesBorrarValidation.js";


import InscripcionesController from "../../controllers/inscripciones.controller.js";
import inscripcionesFindAllValidation from "../../validators/inscripciones/inscripcionesFindAll.validation.js";
import inscripcionesCreateValidation from "../../validators/inscripciones/inscripcionesCreate.validation.js";
import inscripcionesFindAllTransform from "../../transforms/inscripciones/inscripcionesFindAll.transform.js";
import inscripcionesCreateTransform from "../../transforms/inscripciones/inscripcionesCreate.transform.js";
import inscripcionesGetByIdValidation from "../../validators/inscripciones/inscripcionesGetById.validation.js";
import inscripcionesGetByIdTransform from "../../transforms/inscripciones/inscripcionesGetById.transform.js";
import inscripcionesBorrarValidation from "../../validators/inscripciones/inscripcionesBorrar.validation.js";
import inscripcionesBorrarTransform from "../../transforms/inscripciones/inscripcionesBorrar.transform.js";

const router = express.Router();

const estudiantesController = new EstudiantesController();
const inscripcionesController = new InscripcionesController();
const cursosController = new CursosController();

router.get("/cursos", [cursosFindAllValidation, cursosFindAllTransform], cursosController.getAll.bind(cursosController));

router.get("/cursos/:id", [cursosGetByIdValidation, cursosGetByIdTransform], cursosController.getById.bind(cursosController));

router.post("/cursos", [cursosCreateValidation, cursosCreateTransform], cursosController.create.bind(cursosController));

router.put("/cursos/:id", [cursosUpdateValidation,cursosUpdateTransform], cursosController.update.bind(cursosController));

router.delete("/cursos/:id", [cursosBorrarValidation,cursosBorrarTransform], cursosController.borrar.bind(cursosController));

router.get('/api/estados', async (req, res) => {
    try {
        // Tu consulta SQL usando tu conexión (pool o client)
        const resultado = await pool.query('SELECT id_curso_estado, descripcion FROM cursos_estados;');
        
        // Devolvemos las filas al frontend en formato JSON
        res.json(resultado.rows); 
    } catch (error) {
        console.error("Error al obtener estados de la BD:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


router.get("/estudiantes", [estudiantesFindAllValidation, estudiantesFindAllTransform], estudiantesController.getAll.bind(estudiantesController));

router.get("/estudiantes/:id", [estudiantesGetByIdValidation, estudiantesGetByIdTransform], estudiantesController.getById.bind(estudiantesController));

router.post("/estudiantes", [estudiantesCreateValidation, estudiantesCreateTransform], estudiantesController.create.bind(estudiantesController));

router.put("/estudiantes/:id", [estudiantesUpdateValidation, estudiantesUpdateTransform], estudiantesController.update.bind(estudiantesController));

router.delete("/estudiantes/:id", [estudiantesBorrarValidation, estudianteBorrarTransform], estudiantesController.borrar.bind(estudiantesController));


router.get("/inscripciones",[inscripcionesFindAllValidation,inscripcionesFindAllTransform], inscripcionesController.getAll.bind(inscripcionesController));

router.get("/inscripciones/:id",[inscripcionesGetByIdValidation,inscripcionesGetByIdTransform], inscripcionesController.getById.bind(inscripcionesController));

router.post("/inscripciones",[inscripcionesCreateValidation,inscripcionesCreateTransform],inscripcionesController.create.bind(inscripcionesController));

router.delete("/inscripciones/:id", [inscripcionesBorrarValidation,inscripcionesBorrarTransform], inscripcionesController.borrar.bind(inscripcionesController));



export default router;