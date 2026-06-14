import puppeteer, {Browser} from "puppeteer";
import Handlebars from "handlebars";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Singleton para generar pdfs
let browserInstance = null;

export default class InformesServices{
    static KEYS_MAP_JOIN = {
        idInscripcion: 'i.id_inscripcion',
        estudianteNombre: 'e.nombre',
        cursoNombre: 'c.nombre',
        estudianteApellido: 'e.apellido',
        estudianteDocumento: 'e.documento'
    }

    static async obtenerNavegador() {
        if (!browserInstance) {
            browserInstance = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
        return browserInstance;
    }

    certificacionCursoEstudiante = async (datos) => {
        const plantillaPath = path.join(__dirname, '../utiles/handlebars/certificadoPorEstudianteCurso.hbs');
        const plantillaHtml = fs.readFileSync(plantillaPath, 'utf-8');

        const template = Handlebars.compile(plantillaHtml);
        
        const fechaActual = new Date();
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        const logoPath = path.join(__dirname, '../assets/logo-transparente.png');
        const imagenBifurcada = fs.readFileSync(logoPath);
        const MI_LOGO_BASE64 = `data:image/png;base64,${imagenBifurcada.toString('base64')}`;

        const html = template (
            {
                NOMBRES: datos.estudiante_nombres,
                APELLIDOS: datos.estudiante_apellido,
                documento: datos.documento,
                NOMBRE_DEL_CURSO: datos.curso_nombre,
                id_inscripcion: datos.id_inscripcion,
                Día: fechaActual.getDate(),
                Mes: meses[fechaActual.getMonth()],
                Año: fechaActual.getFullYear(),
                logoBase64: MI_LOGO_BASE64
            }
        );

        const browser = await InformesServices.obtenerNavegador();
        
        const pagina = await browser.newPage();

        await pagina.setContent(html);

        try {
            await pagina.setContent(html, { waitUntil: 'networkidle0' });

            const pdf = await pagina.pdf({
                format: 'A4' ,
                printBackground: true
            });

            return pdf;
        } finally{
            await pagina.close();
        }
    }
}