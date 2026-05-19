import express from 'express';
import cors from 'cors';
import routerV2 from './routes/v2/routes.js';
import CursosEstadosController from "./controllers/cursosEstados.controller.js";

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routerV2);



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

const estadosController = new CursosEstadosController();
app.get('/api/estados', estadosController.getAll.bind(estadosController));