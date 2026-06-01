export default class CursosCreateDTO {
    //de frontend a base de datos
    constructor(body) {
        this.nombre = body.nombre;
        this.descripcion = body.descripcion;
        this.fecha_inicio = body.fechaInicio;
        this.cantidad_horas = body.cantidadHoras;
        this.inscriptos_max = body.inscriptosMax;
        this.id_curso_estado = body.idCursoEstado;
        this.id_usuario_modificacion = body.idUsuarioModificacion;
    }
}