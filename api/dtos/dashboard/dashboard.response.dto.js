export default class DashboardResponseDTO {
    constructor(datos) {
        this.idCurso = datos.id_curso;
        this.nombre = datos.nombre;
        this.fechaInicio = datos.fecha_inicio;
        this.cupoMaximo = datos.inscriptos_max;
        this.totalInscriptos = datos.total_inscriptos;
        this.fechaUltimaInscripcion = datos.ultima_inscripcion;
        this.disponibilidad = this.cupoMaximo - this.totalInscriptos;
    }
}