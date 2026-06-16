import * as bootstrap from 'bootstrap';

const API_CURSOS = '/api/cursos';
const API_ESTUDIANTES = '/api/estudiantes';
const API_INSCRIPCIONES = '/api/inscripciones';
const API_CURSOS_RECIENTES = '/api/dashboard/cursos-recientes';
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosDashboard();
});

async function cargarDatosDashboard() {
    const errorContenedor = document.getElementById('error-dashboard');
    
    try {
        const headersRe = {
            method: 'GET',
            headers: obtenerHeadersParaAuth()
        };

        /** Esto estaba bueno pero el pool de conexiones era lo que causaba todos los errores de vite
        *  Ahora lo hace de forma secuencial re aburrido pero más seguro supongo :(
        */
        /*
        const [resCursos, resEstudiantes, resInscripciones] = await Promise.allSettled([
            fetch(`${API_CURSOS}?limit=1`, headersRe),
            fetch(`${API_ESTUDIANTES}?limit=1`, headersRe),
            fetch(`${API_INSCRIPCIONES}?limit=1`, headersRe)
        ]);

        if (resCursos.status === 'fulfilled' && resCursos.value.ok) {
            const dataCursos = await resCursos.value.json();
            document.getElementById('kpi-cursos').textContent = dataCursos.totalCursos || 0;
        }

        if (resEstudiantes.status === 'fulfilled' && resEstudiantes.value.ok) {
            const dataEst = await resEstudiantes.value.json();
            document.getElementById('kpi-estudiantes').textContent = dataEst.totalEstudiantes || 0;
        }

        if (resInscripciones.status === 'fulfilled' && resInscripciones.value.ok) {
            const dataInsc = await resInscripciones.value.json();
            document.getElementById('kpi-inscripciones').textContent = dataInsc.totalInscripciones || 0;
        }
        */

        try {
            const resCursos = await fetch(`${API_CURSOS}?limit=1`, headersRe);
            if (resCursos.ok) {
                const dataCursos = await resCursos.json();
                document.getElementById('kpi-cursos').textContent = dataCursos.totalCursos || 0;
            }
        } catch (error) {
            console.error('Error al cargar cursos:', error);
        }

        try {
            const resEstudiantes = await fetch(`${API_ESTUDIANTES}?limit=1`, headersRe);
            if (resEstudiantes.ok) {
                const dataEst = await resEstudiantes.json();
                document.getElementById('kpi-estudiantes').textContent = dataEst.totalEstudiantes || 0;
            }
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }

        try {
            const resInscripciones = await fetch(`${API_INSCRIPCIONES}?limit=1`, headersRe);
            if (resInscripciones.ok) {
                const dataInsc = await resInscripciones.json();
                document.getElementById('kpi-inscripciones').textContent = dataInsc.totalInscripciones || 0;
            }
        } catch (error) {
            console.error('Error al cargar inscripciones:', error);
        }

        await cargarCursosActivos();

    } catch (error) {
        console.error('Error procesando datos del dashboard:', error);
        errorContenedor.textContent = 'Fallo en la sincronización de datos con el servidor.';
        errorContenedor.style.display = 'block';
    }
}

async function cargarCursosActivos() {
    const tbody = document.getElementById('tbody-cursos-activos');
    
    try {
        const respuesta = await fetch(`${API_CURSOS_RECIENTES}`, {
            method: 'GET',
            headers: obtenerHeadersParaAuth()
        });
        
        if (!respuesta.ok) throw new Error('Error en protocolo HTTP');
        
        const datos = await respuesta.json();
        const cursos = datos.data;

        tbody.innerHTML = '';
        if (!cursos || cursos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center">No hay cursos activos en el sistema.</td></tr>`;
            return;
        }

        cursos.forEach(curso => {
            const fecha = new Date(curso.fechaInicio).toLocaleDateString('es-AR');
            const fechaUltimaInscripcion = new Date(curso.fechaUltimaInscripcion).toLocaleDateString('es-AR');
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td class="text-muted">${curso.idCurso}</td>
                <td class="fw-bold">${curso.nombre}</td>
                <td class="text-center">${fecha}</td>
                <td class="text-center">${fechaUltimaInscripcion}</td>
                <td class="text-center">${curso.totalInscriptos}</td>
                <td class="text-center">${curso.cupoMaximo}</td>
                <td class="text-center">${curso.disponibilidad}</td>
                <td class="text-end pe-4">
                    <a href="cursos.html?verCurso=${curso.idCurso}" class="btn btn-sm btn-outline-primary">👁️</a>
                </td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error('Error cargando la lista de cursos:', error);
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error al cargar la tabla de cursos.</td></tr>`;
    }
}


function obtenerHeadersParaAuth(contentType=false){
    const token = localStorage.getItem('token_jwt');

    const headers = {
        'Authorization' : `Bearer ${token}`
    }

    if(contentType) headers['Content-Type'] = 'application/json';
    return headers;
}