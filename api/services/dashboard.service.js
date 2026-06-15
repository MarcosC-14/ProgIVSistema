import DashboardRepository from "../repositories/dashboard.repository.js";
import DashboardResponseDTO from "../dtos/dashboard/dashboard.response.dto.js";
import BaseService from "./base.services.js";

export default class DashboardService extends BaseService{
    constructor(){
        super();
        this.repository = new DashboardRepository();
    }

    async getCursosRecientes(){
        const respuestaBD = await this.repository.obtenerCursosRecientes();
        const respuesta = respuestaBD.map(datos => (new DashboardResponseDTO(datos)))
        return  respuesta;
    }

}