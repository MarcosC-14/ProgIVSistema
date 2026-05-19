import express from "express";
import CursosController from "../../controllers/cursos.controller.js";
import cursosFindAllValidation from "../../validators/cursosFindAll.validation.js";
import cursosFindAllTransform from "../../transforms/cursosFindAll.transform.js";

const router = express.Router();

const cursosController = new CursosController();

router.get("/cursos", [cursosFindAllValidation, cursosFindAllTransform], cursosController.getAll.bind(cursosController));

router.get("/cursos/:id", cursosController.getById.bind(cursosController));

router.post("/cursos", cursosController.create.bind(cursosController));

router.put("/cursos/:id", cursosController.update.bind(cursosController));

router.delete("/cursos/:id", cursosController.borrar.bind(cursosController));

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