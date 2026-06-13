import BdUtils from "./database.js"; 

export default class UsuariosRepository {
   
    async getByNombreUsuario(nombreUsuario) {
        const client = await BdUtils.createConnection();
        try {
            const sql = `
                SELECT id_usuario, apellido, nombre, nombre_usuario, contrasenia, activo 
                FROM public.usuarios 
                WHERE nombre_usuario = $1
                LIMIT 1
            `;
            const { rows } = await client.query(sql, [nombreUsuario]);
            return rows[0] || null;
        } catch (error) {
            console.error("Error en getByNombreUsuario:", error);
            throw new Error("Error al buscar usuario por nombre");
        } finally {
            client.release(); 
        }
    }

    
    async getById(id) {
        const client = await BdUtils.createConnection();
        try {
            const sql = `
                SELECT id_usuario, apellido, nombre, nombre_usuario, activo 
                FROM public.usuarios 
                WHERE id_usuario = $1
                LIMIT 1
            `;
            const { rows } = await client.query(sql, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error(error);
            throw new Error("Error al buscar usuario por ID");
        } finally {
            client.release();
        }
    }
}