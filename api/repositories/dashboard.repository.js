import { param, query as sql } from "express-validator";
import BdUtils from "./database.js";
 
export default class DashboardRepository{

    async obtenerCursosRecientes(){
        const client = await BdUtils.createConnection();

        try {
        const sql = `
            SELECT 
                c.id_curso,
                c.nombre,
                c.descripcion,
                c.fecha_inicio,
                c.inscriptos_max,
                COUNT(i.id_inscripcion) AS total_inscriptos,
                MAX(i.fecha_hora_inscripcion) AS ultima_inscripcion
            FROM cursos c
            INNER JOIN inscripciones i ON c.id_curso = i.id_curso
            WHERE c.id_curso_estado = 2 
            AND i.id_inscripcion_estado = 1 
            GROUP BY c.id_curso
            ORDER BY ultima_inscripcion DESC
            LIMIT 5;
        `;

        const { rows } = await client.query(sql);
        return rows;
    } catch(error) {
            console.error(`Error al obtener cursos activos recientes`, error);
            throw new Error('Error al obtener cursos activos recientes');   
        }finally {
            client.release();
        }
    }
}