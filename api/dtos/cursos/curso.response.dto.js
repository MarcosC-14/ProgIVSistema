export default class CursoResponseDTO {
    //lleva de base y lleva a frontend
    constructor(curso) {
        this.nombre = curso.nombre;
        this.descripcion = curso.descripcion;
        this.fechaInicio = curso.fecha_inicio;
        this.cantidadHoras = curso.cantidad_horas;        
        this.inscriptosMax = curso.inscriptos_max;
        this.idCursoEstado = curso.id_curso_estado;
        this.idCurso = curso.id_curso;
    }
}