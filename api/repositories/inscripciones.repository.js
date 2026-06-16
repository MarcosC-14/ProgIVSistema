import { param, query as sql } from "express-validator";
import BdUtils from "./database.js";
 
export default class InscripcionesRepository{

    async getCount(filter) {
        const client = await BdUtils.createConnection();
        try {
            let sql = `
                SELECT COUNT(*) AS total
                FROM inscripciones i
                INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
                INNER JOIN cursos c ON i.id_curso = c.id_curso
                INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado
                INNER JOIN inscripciones_estados ie ON i.id_inscripcion_estado = ie.id_inscripcion_estado
                WHERE ie.es_activo = 1 AND ce.es_activo = 1
            `;

            const sqlParams = [];
            let paramIndex = 1;
            if (filter && Object.keys(filter).length > 0) {
                //destructuración para evitar errores varios por delete
                const {estudiante_termino, ...otrosFiltros} = filter;
                //Filtro para buscar el nombre o dni al mismo tiempo
                if (estudiante_termino){
                    sql += ` AND (e.documento ILIKE $${paramIndex} OR e.nombres ILIKE $${paramIndex} OR e.apellido ILIKE $${paramIndex})`;
                    sqlParams.push(`%${estudiante_termino}%`);
                    paramIndex++;
                }

                
                Object.entries(otrosFiltros).forEach(([key, value]) => {
                    if (typeof value === 'string') {
                        sql += ` AND ${key} ILIKE $${paramIndex}`;
                        sqlParams.push(`%${value}%`);
                    } else {
                        sql += ` AND ${key} = $${paramIndex}`;
                        sqlParams.push(value);
                    }
                    paramIndex++;
                });
            }
            const { rows } = await client.query(sql, sqlParams);
            return parseInt(rows[0].total, 10); 
            
        } catch (error) {
            console.error(`Error en getCount para las inscripciones`, error);
            throw new Error('Error al contar las inscripciones');   
        }finally {
            client.release();
        }
    }

    async getAll(filter,limit,offset,order){
        const client = await BdUtils.createConnection();
        try {
            let sql = `
                SELECT 
                    i.id_inscripcion,
                    i.fecha_hora_inscripcion,
                    e.id_estudiante,
                    e.documento,
                    e.apellido AS estudiante_apellido,
                    e.nombres AS estudiante_nombres,
                    c.id_curso,
                    c.nombre AS curso_nombre,
                    i.id_usuario_modificacion,
                    i.fecha_hora_modificacion
                FROM inscripciones i
                INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
                INNER JOIN cursos c ON i.id_curso = c.id_curso
                INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado
                INNER JOIN inscripciones_estados ie ON i.id_inscripcion_estado = ie.id_inscripcion_estado
                WHERE ie.es_activo = 1 AND ce.es_activo = 1
            `;

            const sqlParams = [];
            let paramIndex = 1;
            if (filter && Object.keys(filter).length > 0){

                //destructuración para evitar errores varios por delete
                const {estudiante_termino, ...otrosFiltros} = filter;
                //Filtro para buscar el nombre o dni al mismo tiempo
                if (estudiante_termino){
                    sql += ` AND (e.documento ILIKE $${paramIndex} OR e.nombres ILIKE $${paramIndex} OR e.apellido ILIKE $${paramIndex})`;
                    sqlParams.push(`%${estudiante_termino}%`);
                    paramIndex++;
                }


                Object.entries(otrosFiltros).forEach(([key,value]) => {
                    if (typeof value === 'string'){
                        sql += ` AND ${key} ILIKE $${paramIndex}`;
                        sqlParams.push(`%${value}%`);
                    } else{
                        sql += ` AND ${key} = $${paramIndex}`;
                        sqlParams.push(value);
                    }
                    paramIndex++;
                });
            }

            if (order && Object.keys(order).length >0){
                const orderClauses = Object.entries(order)
                    .map(([key, value]) => `${key} ${value}`);
                    
                sql += ` ORDER BY ${orderClauses.join(', ')}`;
            } else {
                sql += ` ORDER BY i.fecha_hora_inscripcion DESC`;
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
            console.error(`Error en getAll para las inscripciones`, error);
            throw new Error('Error al traer las inscripciones');            
        } finally{
            client.release();
        }
    }

    async exists(idEstudiante, idCurso){
        const client = await BdUtils.createConnection();

        try {
            const sql = `
            SELECT 1 FROM public.inscripciones AS i 
            INNER JOIN public.inscripciones_estados AS ie ON i.id_inscripcion_estado = ie.id_inscripcion_estado
            WHERE i.id_estudiante = $1 AND i.id_curso = $2 AND ie.es_activo = 1
            LIMIT 1;
            `;
            
            const {rows} = await client.query(sql, [idEstudiante, idCurso]);
            return rows.length > 0;
        } catch(error){
            console.error(`Error en exists para la inscripción ${idEstudiante} al curso ${idCurso}`, error);
            throw new Error('Error al buscar inscripción');
        }
        finally{
            client.release();
        }
    }

    async countActivosByCurso(idCurso){
        const client = await BdUtils.createConnection();
        try{
            const sql = `
        SELECT COUNT(*) AS total 
        FROM public.inscripciones AS i
        INNER JOIN public.inscripciones_estados AS ie ON i.id_inscripcion_estado = ie.id_inscripcion_estado
        WHERE i.id_curso = $1 AND ie.es_activo = 1;
        `;
        
        const {rows} = await client.query(sql,[idCurso]);
        
        if (!rows || rows.length === 0) return 0;
    
        return parseInt(rows[0].total, 10) || 0;
        
        } catch (error) {
            console.error(`Error en countActivosByCurso para el curso ${idCurso}:`, error);
            throw new Error('Error al contar las inscripciones activas');
        } finally{
            client.release();
        }
    }

    async create(data){
        const client = await BdUtils.createConnection();
        try {
            const sqlInsert = `
                INSERT INTO public.inscripciones (
                    id_curso, 
                    id_estudiante, 
                    fecha_hora_inscripcion, 
                    id_inscripcion_estado, 
                    id_usuario_modificacion, 
                    fecha_hora_modificacion
                ) 
                VALUES ($1, 
                $2, 
                (NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires'), 
                (SELECT id_inscripcion_estado FROM public.inscripciones_estados WHERE es_activo = 1 LIMIT 1), 
                $3, 
                (NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires')
                )
                RETURNING id_inscripcion;
            `;
            
            const values = [
                data.id_curso,
                data.id_estudiante,
                data.id_usuario_modificacion
            ];
            const { rows } = await client.query(sqlInsert, values);
            return rows[0];

        } catch(error){
            console.error(`Error en create para la inscripción al curso ${data.id_curso}, de estudiante ${data.id_estudiante}, por usuario ${data.id_usuario_modificacion}`, error);
            throw new Error('Error al crear la inscripcion')
        } 
        finally {
            client.release();
        }
    }

    async getById(id){
        const client = await BdUtils.createConnection();

        try {
            const sql = `
            SELECT 
                i.id_inscripcion,
                i.fecha_hora_inscripcion,
                e.id_estudiante,
                e.documento,
                e.apellido AS estudiante_apellido,
                e.nombres AS estudiante_nombres,
                c.id_curso,
                c.nombre AS curso_nombre,
                i.id_usuario_modificacion,
                i.fecha_hora_modificacion
            FROM inscripciones i
            INNER JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
            INNER JOIN cursos c ON i.id_curso = c.id_curso
            INNER JOIN cursos_estados ce ON c.id_curso_estado = ce.id_curso_estado
            INNER JOIN inscripciones_estados ie ON i.id_inscripcion_estado = ie.id_inscripcion_estado
            WHERE ie.es_activo = 1 AND ce.es_activo = 1 AND i.id_inscripcion = $1
            `;

            const {rows} = await client.query(sql,[id]);
            return rows[0];
        } catch (error) {
            console.error(`Error en getById para la inscripción ${id}`, error);
            throw new Error('Error al traer la inscripcion')
        } finally{
            client.release();
        }
    }

    async borrar(id,id_usuario){
        const client = await BdUtils.createConnection();
        try{
            const sql = `
            UPDATE public.inscripciones 
                SET id_inscripcion_estado = (
                    SELECT id_inscripcion_estado 
                    FROM public.inscripciones_estados 
                    WHERE es_activo = 0 
                    LIMIT 1
                    ),
                    id_usuario_modificacion = $2,
                    fecha_hora_modificacion = (NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires')
                WHERE id_inscripcion = $1
                RETURNING id_inscripcion
            `;

            const {rows} = await client.query(sql,[id,id_usuario]);
            return rows[0];
        } catch(error){
            console.error("Fallo al borrar",error);
            throw error;
        } finally{
            client.release();
        }
    }

}

