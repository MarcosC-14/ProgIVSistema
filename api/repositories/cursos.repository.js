import BdUtils from "./database.js";

export default class CursosRepository {

    async getAll(filter,limit,offset,order){
        const client = await BdUtils.createConnection();
        try {
            let sql = `
               SELECT  c.id_curso, 
                    c.nombre, 
                    c.descripcion,
                    c.fecha_inicio,
                    c.cantidad_horas, 
                    c.inscriptos_max, 
                    c.id_curso_estado, 
                    c.id_usuario_modificacion, 
                    c.fecha_hora_modificacion 
            FROM public.cursos c
            INNER JOIN public.cursos_estados e ON e.id_curso_estado = c.id_curso_estado
            WHERE e.es_activo = 1
            `;
            
            const sqlParams = [];
            let paramIndex = 1;

            if (filter){
                if (filter.id_curso){
                    sql += ` AND c.id_curso = $${paramIndex}`;
                    sqlParams.push(parseInt(filter.id_curso, 10));
                    paramIndex++;
                }

                if (filter.id_curso_estado) {
                    const estadosArray = Array.isArray(filter.id_curso_estado)
                        ? filter.id_curso_estado.map(id => parseInt(id, 10))
                        : [parseInt(filter.id_curso_estado, 10)];

                    sql += ` AND c.id_curso_estado = ANY($${paramIndex}::int[])`;
                    sqlParams.push(estadosArray);
                    paramIndex++;
                }
                
                if(filter.termino){
                    sql += ` AND (c.nombre ILIKE $${paramIndex} OR c.descripcion ILIKE $${paramIndex})`;
                    sqlParams.push(`%${filter.termino}%`);
                    paramIndex++;
                }
            }

            if (order && Object.keys(order).length >0){
                const orderClauses = Object.entries(order)
                    .map(([key, value]) => `${key} ${value}`);
                    
                sql += ` ORDER BY ${orderClauses.join(', ')}`;
            } else {
                sql += ` ORDER BY c.fecha_inicio DESC`;
            }


            if (limit){
                sql += ` LIMIT $${paramIndex}`;
                sqlParams.push(limit);
                paramIndex++;
            }

            if (offset){
                sql += ` OFFSET $${paramIndex}`;
                sqlParams.push(offset);
            }
            const {rows} = await client.query(sql,sqlParams);
            return rows;
        
            
        } catch (error) {
            console.error(`Error en getAll Cursos`, error);
            throw new Error('Error al traer Cursos');            
        } finally{
            client.release();
        }
    }

    
    async getById(id){
        const client = await BdUtils.createConnection();
        try{
            const query = `
            SELECT c.id_curso, 
                    c.nombre, 
                    c.descripcion,
                    c.fecha_inicio,
                    c.cantidad_horas, 
                    c.inscriptos_max, 
                    c.id_curso_estado, 
                    c.id_usuario_modificacion, 
                    c.fecha_hora_modificacion 
            FROM public.cursos c
            INNER JOIN public.cursos_estados e ON e.id_curso_estado = c.id_curso_estado
            WHERE e.es_activo = 1 AND c.id_curso = $1`;
            const {rows} = await client.query(query, [id]);
            return rows[0];
        }catch(error){
            console.error("Fallo traer por id, no se que paso, no estaba",error);
        } finally{
            client.release();
        }
    }
    async create(data){
        const client = await BdUtils.createConnection();
        try{
            const query = `
            INSERT INTO public.cursos 
            (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion, fecha_hora_modificacion)
            VALUES ($1, $2, $3, $4, $5, $6, $7, (NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires'))
            RETURNING id_curso;
            `;
            const values =[
                data.nombre,
                data.descripcion,
                data.fecha_inicio,
                data.cantidad_horas,
                data.inscriptos_max,
                data.id_curso_estado || 1,
                data.id_usuario_modificacion ||null
            ];
            const { rows } = await client.query(query, values);
            return await this.getById(rows[0].id_curso);
        } catch(error){
            console.error("Fah, Fallo la creacion".error);
            throw error;
        } finally {    
            client.release();
        }
    }

    async update (id, data){
        const client= await BdUtils.createConnection();
        
        try{
            const query = `
                UPDATE public.cursos
                SET 
                    nombre = $1,
                    descripcion = $2,
                    fecha_inicio = $3,
                    cantidad_horas = $4,
                    inscriptos_max = $5,
                    id_curso_estado = $6,
                    id_usuario_modificacion= $7,
                    fecha_hora_modificacion = (NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires')
                WHERE id_curso = $8
                RETURNING *;
                `;
            const values = [
                data.nombre,
                data.descripcion,
                data.fecha_inicio,
                data.cantidad_horas,
                data.inscriptos_max,
                data.id_curso_estado,
                data.id_usuario_modificacion,
                id,
            ];    

            const {rows} = await client.query(query, values);
            return rows[0];
        }catch(error){
            console.error("Fallo en la actualizacion",error);
            throw error;
        }finally{
            client.release();
        }
    }
    async borrar(id,id_usuario){
        const client = await BdUtils.createConnection();
        try{
            const query = `
                UPDATE public.cursos 
                    SET id_curso_estado = 4,
                        id_usuario_modificacion = $2,
                        fecha_hora_modificacion = (NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires')
                    WHERE id_curso = $1 
                    RETURNING id_curso;`;
            const { rows } = await client.query(query, [id,id_usuario]);
            return rows[0];
        }catch(error){
            console.error("Fallo un borrado", error);
            throw error;
        }finally{
            client.release();
        }
    }

    async getCount(filter) {
        const client = await BdUtils.createConnection();
        try {
            let sql = `
                SELECT COUNT(*) AS total
                FROM public.cursos c
                INNER JOIN public.cursos_estados e ON e.id_curso_estado = c.id_curso_estado
                WHERE e.es_activo = 1
            `;

            const sqlParams = [];
            let paramIndex = 1;

            if (filter) {
                if (filter.id_curso) {
                    sql += ` AND c.id_curso = $${paramIndex}`;
                    sqlParams.push(parseInt(filter.id_curso, 10));
                    paramIndex++;
                }

                if (filter.id_curso_estado) {
                    const estadosArray = Array.isArray(filter.id_curso_estado)
                        ? filter.id_curso_estado.map(id => parseInt(id, 10))
                        : [parseInt(filter.id_curso_estado, 10)];

                    sql += ` AND c.id_curso_estado = ANY($${paramIndex}::int[])`;
                    sqlParams.push(estadosArray);
                    paramIndex++;
                }

                if (filter.termino) {
                    sql += ` AND (c.nombre ILIKE $${paramIndex} OR c.descripcion ILIKE $${paramIndex})`;
                    sqlParams.push(`%${filter.termino}%`);
                    paramIndex++;
                }
            }

            const { rows } = await client.query(sql, sqlParams);
            return parseInt(rows[0].total, 10); 
            
        } finally {
            client.release();
        }
    }
}