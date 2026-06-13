export default class estudiantesCreateDTO {
    constructor(body) {
        this.documento = body.documento;
        this.apellido = body.apellido;
        this.nombres = body.nombres;
        this.email = body.email;
        this.fecha_nacimiento = body.fecha_nacimiento;
        this.activo = body.activo;
        this.id_usuario_modificacion = body.id_usuario_modificacion;
    }
}