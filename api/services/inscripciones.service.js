import InscripcionesRepository from "../repositories/inscripciones.repository.js";
import InscripcionResponseDTO from "../dtos/inscripciones/inscripciones.response.dto.js";
import CursosRepository from "../repositories/cursos.repository.js";
import EstudiantesRepository from "../repositories/estudiantes.repository.js";
import BaseService from "./base.services.js";

export default class InscripcionesService extends BaseService{

    static KEYS_MAP = {
        idInscripcion: 'id_inscripcion',
        idCurso: 'id_curso',
        idEstudiante: 'id_estudiante',
        cursoNombre: 'nombre',
        estudianteApellido: 'apellido',
        estudianteDocumento: 'documento',
        fechaHoraInscripcion: 'fecha_hora_inscripcion',
        idUsuarioModificacion: 'id_usuario_modificacion',
        estudianteTermino: 'estudiante_termino'
    }

    static KEYS_MAP_JOIN = {
        idInscripcion: 'i.id_inscripcion',
        idCurso: 'c.id_curso',
        idEstudiante: 'e.id_estudiante',
        cursoNombre: 'c.nombre',
        estudianteApellido: 'e.apellido',
        estudianteDocumento: 'e.documento',
        fechaHoraInscripcion: 'i.fecha_hora_inscripcion',
        idUsuarioModificacion: 'i.id_usuario_modificacion',
        estudianteTermino: 'estudiante_termino'
    }
 
    constructor(){
        super();
        this.repository = new InscripcionesRepository();
        this.CursosRepository = new CursosRepository();
        this.EstudiantesRepository = new EstudiantesRepository();
    
    }

    async getAll(data){
        const {filter,limit,offset,order} = data;
        const sqlFilter = this.mapKeysToColumns(filter, InscripcionesService.KEYS_MAP_JOIN);
        const sqlOrder = this.mapKeysToColumns(order, InscripcionesService.KEYS_MAP_JOIN);

        const [respuestaBD, totalInscripciones] = await Promise.all([
            this.repository.getAll(sqlFilter, limit, offset, sqlOrder),
            this.repository.getCount(sqlFilter)
        ]);
        const respuesta = respuestaBD.map(inscripcion => (new InscripcionResponseDTO(inscripcion)));
        return {totalInscripciones,respuesta};
    }

    async create(data){
        const dataMapped = this.mapKeysToColumns(data, InscripcionesService.KEYS_MAP);
        const idEstudiante = dataMapped['i.id_estudiante'] || data.idEstudiante;
        const idCurso = dataMapped['i.id_curso'] || data.idCurso;

        const curso = await this.CursosRepository.getById(idCurso);
        if (!curso) throw new Error('El curso no existe.');

        /*NOTA Comentado hasta que se haya hecho esa parte en el repo :(
        const estudiante = await this.EstudiantesRepository.getById(idEstudiante);
        if (!estudiante) throw new Error('El estudiante no existe');
        */

        const inscripto = await this.repository.exists(idEstudiante,idCurso);
        if (inscripto) throw new Error('El estudiante ya está registrado en el curso.');
        
        const inscriptosActuales = await this.repository.countActivosByCurso(idCurso);

        if (inscriptosActuales >= curso.inscriptos_max) throw new Error('El curso alcanzó su máximo de inscripciones.');
        const respuestaBD = await this.repository.create(dataMapped);
        const respuesta = new InscripcionResponseDTO(respuestaBD);
        return respuesta;
    }


    async getById(id){
        const inscripcionBD = await this.repository.getById(id);
        if (!inscripcionBD){
            throw new Error("Inscripcin no encontrada");
        }

        return new InscripcionResponseDTO(inscripcionBD);
    }

    async borrar(id){
        const inscripcion = await this.repository.getById(id);
        if (!inscripcion) throw new Error('La inscripción no existe');

        const inscripcionBorrada = await this.repository.borrar(id);
        return new InscripcionResponseDTO(inscripcionBorrada);
    }




}

