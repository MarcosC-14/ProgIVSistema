import * as bootstrap from 'bootstrap';

const URL_API_CURSOS = '/api/cursos';
const URL_API_CURSOS_ESTADOS = '/api/estados';

let paginaActual = 1;
const limitePorPagina = 10;

document.addEventListener('DOMContentLoaded', () => {
    cargarCursos(1);
    configurarEventos();
    cargarEstados();
    cargarEstadosCheckboxes();


    //Esto es para lo del link rápido a cursos activos en los requisitos
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idCursoRuta = parametrosUrl.get('verCurso');
    
    if (idCursoRuta) {
        abrirModalEdicion(idCursoRuta);
    }

});

/**
 * 1. Función para obtener los cursos del Backend y listarlos en la tabla
 */
async function cargarCursos(paginaReq = 1) {
    const tbody = document.getElementById('tbody');
    const divError = document.getElementById('error');

    // Actualizar página actual
    paginaActual = paginaReq;

    // Cálculo del offset
    const offset = (paginaActual - 1) * limitePorPagina;

    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <div class="mt-2 text-muted">Obteniendo cursos desde el servidor...</div>
            </td>
        </tr>
    `;
    
    try {
        // Valores del formulario de busqueda
        const buscarId = document.getElementById('buscarId')?.value.trim() || "";
        const buscarTexto = document.getElementById('buscarTexto')?.value.trim() || "";

        const params = new URLSearchParams();
        params.append('limit', limitePorPagina);
        params.append('offset',offset);

        if (buscarId !== ""){
            params.append('idCurso', buscarId);
        }
        if (buscarTexto !== ""){
            params.append('termino', buscarTexto);
        }

        const checkboxEstados = document.querySelectorAll('.check-estado:checked');
        checkboxEstados.forEach(cb =>{
            params.append('idCursoEstado', cb.value);
        })

        const respuesta = await fetch(`${URL_API_CURSOS}?${params.toString()}`, {
            method: 'GET',
            headers: obtenerHeadersParaAuth()
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo conectar con el servidor');
        }
        
        const datos = await respuesta.json();
        const cursos = datos.respuesta;
        
        // Limpiamos el tbody por si tenía datos viejos
        tbody.innerHTML = '';
        divError.style.display = 'none';

        if (!cursos || cursos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay cursos registrados actualmente.</td></tr>`;
            mostrarControlesPaginacion(0);
            return;
        }

        // Recorremos cada curso y creamos su fila
        cursos.forEach(curso => {
            const fechaFormateada = new Date(curso.fechaInicio).toLocaleDateString('es-AR');

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${curso.idCurso}</td>
                <td><strong>${curso.nombre}</strong></td>
                <td>${curso.descripcion}</td>
                <td>${fechaFormateada}</td>
                <td>${curso.cantidadHoras} hs</td>
                <td>${curso.inscriptosMax}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-editar" title="Ver" data-id="${curso.idCurso}">👁️</button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        // Asigna eventos a los botones que acabamos de crear
        asignarEventosBotones();

        // Guardamos el total de cursos para la paginación
        const totalCursos = datos.totalCursos || 0;
        mostrarControlesPaginacion(totalCursos);

    } catch (error) {
        console.error('Error al cargar cursos:', error);
        tbody.innerHTML = '';
        divError.textContent = 'Hubo un problema al cargar el listado de cursos. Recargue la página.';
        divError.style.display = 'block';
    }
}

/**
 * Función para mostrar los botones de paginación
 */
function mostrarControlesPaginacion(totalCursos) {
    const contenedor = document.getElementById("paginacion-contenedor");
    
    contenedor.innerHTML = "";

    const totalPaginas = Math.ceil(totalCursos / limitePorPagina);

    if (totalPaginas <= 1) return;

    // Botón Anterior
    const liAnterior = document.createElement("li");
    liAnterior.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    liAnterior.innerHTML = `<button class="page-link">Anterior</button>`;
    if (paginaActual > 1) {
        liAnterior.addEventListener("click", () => cargarCursos(paginaActual - 1));
    }
    contenedor.appendChild(liAnterior);

    // Botones Numéricos
    for (let i = 1; i <= totalPaginas; i++) {
        const liNumero = document.createElement("li");
        liNumero.className = `page-item ${paginaActual === i ? 'active' : ''}`;
        liNumero.innerHTML = `<button class="page-link">${i}</button>`;

        if (paginaActual !== i) {
            liNumero.addEventListener("click", () => cargarCursos(i));
        }
        contenedor.appendChild(liNumero);
    }

    // Botón Siguiente
    const liSiguiente = document.createElement("li");
    liSiguiente.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
    liSiguiente.innerHTML = `<button class="page-link">Siguiente</button>`;
    if (paginaActual < totalPaginas) {
        liSiguiente.addEventListener("click", () => cargarCursos(paginaActual + 1));
    }
    contenedor.appendChild(liSiguiente);
}

/**
 * 2. Configuración de eventos iniciales (como el botón agregar)
 */
function configurarEventos() {
    const btnAgregar = document.getElementById('btnAgregarCurso');
    const formCurso = document.getElementById('formCurso');
    const btnEliminar = document.getElementById('btnEliminar');
    const btnConfirmarAccion = document.getElementById('btnConfirmarAccion');
    const btnBusqueda = document.getElementById('lupa');

   if (btnBusqueda) {
        btnBusqueda.addEventListener('click', (e) => {
            e.preventDefault();
            cargarCursos(1);
        });
    }


    btnAgregar.addEventListener('click', () => {
        formCurso.reset();
        document.getElementById('modalIdCurso').value = '';
        document.getElementById('modalCursoLabel').textContent = 'Nuevo Curso';
        document.getElementById('btnEliminar').style.display = 'none';
        document.getElementById('btnGuardar').textContent= 'Crear Curso';
        document.getElementById('modalDescripcion').value="";

        // Control de que la fecha no sea anterior al día actual
        const inputFecha = document.getElementById('modalFecha');
        const hoy = new Date().toISOString().split('T')[0];
        inputFecha.setAttribute('min', hoy);
    });

    // Escuchamos el Submit del Formulario (Sirve tanto para crear como para actualizar)
    formCurso.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos que la página se recargue
        await guardarCurso();
    });

    // Escuchamos el clic del botón Eliminar
    btnEliminar.addEventListener('click', () => {
        eliminarCurso();
    });
    
    btnConfirmarAccion.addEventListener('click', async()=>{
        const idCurso = document.getElementById('modalIdCurso').value;
        if(!idCurso) return;

        try{
            const respuesta = await fetch(`${URL_API_CURSOS}/${idCurso}`, {
            method: 'DELETE',
            headers: obtenerHeadersParaAuth()
        });

            if (!respuesta.ok) {
                throw new Error('No se pudo eliminar el curso del servidor');
            }

            cerrarTodosLosModales();

            // Refrescar datos y notificar éxito
            await cargarCursos(paginaActual);
            mostrarToast("Curso Eliminado con éxito.");

        }catch(error){
            console.error('Error al eliminar curso:', error);
            cerrarTodosLosModales();
            mostrarErrorAviso("Ocurrió un error al intentar eliminar el curso."); 
        }
    })
}

/**
 * 3. Asigna el evento de edición a los botones de la tabla
 */
function asignarEventosBotones() {
    const botonesEditar = document.querySelectorAll('.btn-editar');
    botonesEditar.forEach(boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            await abrirModalEdicion(id);
        });
    });
}

/**
 * 4. Busca un curso por ID y llena el modal para editarlo (Lógica del GET por ID)
 */
async function abrirModalEdicion(id) {
    try {
        const respuesta = await fetch(`${URL_API_CURSOS}/${id}`, {
            method: 'GET',
            headers: obtenerHeadersParaAuth()
        });
        if (!respuesta.ok) throw new Error('No se pudo obtener el detalle del curso');
        
        const curso = await respuesta.json();

        // Llenamos los inputs del modal con la data que vino de Postgres
        document.getElementById('modalIdCurso').value = curso.idCurso || id;
        document.getElementById('modalNombre').value = curso.nombre;
        document.getElementById('modalDescripcion').value = curso.descripcion;
        const estadoCurso = curso.idCursoEstado;
        if (estadoCurso) {
            document.getElementById('modalEstadoCurso').value = estadoCurso;
        }
        // Formateamos la fecha al formato YYYY-MM-DD
        const inputFecha = document.getElementById('modalFecha');
        inputFecha.removeAttribute('min');

        if (curso.fechaInicio) {
            inputFecha.value = curso.fechaInicio.split('T')[0];
        }
        
        document.getElementById('modalHoras').value = curso.cantidadHoras;
        document.getElementById('modalCupo').value = curso.inscriptosMax;

        // Modificamos el aspecto del modal para que sea de edición
        document.getElementById('modalCursoLabel').textContent = 'Modificar Curso';
        document.getElementById('btnEliminar').style.display = 'block';
        document.getElementById('btnGuardar').textContent= 'Modificar Curso';

        // Abrimos el modal usando la instancia de Bootstrap
        const modalCurso = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCurso'));
        modalCurso.show();

    } catch (error) {
        console.error(error);
        mostrarErrorAviso("Ocurrió un error al intentar cargar los detalles del curso.");
    }
}

/**
 * 5. Crear y Modifica cursos
 */
async function guardarCurso() {
    // Bloquear botón de guardado.
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.disabled = true;
    const textoOriginal = btnGuardar.textContent;

    const idCurso = document.getElementById('modalIdCurso').value;
    const estado = document.getElementById('modalEstadoCurso').value; 
    const nombreFinal = document.getElementById('modalNombre').value.trim();
    const descripcionFinal = document.getElementById('modalDescripcion').value.trim();
    const fechaFinal = document.getElementById('modalFecha').value;

    // Control de ingreso
    let errorDeIngreso = false;
    let mensajeDeErrorDeIngreso = "";
    

    if (nombreFinal.length <= 5 || 
            nombreFinal.length > 45 ||
            descripcionFinal.length <= 5 ||
            descripcionFinal.length <= 5 ||
            descripcionFinal.length > 500
        ){
        mensajeDeErrorDeIngreso = "El nombre y la descripción no pueden estar vacíos y deben tener entre 5 y 45 caracteres.";
        errorDeIngreso = true;
    } else if(!fechaFinal) {
        mensajeDeErrorDeIngreso = "La fecha de inicio es obligatoria.";
        errorDeIngreso = true;
    } else {
        const anioIngresado = parseInt(fechaFinal.split('-')[0], 10);
        if (anioIngresado > 2099) {
            mensajeDeErrorDeIngreso = "El año de la fecha no debe superar el límite máximo de 2099.";
            errorDeIngreso = true;
        }
    }

    if (errorDeIngreso){
        mostrarErrorAviso(mensajeDeErrorDeIngreso);
        cerrarModalPorId('modalCurso');
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
        return;
    }

    const datosCurso = {
        nombre: nombreFinal,
        descripcion: descripcionFinal,
        fechaInicio: fechaFinal,
        cantidadHoras: parseInt(document.getElementById('modalHoras').value) || 0,
        inscriptosMax: parseInt(document.getElementById('modalCupo').value) || 0,
        idCursoEstado: parseInt(document.getElementById('modalEstadoCurso').value),
    };

    let url = URL_API_CURSOS;
    let metodo = 'POST';

    // Si el idCurso existe, significa que estamos editando, cambiamos url y método
    if (idCurso) {
        url = `${URL_API_CURSOS}/${idCurso}`;
        metodo = 'PUT';
    }

    try {
        console.log("Intento", url,  {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosCurso)});
        const respuesta = await fetch(url, {
            method: metodo,
            headers: obtenerHeadersParaAuth(true),
            body: JSON.stringify(datosCurso)
        });

        if (!respuesta.ok) {
            throw new Error('Error al procesar la solicitud en el servidor');
        }

        cerrarModalPorId('modalCurso');
        
        await cargarCursos(paginaActual);

        mostrarToast("Curso Guardado con éxito.");
        
    } catch (error) {
        console.error('Error al guardar curso:', error);
        mostrarErrorAviso("Ocurrió un error al intentar guardar el curso.");
    } finally{
        cerrarModalPorId('modalCurso');
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
    }
}

/**
 *  Control flujo
 */
function eliminarCurso() {
    const idCurso = document.getElementById('modalIdCurso').value;
    if (!idCurso) return;

    // Solo abrimos el modal de confirmación
    const modalConfirm = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalConfirmacion'));
    modalConfirm.show();
}
    
async function cargarEstados() {
    const selectEstado = document.getElementById('modalEstadoCurso');
    
    try {
        // Hacemos el fetch que consulta la tabla cursos_estados
        const respuesta = await fetch(URL_API_CURSOS_ESTADOS, {
            method: 'GET',
            headers: obtenerHeadersParaAuth()
        }); 

        if (!respuesta.ok) {
            throw new Error('No se pudieron obtener los estados');
        }

        const estados = await respuesta.json();

        selectEstado.innerHTML = '<option selected disabled value="">Selecciona un estado ...</option>';

        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.idCursoEstado;
            option.textContent = estado.descripcion;
            selectEstado.appendChild(option);
        });

    } catch (error) {
        console.error('Error al rellenar el select de estados:', error);
    }
}

async function cargarEstadosCheckboxes() {
    const contenedor = document.getElementById("contenedor-checkboxes-estados");

    try {
        const respuesta = await fetch(URL_API_CURSOS_ESTADOS, {
            method: 'GET',
            headers: obtenerHeadersParaAuth()
        }); 

        if (!respuesta.ok) {
            throw new Error('No se pudieron obtener los estados');
        }

        const estados = await respuesta.json();

        contenedor.innerHTML="";

        estados.forEach(estado => {
            const checkboxHTML = `
                <div class="form-check">
                    <input class="form-check-input check-estado" 
                            type="checkbox" 
                            value="${estado.idCursoEstado}" 
                            id="estado_${estado.idCursoEstado}" 
                            name="estados">
                    <label class="form-check-label" for="estado_${estado.idCursoEstado}">
                        ${estado.descripcion}
                    </label>
                </div>
            `;
            // Lo sumamos al contenedor
            contenedor.insertAdjacentHTML("beforeend", checkboxHTML);
        });
    }catch (error) {
        console.error("Hubo un problema al cargar los estados de los cursos:", error);
        contenedor.innerHTML = `<span class="text-danger small">No se pudieron cargar los estados</span>`;
    }
} 

function cerrarModalPorId(idModal) {
    const el = document.getElementById(idModal);
    const instance = bootstrap.Modal.getInstance(el);
    if (instance) instance.hide();
}

function cerrarTodosLosModales() {
    cerrarModalPorId('modalConfirmacion');
    cerrarModalPorId('modalCurso');
}

function mostrarToast(mensaje) {
    const elToast = document.getElementById('miToast');
    const toastMensaje = document.getElementById("contenidoToast");
    toastMensaje.innerHTML = `<p>${mensaje}</p>`;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(elToast);
    toastBootstrap.show();
}

function mostrarErrorAviso(mensaje) {
    const errorGuardar = document.getElementById("error");
    if (errorGuardar) {
        errorGuardar.innerHTML = `<p>${mensaje}</p>`;
        errorGuardar.style.display = "block";
        window.scrollTo(0, 0);
        setTimeout(() => {
            errorGuardar.style.display = "none";
        }, 3000);
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