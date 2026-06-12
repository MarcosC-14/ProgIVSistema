import BdUtils from "./database.js";

export default class UsuariosRepository {

    async create(data) {
        const client = await BdUtils.createConnection();
        try {
            const sqlInsert = `
                INSERT INTO public.usuarios (
                    apellido, 
                    nombre, 
                    nombre_usuario, 
                    contrasenia, 
                    activo
                ) 
                VALUES ($1, $2, $3, encode(digest($4, 'sha256'), 'hex'), 1)
                RETURNING id_usuario, nombre_usuario;
            `;
            
            const values = [
                data.apellido.toUpperCase(),
                data.nombre.toUpperCase(),
                data.nombre_usuario.toLowerCase(),
                data.contrasenia
            ];

            const { rows } = await client.query(sqlInsert, values);
            return rows[0];

        } catch (error) {
            console.error(`Error en create para el usuario administrativo ${data.nombre_usuario}`, error);
            throw new Error('Error al registrar el usuario en PostgreSQL');
        } finally {
            client.release(); 
        }
    }

    async verifyCredentials(nombreUsuario, contrasenia) {
        const client = await BdUtils.createConnection();
        try {
            const sqlSelect = `
                SELECT id_usuario, nombre_usuario, nombre, apellido
                FROM public.usuarios
                WHERE nombre_usuario = $1 
                  AND contrasenia = encode(digest($2, 'sha256'), 'hex')
                  AND activo = 1;
            `;

            const { rows } = await client.query(sqlSelect, [nombreUsuario.toLowerCase(), contrasenia]);
            
            return rows[0];

        } catch (error) {
            console.error(`Error al verificar credenciales para ${nombreUsuario}`, error);
            throw new Error('Error en la autenticación de la base de datos');
        } finally {
            client.release();
        }
    }
}