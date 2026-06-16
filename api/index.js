import express from 'express';
import cors from 'cors';
import routerV2 from './routes/v2/routes.js';

const app = express();

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routerV2);



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
