import DashboardService from "../services/dashboard.service.js";

export default class DashboardController{
    constructor() {
        this.service = new DashboardService();
    }

    async getCursosRecientes(req,res){
        try{
            const cursosRecientes = await this.service.getCursosRecientes();

            return res.status(200).json({
                status: "success",
                message: "Cursos recientes obtenidos exitosamente",
                data: cursosRecientes
            })
        } catch(error){
            return res.status(500).json({
                status: "error",
                message: "Fallo estructural al obtener los cursos recientes",
                detail: error.message
            });
        }
    }

}