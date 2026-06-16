import * as bootstrap from 'bootstrap';

const URL_API_ESTUDIANTES = '/api/estudiantes';
let paginaActual = 1;
const limitePorPagina = 10;

document.addEventListener('DOMContentLoaded', () => {
    cargarEstudiantes(1);
    configurarEventos();
});

function configurarEventos() {
    const btnAgregar = document.getElementById('btnAgregarEstudiante');
    const formBusqueda = document.getElementById('formBusquedaEstudiante');
    const formEstudiante = document.getElementById('formEstudiante');
    const btnEliminar = document.getElementById('btnEliminar');
    const btnConfirmarAccion = document.getElementById('btnConfirmarAccion');

    if (formBusqueda) {
        formBusqueda.addEventListener('submit', (e) => {
            e.preventDefault();
            cargarEstudiantes(1);
        });
    }

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            document.getElementById('formEstudiante').reset();
            document.getElementById('modalIdEstudiante').value = '';
            document.getElementById('modalEstudianteLabel').textContent = 'Nuevo Estudiante';
            document.getElementById('btnGuardar').textContent = 'Guardar Estudiante';
            document.getElementById('btnEliminar').style.display = 'none';
        });
    }

    if (formEstudiante) {
        formEstudiante.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarEstudiante();
        });
    }

    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            const modalConfirmacion = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalConfirmacion'));
            modalConfirmacion.show();
        });
        
        btnConfirmarAccion.addEventListener('click', async () =>{
            await eliminarEstudiante();
        });
    }

}

async function cargarEstudiantes(paginaReq = 1) {
    const tabla = document.getElementById("tbody");
    const errorDiv = document.getElementById("error");
    
    paginaActual = paginaReq;
    const offset = (paginaActual - 1) * limitePorPagina;

    tabla.innerHTML = `
        <tr>
            <td colspan="10" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <div class="mt-2 text-muted">Cargando estudiantes...</div>
            </td>
        </tr>
    `
    try {
        const params = new URLSearchParams();
        params.append('limit', limitePorPagina);
        params.append('offset', offset);

        const buscarId = document.getElementById('buscarId')?.value.trim() || "";
        const buscarTexto = document.getElementById('buscarTexto')?.value.trim() || "";
        const buscarDoc = document.getElementById('buscarDoc')?.value.trim() || "";

        if (buscarId !== ""){
            params.append('id_estudiante', buscarId);
        }
        if (buscarTexto !== ""){
            params.append('termino', buscarTexto);
        }
        if (buscarDoc !== "") {
            params.append('documento', buscarDoc);
        }

        const respuesta = await fetch(`${URL_API_ESTUDIANTES}?${params.toString()}`, {
            method: 'GET',
            headers: obtenerHeadersParaAuth()
        });
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        const datos = await respuesta.json();

        tabla.innerHTML = "";
        errorDiv.style.display = "none";

        const listaEstudiantes = datos.respuesta || datos;

        if (!listaEstudiantes || listaEstudiantes.length === 0) {
            tabla.innerHTML = `<tr><td colspan="10" class="text-center">No se encontraron estudiantes.</td></tr>`;
            mostrarControlesPaginacion(0);
            return;
        }

        listaEstudiantes.forEach(estudiante =>{
            const fila = document.createElement("tr");
            const fechaNac = estudiante.fechaNacimiento ? 
                new Date(estudiante.fechaNacimiento).toLocaleDateString('es-AR')
                : '-';
            const fechaMod = estudiante.fechaHoraModificacion ? 
                new Date(estudiante.fechaHoraModificacion).toLocaleString('es-AR', {hour12: false})
                : '-';

            const estadoActivo = estudiante.activo ? "Si" : "No";

            fila.innerHTML = `
                <td>${estudiante.idEstudiante}</td> 
                <td>${estudiante.documento}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.nombres}</td>
                <td>${estudiante.email}</td>
                <td class="text-center">${fechaNac}</td>
                <td class="text-center">${estadoActivo}</td>
                <td class="text-center">${estudiante.idUsuarioModificacion || '-'}</td>
                <td class="text-center">${fechaMod}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary btn-ver-estudiante" data-id="${estudiante.idEstudiante}">👁️</button>
                </td>
            `;
            tabla.appendChild(fila);
        });

        asignarEventosBotones();
        mostrarControlesPaginacion(datos.totalEstudiantes || 0);

    } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
        tabla.innerHTML = "";
        mostrarErrorAviso("No se pudo conectar el servidor para cargar los estudiantes");
    }
}

function asignarEventosBotones() {
    const botonesVer = document.querySelectorAll('.btn-ver-estudiante');
    botonesVer.forEach (boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            await abrirModalEstudiante(id);
        });
    });
}

async function abrirModalEstudiante(id) {
    try {
        const respuesta = await fetch(`${URL_API_ESTUDIANTES}/${id}`, {
            method: 'GET',
            headers: obtenerHeadersParaAuth()
        });
        if (!respuesta.ok) throw new Error('No se pudo obtener el detalle del estudiante');

        const datos = await respuesta.json();
        const estudiante = datos.respuesta || datos;

        document.getElementById('modalIdEstudiante').value = estudiante.idEstudiante || id;
        document.getElementById('modalDocumento').value = estudiante.documento;
        document.getElementById('modalApellido').value = estudiante.apellido;
        document.getElementById('modalNombres').value = estudiante.nombres;
        document.getElementById('modalEmail').value = estudiante.email;

        if (estudiante.fechaNacimiento){
            document.getElementById('modalFecha').value = estudiante.fechaNacimiento.split('T')[0];
        }

        document.getElementById('modalEstudianteLabel').textContent = 'Modificar Estudiante';
        document.getElementById('btnGuardar').textContent = 'Guardar Cambios';
        document.getElementById('btnEliminar').style.display = 'block';

        const modalEstudiante = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEstudiante'));
        modalEstudiante.show();

    } catch (error){
        console.error(error);
        mostrarErrorAviso("Ocurrio un error al intenar cargar los datos del estudiante");
    }
}

async function guardarEstudiante(){
    const btnGuardar = document.getElementById('btnGuardar');
    const textoOriginal = btnGuardar.textContent;

    btnGuardar.disabled = true;
    btnGuardar.textContent = "Procesando...";

    const datosEstudiante = {
        documento: document.getElementById('modalDocumento').value.trim(),
        apellido: document.getElementById('modalApellido').value.trim().toUpperCase(),
        nombres: document.getElementById('modalNombres').value.trim().toUpperCase(),
        email: document.getElementById('modalEmail').value.trim(),
        fecha_nacimiento: document.getElementById('modalFecha').value,
        activo: 1
        };

    const idEstudiante = document.getElementById('modalIdEstudiante').value;
    let url = URL_API_ESTUDIANTES;
    let metodo = 'POST';

    if (idEstudiante) {
        url = `${URL_API_ESTUDIANTES}/${idEstudiante}`;
        metodo = 'PUT'
    }

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: obtenerHeadersParaAuth(true),
            body: JSON.stringify(datosEstudiante)
        });

        if (!respuesta.ok) {
            throw new Error('No se proceso al estudiante')
        }

        cerrarTodosLosModales();
        await cargarEstudiantes(paginaActual);
        mostrarToast("Información del estudiante guardada correctamente.");

    } catch (error) {
        console.error("Fallo guardando la información del estudiante: ", error);
        mostrarErrorAviso("Ocurrio un error al guardar la información del estudiante");
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
    }
}

async function eliminarEstudiante(){
    const idEstudiante = document.getElementById('modalIdEstudiante').value;
    if (!idEstudiante) return;

    try {
        const respuesta = await fetch(`${URL_API_ESTUDIANTES}/${idEstudiante}`, {
            method: 'DELETE',
            headers: obtenerHeadersParaAuth()
        });

        if (!respuesta.ok) throw new Error('No se pudo dar de baja al estudiante');

        cerrarTodosLosModales();
        await cargarEstudiantes(paginaActual);
        mostrarToast("Se dio de baja al estudiante exitosamente.");
    
    }catch (error){
        console.error(error);
        cerrarTodosLosModales();
        mostrarErrorAviso("Ocurrio un error al intenar dar de baja al estudiante,");
    } 
}

function mostrarControlesPaginacion(totalEstudiantes) {
    const contenedor = document.getElementById("paginacion-contenedor");
    contenedor.innerHTML = "";

    const totalPaginas = Math.ceil(totalEstudiantes / limitePorPagina);
    if (totalPaginas <= 1) return;

    const liAnterior = document.createElement("li");
    liAnterior.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
    liAnterior.innerHTML = `<button class="page-link">Anterior</button>`;
    if (paginaActual > 1) {
        liAnterior.addEventListener("click", () => cargarEstudiantes(paginaActual - 1));
    }
    contenedor.appendChild(liAnterior);

    for (let i =1; i <= totalPaginas; i++) {
        const liNumero = document.createElement("li");
        liNumero.className = `page-item ${paginaActual === i ? 'active' : ''}`;
        liNumero.innerHTML = `<button class="page-link">${i}</button>`;

        if (paginaActual !== i) {
            liNumero.addEventListener("click", () => cargarEstudiantes(i));
        }
        contenedor.appendChild(liNumero);
    }

    const liSiguiente = document.createElement("li");
    liSiguiente.className = `page-item ${paginaActual === totalPaginas ?'disabled' : ''}`;
    liSiguiente.innerHTML = `<button class="page-link">Siguiente</button>`;
    if (paginaActual < totalPaginas) {
        liSiguiente.addEventListener("click", () => cargarEstudiantes(paginaActual + 1));
    }
    contenedor.appendChild(liSiguiente);
}

function cerrarModalPorId(idModal) {
    const el = document.getElementById(idModal);
    if (el) {
        const instancia = bootstrap.Modal.getInstance(el);
        if (instancia) instancia.hide();
    }
}

function cerrarTodosLosModales() {
    cerrarModalPorId('modalConfirmacion');
    cerrarModalPorId('modalEstudiante');
}

function mostrarToast(mensaje) {
    const elToast = document.getElementById('miToast');
    const toastMensaje = document.getElementById("contenidoToast");
    if (elToast && toastMensaje) {
        toastMensaje.innerHTML = `<p class="mb-0">${mensaje}</p>`;
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(elToast);
        toastBootstrap.show();
    }
}

function mostrarErrorAviso(mensaje) {
    const errorDiv = document.getElementById("error");
    if (errorDiv) {
        errorDiv.innerHTML = `<p class="mb-0">${mensaje}</p>`;
        errorDiv.style.display = "block";
        window.scrollTo(0,0);
        setTimeout(() => {errorDiv.style.display = "none";}, 3500);
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