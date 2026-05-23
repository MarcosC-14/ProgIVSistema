export default class InscripcionResponseDTO {
    constructor(inscripcion) {
        this.idInscripcion = inscripcion.id_inscripcion;
        this.idCurso = inscripcion.id_curso;
        this.cursoNombre = inscripcion.curso_nombre;
        this.idEstudiante = inscripcion.id_estudiante;
        this.documento = inscripcion.documento;
        this.estudianteApellido = inscripcion.estudiante_apellido;
        this.estudianteNombres = inscripcion.estudiante_nombres;
        this.fechaInscripcion = inscripcion.fecha_hora_inscripcion;
        this.estado = inscripcion.estado_descripcion;
    }
}