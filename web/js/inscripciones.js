const URL_API_INSCRIPCIONES = 'http://localhost:3000/api/inscripciones';
const URL_API_CURSOS = 'http://localhost:3000/api/cursos';
const URL_API_ESTUDIANTES = 'http://localhost:3000/api/estudiantes';

let paginaActual = 1;
const limitePorPagina = 10;
let peticionesTimer;

let filtrosAplicados = {
    idInscripcion: '',
    estudianteTermino: '',
    idCurso: ''
};


document.addEventListener("DOMContentLoaded", async function(){
    cargarTablaInscripciones(1);
    configurarEventos();
    cargarCursosSelect();
});


async function cargarTablaInscripciones(paginaReq = 1){
    const tabla = document.getElementById("tbody");
    const errorDiv = document.getElementById("error");
    paginaActual = paginaReq;
    const offset = (paginaActual - 1) * limitePorPagina;

    tabla.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <div class="mt-2 text-muted">Obteniendo inscripciones...</div>
            </td>
        </tr>
    `;
    
    try {
        const queryParams = new URLSearchParams({
            limit: limitePorPagina,
            offset: offset
        });

        // Si existen filtros en memoria, se suman al url
        if (filtrosAplicados.idInscripcion) queryParams.append('idInscripcion', filtrosAplicados.idInscripcion);
        if (filtrosAplicados.estudianteTermino) queryParams.append('estudianteTermino', filtrosAplicados.estudianteTermino);
        if (filtrosAplicados.idCurso) queryParams.append('idCurso', filtrosAplicados.idCurso);

        const respuesta = await fetch(`${URL_API_INSCRIPCIONES}?${queryParams.toString()}`);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        const datos = await respuesta.json();
        tabla.innerHTML = "";
        errorDiv.style.display = "none";
    
        if (datos.data && datos.data.length > 0) {
            datos.data.forEach(inscripcion => {
                const fila = document.createElement("tr");
                const fechaTabla = new Date(inscripcion.fechaInscripcion).toLocaleString("es-AR", { hour12: false });

                fila.innerHTML = `
                    <td class="text-center">${inscripcion.idInscripcion}</td>
                    <td class="text-center">${inscripcion.idCurso}</td>
                    <td class="text-center"><strong>${inscripcion.cursoNombre}</strong></td>
                    <td class="text-center">${inscripcion.idEstudiante}</td>
                    <td class="text-center">${inscripcion.estudianteApellido}, ${inscripcion.estudianteNombres}</td>
                    <td class="text-center">${inscripcion.documento}</td>
                    <td class="text-center">${fechaTabla}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-primary btn-ver" title="Ver Detalle" data-id="${inscripcion.idInscripcion}">👀👁️</button>
                        <button class="btn btn-sm btn-outline-primary btn-diploma" title="Generar Diploma" data-id="${inscripcion.idInscripcion}">🖨️📄📜</button>
                    </td>
                `;
                tabla.appendChild(fila);
            });

            asignarEventosBotonesVer();
            asignarEventosBotonesDiploma();

        } else {
            tabla.innerHTML = `<tr><td colspan="8" class="text-center">No hay inscripciones registradas.</td></tr>`;
        }

        const totalInscripciones = datos.totalInscripciones || 0;
        mostrarControlesPaginacion(totalInscripciones);

    } catch (error) {
        console.error("Error en la obtención de datos:", error);
        tabla.innerHTML = "";
        mostrarErrorAviso("Error de conexión al cargar el listado de inscripciones.");
    }   
}


/**
 * 2. Renderizado de Paginación
 */
function mostrarControlesPaginacion(totalInscripciones) {
    const contenedor = document.getElementById("paginacion-contenedor");
    contenedor.innerHTML = "";

    const totalPaginas = Math.ceil(totalInscripciones / limitePorPagina);
    if (totalPaginas <= 1) return;

    // Botón Anterior
    const liAnterior = document.createElement("li");
    liAnterior.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    liAnterior.innerHTML = `<button class="page-link">Anterior</button>`;
    if (paginaActual > 1) {
        liAnterior.addEventListener("click", () => cargarTablaInscripciones(paginaActual - 1));
    }
    contenedor.appendChild(liAnterior);

    // Botones Numéricos
    for (let i = 1; i <= totalPaginas; i++) {
        const liNumero = document.createElement("li");
        liNumero.className = `page-item ${paginaActual === i ? 'active' : ''}`;
        liNumero.innerHTML = `<button class="page-link">${i}</button>`;
        if (paginaActual !== i) {
            liNumero.addEventListener("click", () => cargarTablaInscripciones(i));
        }
        contenedor.appendChild(liNumero);
    }

    // Botón Siguiente
    const liSiguiente = document.createElement("li");
    liSiguiente.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    liSiguiente.innerHTML = `<button class="page-link">Siguiente</button>`;
    if (paginaActual < totalPaginas) {
        liSiguiente.addEventListener("click", () => cargarTablaInscripciones(paginaActual + 1));
    }
    contenedor.appendChild(liSiguiente);
}



/**
 * 3. Configuración de Listeners del DOM
 */
function configurarEventos() {
    const btnAgregar = document.getElementById('btnAgregarCurso');
    const formInscripcion = document.getElementById('formInscripcion');
    const inputBuscar = document.getElementById('modalBuscarEstudiante');
    const listaResultados = document.getElementById('resultados-estudiantes');
    const inputHiddenId = document.getElementById('modalIdEstudiante');
    const btnEliminar = document.getElementById('btnEliminar');
    const btnConfirmarAccion = document.getElementById('btnConfirmarAccion');
    const btnEliminarDesdeDetalle = document.getElementById('btnEliminarDesdeDetalle');
    const formBusqueda = document.getElementById('formBusquedaInscripciones');

    // Apertura del modal para Alta
    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            formInscripcion.reset();
            document.getElementById('modalIdInscripcion').value = '';
            inputHiddenId.value = '';
            document.getElementById('modalInscripcionLabel').textContent = 'Nueva Inscripción';
            btnEliminar.style.display = 'none';
            document.getElementById('btnGuardar').textContent = 'Registrar Inscripción';
            document.getElementById('btnGuardar').style.display = 'block';
            
            // Habilitamos los controles
            document.getElementById('modalSelectCurso').disabled = false;
            inputBuscar.disabled = false;
            listaResultados.style.display = 'none';
        });
    }

    if (formBusqueda) {
        formBusqueda.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita recargar la página

            filtrosAplicados = {
                idInscripcion: document.getElementById('buscarId').value.trim(),
                estudianteTermino: document.getElementById('buscarDocumento').value.trim(),
                idCurso: document.getElementById('buscarIdCurso').value
            };

            cargarTablaInscripciones(1);
        });
    }

    if (btnEliminarDesdeDetalle) {
        btnEliminarDesdeDetalle.addEventListener('click', () => {
            document.getElementById('modalIdInscripcion').value = document.getElementById('detIdInscripcion').textContent;
            
            cerrarModalPorId('modalDetalleInscripcion');
            const modalConfirm = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalConfirmacion'));
            modalConfirm.show();
        });
    }

    // Typeahead para búsqueda de estudiantes
    inputBuscar.addEventListener('input', (e) => {
        const query = e.target.value.trim().toUpperCase();
        clearTimeout(peticionesTimer); 

        if (query.length < 2) {
            listaResultados.style.display = 'none';
            inputHiddenId.value = ''; 
            return;
        }

        peticionesTimer = setTimeout(async () => {
            try {
                //NOTA cambiar una vez haya uno de termino en estudiantes si los hay
                const response = await fetch(`${URL_API_ESTUDIANTES}?limit=5&termino=${query}`);
                if (!response.ok) throw new Error("Error en la red");
                
                const data = await response.json();
                const estudiantes = data.respuesta;
                listaResultados.innerHTML = '';
                console.log(estudiantes);
                if (estudiantes.length === 0) {
                    listaResultados.innerHTML = '<li class="list-group-item text-muted">Sin resultados</li>';
                } else {
                    estudiantes.forEach(est => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item list-group-item-action clickeable';
                        li.textContent = `${est.documento} - ${est.apellido}, ${est.nombres}`;
                        
                        // Selección de un item de la lista
                        li.addEventListener('click', () => {
                            inputHiddenId.value = est.idEstudiante || est.id_estudiante;
                            inputBuscar.value = `${est.apellido}, ${est.nombres}`;
                            listaResultados.style.display = 'none';
                        });
                        listaResultados.appendChild(li);
                    });
                }
                listaResultados.style.display = 'block';
            } catch (error) {
                cerrarTodosLosModales();
                console.error("Error en Typeahead:", error);
            }
        }, 300); 
    });

    // Cerrar listado asíncrono si se hace clic fuera del input
    document.addEventListener('click', (e) => {
        if (e.target !== inputBuscar && e.target !== listaResultados) {
            listaResultados.style.display = 'none';
        }
    });

    // Submit del Formulario
    formInscripcion.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        await guardarInscripcion();
    });

    // Disparador de la advertencia de eliminación
    btnEliminar.addEventListener('click', () => {
        const modalConfirm = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalConfirmacion'));
        modalConfirm.show();
    });

    // Confirmación final de eliminación
    btnConfirmarAccion.addEventListener('click', async () => {
        await eliminarInscripcion();
    });
}

/**
 * 4. Precarga del elemento Select de Cursos
 */
async function cargarCursosSelect() {
    const selectCursoModal = document.getElementById('modalSelectCurso');
    const selectCursoFiltro = document.getElementById('buscarIdCurso');
    
    try {
        const respuesta = await fetch(`${URL_API_CURSOS}?limit=50`); // NOTA Capaz poner un order por fecha desc? 
        if (!respuesta.ok) throw new Error('Error obteniendo cursos');
        const datos = await respuesta.json();
        const cursos = datos.respuesta; 
        
        let opcionesHTML = '';
        cursos.forEach(curso => {
            opcionesHTML += `<option value="${curso.idCurso}">${curso.nombre}</option>`;
        });

        if (selectCursoModal) {
            selectCursoModal.innerHTML = '<option value="" selected disabled>-- Seleccione un curso --</option>' + opcionesHTML;
        }
        
        // Inyectamos las opciones en el Filtro de búsqueda general
        if (selectCursoFiltro) {
            selectCursoFiltro.innerHTML = '<option value="">Todos los cursos</option>' + opcionesHTML;
        }

    } catch (error) {
        console.error("Error cargando cursos:", error);
    }
}

/**
 * 5. Asignación de evento para ver detalle de la inscripción
 */
function asignarEventosBotonesVer() {
    const botonesVer = document.querySelectorAll('.btn-ver');
    botonesVer.forEach(boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            await abrirModalDetalle(id);
        });
    });
}

function asignarEventosBotonesDiploma() {
    const botonesDiploma = document.querySelectorAll('.btn-diploma');
    botonesDiploma.forEach(boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            await generarDiploma(id);
        });
    });
    
}

/**
 * 5.5 Intento 1 de generar diploma:
 */

async function generarDiploma(id){
    /*
    try{
        console.log(id);
        console.log(`${URL_API_INSCRIPCIONES}/${id}/diploma`);
        const respuesta = await fetch(`${URL_API_INSCRIPCIONES}/${id}/diploma`);
    } catch (error){
        console.error(error);
        mostrarErrorAviso("Ocurrió un error al intentar generar un diploma.");
    }
    */
    
    const boton = document.querySelector(`.btn-diploma[data-id="${id}"]`);
    const textoOriginal = boton.textContent;
    
    try {
        // Bloquear el botón para evitar concurrencia de peticiones
        boton.disabled = true;
        boton.textContent = 'Generando...';

        const respuesta = await fetch(`${URL_API_INSCRIPCIONES}/${id}/diploma`);

        // 2. Interceptar errores estructurados del backend
        if (!respuesta.ok) {
            const errorEstructurado = await respuesta.json();
            throw new Error(errorEstructurado.message || 'Error HTTP en la obtención del diploma');
        }

        // 3. Conversión del flujo de bytes a un Binary Large Object (Blob)
        const blob = await respuesta.blob();

        // 4. Creación de una URL local en memoria referenciando al Blob
        const urlBlob = window.URL.createObjectURL(blob);

        // 5. Creación programática de un nodo de anclaje para forzar la escritura en disco
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `Certificado_Inscripcion_${id}.pdf`; // Atributo que fuerza la descarga
        
        document.body.appendChild(a);
        a.click();
        
        // 6. Limpieza del DOM y liberación de memoria
        a.remove();
        window.URL.revokeObjectURL(urlBlob);

    } catch (error) {
        console.error("Fallo durante la generación del diploma:", error);
        mostrarErrorAviso(error.message);
    } finally {
        // Restaurar estado original de la UI
        if (boton) {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    }
}

/**
 * 6. Visualización de Registro Existente (Solo Lectura)
 */
async function abrirModalDetalle(id) {
    try {
        const respuesta = await fetch(`${URL_API_INSCRIPCIONES}/${id}`);
        if (!respuesta.ok) throw new Error('No se pudo obtener el detalle de la inscripción');
        const respuestaJson = await respuesta.json(); //NOTA testing
        const inscripcion = respuestaJson.data;
        
        // Mapeo directo a los nodos de texto del DOM
        document.getElementById('detIdInscripcion').textContent = inscripcion.idInscripcion || id;
        
        // Formateo de fecha
        const fechaLocal = new Date(inscripcion.fechaInscripcion).toLocaleString("es-AR", { hour12: false });
        document.getElementById('detFecha').textContent = fechaLocal;

        // Datos del Curso
        document.getElementById('detIdCurso').textContent = inscripcion.idCurso;
        document.getElementById('detCursoNombre').textContent = inscripcion.cursoNombre;

        // Datos del Estudiante
        document.getElementById('detIdEstudiante').textContent = inscripcion.idEstudiante;
        document.getElementById('detEstudianteNombre').textContent = `${inscripcion.estudianteApellido}, ${inscripcion.estudianteNombres}`;
        document.getElementById('detDocumento').textContent = inscripcion.documento;

        // mostrar del modal
        const modalInstance = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalDetalleInscripcion'));
        modalInstance.show();

    } catch (error) {
        console.error(error);
        mostrarErrorAviso("Ocurrió un error al intentar cargar los detalles de la inscripción.");
    }
}


/**
 * 7. Ejecución de petición POST
 */
async function guardarInscripcion() {
    const btnGuardar = document.getElementById('btnGuardar');
    const selectCurso = document.getElementById('modalSelectCurso');
    const inputHiddenId = document.getElementById('modalIdEstudiante');

    if (!inputHiddenId.value){
        cerrarTodosLosModales();
        mostrarErrorAviso("Debe seleccionar un estudiante válido del listado desplegable.");
        return;
    }

    btnGuardar.disabled = true;
    const textoOriginal = btnGuardar.textContent;

    const payload = {
        idCurso: parseInt(selectCurso.value, 10),
        idEstudiante: parseInt(inputHiddenId.value, 10),
        idUsuarioModificacion: 1 
    };

    try {
        const response = await fetch(URL_API_INSCRIPCIONES, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const result = await response.json(); 
            throw new Error(result.message || 'Error de validación en el servidor.');
        }

        cerrarTodosLosModales();
        await cargarTablaInscripciones(paginaActual);
        mostrarToast("Inscripción registrada correctamente.");

    } catch (error) {
        console.error("Fallo durante POST:", error);
        cerrarTodosLosModales();
        mostrarErrorAviso(error.message);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
    }
}

/**
 * 8. Ejecución de petición DELETE
 */
async function eliminarInscripcion() {
    const idInscripcion = document.getElementById('modalIdInscripcion').value;
    if (!idInscripcion) return;

    try {
        const respuesta = await fetch(`${URL_API_INSCRIPCIONES}/${idInscripcion}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo eliminar la inscripción en el servidor');
        }

        cerrarTodosLosModales();
        await cargarTablaInscripciones(paginaActual);
        mostrarToast("Inscripción anulada con éxito.");

    } catch (error) {
        console.error('Error al eliminar:', error);
        cerrarTodosLosModales();
        mostrarErrorAviso("Ocurrió un error al intentar eliminar la inscripción."); 
    }
}

/**
 * Funciones Utilitarias UI
 */
function cerrarModalPorId(idModal) {
    const el = document.getElementById(idModal);
    if(el) {
        const instance = bootstrap.Modal.getInstance(el);
        if (instance) instance.hide();
    }
}

function cerrarTodosLosModales() {
    cerrarModalPorId('modalConfirmacion');
    cerrarModalPorId('modalInscripcion');
    cerrarModalPorId('modalDetalleInscripcion');
}

function mostrarToast(mensaje) {
    const elToast = document.getElementById('miToast');
    if(!elToast) return;
    const toastMensaje = document.getElementById("contenidoToast");
    toastMensaje.innerHTML = `<p>${mensaje}</p>`;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(elToast);
    toastBootstrap.show();
}

function mostrarErrorAviso(mensaje) {
    const errorDiv = document.getElementById("error");
    if (errorDiv) {
        errorDiv.innerHTML = `<p>${mensaje}</p>`;
        errorDiv.style.display = "block";
        window.scrollTo(0, 0);
        setTimeout(() => { errorDiv.style.display = "none"; }, 3500);
    }
}