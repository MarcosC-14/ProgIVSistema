export default class InscripcionesCreateDTO {
    constructor(idCurso, idEstudiante, idUsuarioModificacion) {
        this.idCurso = idCurso;
        this.idEstudiante = idEstudiante;
        this.idUsuarioModificacion = idUsuarioModificacion;
    }
}