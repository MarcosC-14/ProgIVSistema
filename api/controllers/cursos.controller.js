import CursosService from "../services/cursos.service.js";

export default class CursosController {
    constructor() {
        this.service = new CursosService();
    }

    async getAll(req, res) {
        try {

            const { filter, limit, offset, order} = req;
            const cursos = await this.service.getAll(filter, limit, offset, order);
            res.status(200).json(cursos);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los cursos' });
        }
    }
    async getById(req, res){
        try{
            const {id}= req.params;
            const curso =  await this.service.getById(id);

            res.status(200).json(curso);
        }catch(error){
            console.error(error);
            if(error.message=="Curso no encontrado"){
                return res.status(404).json({error: error.message});
            }
            res.status(500).json({error: 'Error al obtener el curso'});
        }
    }

    async create (req, res){
        try{
                    
            const curso = await this.service.create(req.body);
            res.status(200).json(curso);

        }catch(error){
            console.error(error);
            res.status(500).json({error: 'Error al crear el curso'});
        }
    }
    async update (req, res){
        try{
            const {id} = req.params;

            const curso = await this.service.update(id, req.body);
            res.status(200).json(curso);
        }catch(error){
            console.error(error);
            if(error.message=="Curso no encontrado"){
                return res.status(404).json({error: error.message});
            }
            res.status(500).json({error: 'Error al actualizar el curso'});
        }
    }
    async borrar(req, res){
        try{
            const {id}= req.params;
            const resultado= await this.service.borrar(id);
            res.status(200).json(resultado);
        }catch(error){
            console.error(error);
            if(error.message == "Curso no encontrado"){
                return res.status(404).json({error: error.message});
            }
            res.status(500).json({error: 'Error al eliminar el curso' });
        }
    }

}