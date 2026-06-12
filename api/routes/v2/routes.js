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
import estudiantesFindAllValidation from "../../validators/estudiantesFindAll.validation.js";
import estudiantesFindAllTransform from "../../transforms/estudiantesFindAll.transform.js";

import InscripcionesController from "../../controllers/inscripciones.controller.js";
import inscripcionesFindAllValidation from "../../validators/inscripciones/inscripcionesFindAll.validation.js";
import inscripcionesCreateValidation from "../../validators/inscripciones/inscripcionesCreate.validation.js";
import inscripcionesFindAllTransform from "../../transforms/inscripciones/inscripcionesFindAll.transform.js";
import inscripcionesCreateTransform from "../../transforms/inscripciones/inscripcionesCreate.transform.js";
import inscripcionesGetByIdValidation from "../../validators/inscripciones/inscripcionesGetById.validation.js";
import inscripcionesGetByIdTransform from "../../transforms/inscripciones/inscripcionesGetById.transform.js";
import inscripcionesBorrarValidation from "../../validators/inscripciones/inscripcionesBorrar.validation.js";
import inscripcionesBorrarTransform from "../../transforms/inscripciones/inscripcionesBorrar.transform.js";
import UsuariosController from "../../controllers/usuarios.controller.js";

const router = express.Router();

const estudiantesController = new EstudiantesController();
const inscripcionesController = new InscripcionesController();
const cursosController = new CursosController();
const usuariosController = new UsuariosController();

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

router.get("/inscripciones",[inscripcionesFindAllValidation,inscripcionesFindAllTransform], inscripcionesController.getAll.bind(inscripcionesController));

router.get("/inscripciones/:id",[inscripcionesGetByIdValidation,inscripcionesGetByIdTransform], inscripcionesController.getById.bind(inscripcionesController));

router.post("/inscripciones",[inscripcionesCreateValidation,inscripcionesCreateTransform],inscripcionesController.create.bind(inscripcionesController));

router.delete("/inscripciones/:id", [inscripcionesBorrarValidation,inscripcionesBorrarTransform], inscripcionesController.borrar.bind(inscripcionesController));

router.post("/usuarios", usuariosController.register.bind(usuariosController));

router.post("/login", usuariosController.login.bind(usuariosController));

export default router;