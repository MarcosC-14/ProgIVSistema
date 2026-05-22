export default class CursosUpdateDTO {
    constructor(body) {
        this.nombre = body.nombre;
        this.descripcion = body.descripcion;
        this.fechaInicio = body.fechaInicio;
        this.cantidadHoras = body.cantidadHoras;
        this.inscriptosMax = body.inscriptosMax;
        this.idCursoEstado = body.idCursoEstado;
        this.idUsuarioModificacion = body.idUsuarioModificacion;
    }
}