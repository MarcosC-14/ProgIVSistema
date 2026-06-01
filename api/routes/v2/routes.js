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

const router = express.Router();

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
export default router;