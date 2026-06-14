import BdUtils from "./database.js";

export default class CursosEstadosRepository {
    async getAll() {
        const client = await BdUtils.createConnection();
        try {
            const query = `
                SELECT id_curso_estado, descripcion 
                FROM public.cursos_estados 
                WHERE es_activo = 1 
                ORDER BY id_curso_estado ASC;
            `;
            const { rows } = await client.query(query);
            return rows;
        } catch (error) {
            console.error("Error en CursosEstadosRepository.getAll:", error);
            throw error;
        } finally {
            client.release();
        }
    }
}