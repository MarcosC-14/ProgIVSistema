import express from "express";
import passport from "passport";

import { verificarToken } from "../../middlewares/auth.middleware.js";

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

import CursosEstadosController from "../../controllers/cursosEstados.controller.js";


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

import AuthController from "../../controllers/auth.controller.js";
import { localStrategy, jwtStrategy } from "../../config/passport.js";

import DashboardController from "../../controllers/dashboard.controller.js";

const router = express.Router();

passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy); 

const estudiantesController = new EstudiantesController();
const inscripcionesController = new InscripcionesController();
const cursosController = new CursosController();
const authController = new AuthController();

router.post("/auth/login", authController.login.bind(authController)); 
const cursosEstadosController = new CursosEstadosController();
const dashboardController = new DashboardController();

router.post("/auth/login", authController.login.bind(authController));

router.get("/cursos", [verificarToken,cursosFindAllValidation, cursosFindAllTransform], cursosController.getAll.bind(cursosController));

router.get("/cursos/:id", [verificarToken,cursosGetByIdValidation, cursosGetByIdTransform], cursosController.getById.bind(cursosController));

router.post("/cursos", [verificarToken,cursosCreateValidation, cursosCreateTransform], cursosController.create.bind(cursosController));

router.put("/cursos/:id", [verificarToken,cursosUpdateValidation,cursosUpdateTransform], cursosController.update.bind(cursosController));

router.delete("/cursos/:id", [verificarToken,cursosBorrarValidation,cursosBorrarTransform], cursosController.borrar.bind(cursosController));

router.get('/estados',verificarToken, cursosEstadosController.getAll.bind(cursosEstadosController));

router.get("/estudiantes", [verificarToken,estudiantesFindAllValidation, estudiantesFindAllTransform], estudiantesController.getAll.bind(estudiantesController));

router.get("/estudiantes/:id", [verificarToken,estudiantesGetByIdValidation, estudiantesGetByIdTransform], estudiantesController.getById.bind(estudiantesController));

router.post("/estudiantes", [verificarToken,estudiantesCreateValidation, estudiantesCreateTransform], estudiantesController.create.bind(estudiantesController));

router.put("/estudiantes/:id", [verificarToken,estudiantesUpdateValidation, estudiantesUpdateTransform], estudiantesController.update.bind(estudiantesController));

router.delete("/estudiantes/:id", [verificarToken,estudiantesBorrarValidation, estudianteBorrarTransform], estudiantesController.borrar.bind(estudiantesController));


router.get("/inscripciones",[verificarToken,inscripcionesFindAllValidation,inscripcionesFindAllTransform], inscripcionesController.getAll.bind(inscripcionesController));

router.get("/inscripciones/:id",[verificarToken,inscripcionesGetByIdValidation,inscripcionesGetByIdTransform], inscripcionesController.getById.bind(inscripcionesController));

router.get("/inscripciones/:id/diploma",[verificarToken,inscripcionesGetByIdValidation,inscripcionesGetByIdTransform], inscripcionesController.generarDiploma.bind(inscripcionesController));

router.post("/inscripciones",[verificarToken,inscripcionesCreateValidation,inscripcionesCreateTransform],inscripcionesController.create.bind(inscripcionesController));

router.delete("/inscripciones/:id", [verificarToken,inscripcionesBorrarValidation,inscripcionesBorrarTransform], inscripcionesController.borrar.bind(inscripcionesController));


router.get("/dashboard/cursos-recientes",verificarToken, dashboardController.getCursosRecientes.bind(dashboardController));

export default router;