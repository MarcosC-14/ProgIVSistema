import BdUtils from "./database.js";

export default class EstudiantesRepository {

    async getAll(filter, limit, offset, order) {
        const client = await BdUtils.createConnection();

        let strWhere = ''
        let strOrder = ''
        let strLimit = ''
        let strOffset = ''

        if (filter && Object.keys(filter).length > 0) {
            Object.entries(filter).forEach(([key, value]) => {
                
                if (key === 'termino') {
                    strWhere += ` AND (nombres ILIKE '%${value}%' OR apellido ILIKE '%${value}%' OR documento ILIKE '%${value}%') `;
                } 
                else {
                    strWhere += ` AND ${key} = ${value} `;
                }

            });

        }

        if (order && Object.keys(order).length > 0) {
            const orderCampos = Object.entries(order).map(([key, value]) => `${key} ${value}`);
            strOrder = `ORDER BY ${orderCampos.join(', ')} `;
        }

        if (limit) {
            strLimit = `LIMIT ${limit} `
        }

        if (offset) {
            strOffset = `OFFSET ${offset} `
        }
        
        const countResult = await client.query(`
            SELECT COUNT(*) as total 
            FROM public.estudiantes
            WHERE activo = 1
            ${strWhere};
        `);
        const total = parseInt(countResult.rows[0].total, 10);

        const { rows } = await client.query(`
            SELECT  id_estudiante, 
                    documento, 
                    apellido, 
                    nombres, 
                    email, 
                    fecha_nacimiento, 
                    activo, 
                    id_usuario_modificacion, 
                    fecha_hora_modificacion 
            FROM public.estudiantes
            WHERE activo = 1
            ${strWhere}
            ${strOrder}
            ${strLimit}
            ${strOffset};
        `);
        
        client.release();
        
        return { rows, total };
    }

    async getById(id) {
        const client = await BdUtils.createConnection();
        const { rows } = await client.query(`
            SELECT * FROM public.estudiantes 
            WHERE id_estudiante = $1 AND activo = 1
        `, [id]);
        client.release();
        return rows[0];
    }

    async create(estudiante) {
        const client = await BdUtils.createConnection();
        const { rows } = await client.query(`
            INSERT INTO public.estudiantes 
            (documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion) 
            VALUES ($1, $2, $3, $4, $5, 1, $6, CURRENT_TIMESTAMP) 
            RETURNING *;
        `, [estudiante.documento, estudiante.apellido, estudiante.nombres, estudiante.email, estudiante.fecha_nacimiento, estudiante.id_usuario_modificacion]);
        client.release();
        return rows[0];
    }

    async update(id, estudiante) {
        const client = await BdUtils.createConnection();
        const { rows } = await client.query(`
            UPDATE public.estudiantes 
            SET documento = $1, apellido = $2, nombres = $3, email = $4, fecha_nacimiento = $5, id_usuario_modificacion = $6, fecha_hora_modificacion = CURRENT_TIMESTAMP
            WHERE id_estudiante = $7 AND activo = 1
            RETURNING *;
        `, [estudiante.documento, estudiante.apellido, estudiante.nombres, estudiante.email, estudiante.fecha_nacimiento, estudiante.id_usuario_modificacion, id]);
        client.release();
        return rows[0];
    }

    async borrar(id, idUsuarioModificacion) {
        const client = await BdUtils.createConnection();
        const { rows } = await client.query(`
            UPDATE public.estudiantes 
            SET activo = 0, id_usuario_modificacion = $1, fecha_hora_modificacion = CURRENT_TIMESTAMP 
            WHERE id_estudiante = $2 
            RETURNING *;
        `, [idUsuarioModificacion, id]);
        client.release();
        return rows[0];
    }
}