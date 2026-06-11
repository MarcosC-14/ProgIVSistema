const URL_API_ESTUDIANTES = 'http://localhost:3000/api/estudiantes';
let paginaActual = 1;
const limitePorPagina = 10;

let filtrosEstudiantes = {
    idEstudiante: '',
    nombres: '',
    apellido: ''
};

document.addEventListener('DOMContentLoaded', () => {
    cargarEstudiantes(1);
    configurarEventos();
});

function configurarEventos() {
    const formBusqueda = document.getElementById('formBusquedaEstudiante');

    if (formBusqueda) {
        formBusqueda.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitamos que la página se recargue por completo

            // Guardamos en la memoria global lo que el usuario escribió en la pantalla
            filtrosEstudiantes.idEstudiante = document.getElementById('buscarId').value.trim();
            filtrosEstudiantes.nombres = document.getElementById('buscarNombres').value.trim();
            filtrosEstudiantes.apellido = document.getElementById('buscarApellido').value.trim();

            // Cada vez que se busca, reiniciamos a la página 1 y llamamos al "motor"
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

        const queryParams = new URLSearchParams({
            limit: limitePorPagina,
            offset: offset
        });

        if (filtrosEstudiantes.idEstudiante) queryParams.append(`idEstudiante`, filtrosEstudiantes.idEstudiante);
        if (filtrosEstudiantes.nombres) queryParams.append(`nombres`, filtrosEstudiantes.nombres);
        if (filtrosEstudiantes.apellido) queryParams.append(`apellido`, filtrosEstudiantes.apellido);

        const respuesta = await fetch(`${URL_API_ESTUDIANTES}?${queryParams.toString()}`);
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);

        const datos = await respuesta.json();

        tabla.innerHTML = "";
        errorDiv.style.display = "none";

    } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
        tabla.innerHTML = "";
        mostrarErrorAviso("No se pudo conectar el servidor para cargar los estudiantes");
    }

    cargarEstudiantes.forEach(estudiante =>{
        const fila = document.createElement("tr");

        const fechaNac = new Date(estudiante.fecha_nacimiento). toLocaleDateString('es-AR');

        const fechaMod = estudiante.fecha_hora_modificacion ? 
        new Date(estudiante.fecha_hora_modificacion).toLocaleString('es-AR', {hour12: false})
        : `-`;

        const estadoActivo = estudiante.activo ? "Si" : "No";

        fila.innerHTML = `
            <td>${estudiante.id_estudiante}</td>
            <td>${estudiante.documento}</td>
            <td>${estudiante.apellido}</td>
            <td>${estudiante.nombres}</td>
            <td>${estudiante.email}</td>
            <td class="text-center">${fechaNac}</td>
            <td class="text-center">${estadoActivo}</td>
            <td class="text-center">${estudiante.id_usuario_modificacion || '-'}</td>
            <td class="text-center">${fechaMod}</td>
            <td class="text-center"><button class="btn btn-sm btn-outline-primary btn-ver-estudiante" data-id=${estudiante.id_estudiante}">👁️</td>
        `;

        tabla.appendChild(fila);
    })
}

function asignarEventosBotones() {
    
    const botonesVer = document.querySelectorAll('.btn-ver-estudiante');

    botonesVer.forEach (boton => {
        boton.addEventListener('click', async () => {
            
            const id = boton.getAttribute('data-id');

            await abrirModalEstudiante(id);
        })
    })
}

async function abrirModalEstudiante(id) {
    try {
        const respuesta = await fetch(`${URL_API_ESTUDIANTES}/${id}`);
        if (!respuesta.ok) throw new Error('No se pudo obtener el detalle del estudiante');

        const datos = await respuesta.json();
        const estudiante = datos.respuesta || datos;

        document.getElementById('modalIdEstudiante').value = estudiante.id_estudiante || id;
        document.getElementById('modalDocumento').value = estudiante.documento;
        document.getElementById('modalApellido').value = estudiante.apellido;
        document.getElementById('modalNombre').value = estudiante.nombres;
        document.getElementById('modalEmail').value = estudiante.email;

        if (estudiante.fecha_nacimiento){
            document.getElementById('modalFecha').value = estudiante.fecha_nacimiento.split('T')[0];
        }

        document.getElementById('modalEstudianteLabel').textContent = 'Modificar Estudiante';
        document.getElementById('btnGuardar').textContent = 'Guardar Cambios';
        document.getElementById('btnEliminar').style.display = 'block';

        const modalEstudiante = bootsrap.Modal.getOrCreateInstance(document.getElementById('modalEstudiante'));
        midModal.show();

    } catch (error){
        console.error(error);
        mostrarErrorAviso("Ocurrio un error al intenar cargar los datos del estudiante");
    }
}

async function guardarEstudiante(){
    const btnGuardar = document.getElementById('btnGuardar');
    const textoOriginal = btnGuardar.textContent;

    btnGuardar.disabled = true
    btnGuardar.textContent = "Procesando...";

    const datosEstudiante = {
        documento: document.getElementById('modalDocumento').value.trim(),
        apellido: document.getElementById('modalApellido').value.trim(),
        nombres: document.getElementById('modalNombres').value.trim(),
        email: document.getElementById('modalEmail').value.trim(),
        fecha_nacimiento: document.getElementById('modalFecha').value,
        id_usuario_modificacion: 1
    };

    const idEstudiante = document.getElementById('modalIdEstudiante').value;
    let irl = URL_API_ESTUDIANTES;
    let metodo = 'POST';

    if (idEstudiante) {
        url = `${URL_API_ESTUDIANTES}/${idEstudiante}`;
        metodo = 'PUT'
    }

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosEstudiante)
        });

        if (!respuesta.ok) {
            throw new Error('No se proceso al estudiante')
        }

        cerrarTodosLosModales();

        await cargarEstudiantes(paginaActual);

        mostrarToast("Informacion del estudiante guardada correctamente.");
    } catch (error) {
        console.error("Fallo guardando la informacion del estudiante: ", error);
        mostrarErrorAviso("Ocurrio un error al guardar la informacion del estudiante");
    
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
            method: 'DELETE'
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
    liAnterior.className = `page-item ${paginaActual === 1 ? 'disabled' : ''};`
    liAnterior.innerHTML = `<button class="page-link">Anterior</button>`;
    if (paginaActual > 1) {
        liAnterior.addEventListener("click", () => cargarEstudiantes(paginaActual - 1));
    }
    
    contenedor.appendChild(liAnterior);

    for (let i =1; i <= totalPaginas; i++) {
        const liNumero = document.createElement("li");
        liNumero.className = `page-item ${paginaActual === i ? 'active' : ''}`;
        liNumero.textContent = `<button class="page-link">${i}</button>`;

        if (paginaActual !== i) {
            liNumero.addEventListener("click", () => cargarEstudiantes(i));
        }

        contenedor.appendChild(liNumero);
    }

    const liSiguiente = document.createElement("li");
    liSiguiente.className = `page-item ${paginaActual === totalPaginas ?'disabled' : ''}`;
    liSiguiente.textContent = `<button class="page-link">Siguiente</button>`;
    if (paginaActual < totalPaginas) {
        liSiguiente.addEventListener("click", () => cargarEstudiantes(paginaActual + 1));
    }
    contenedor.appendChild(liSiguiente);
}

function cerrarModalPorId(idModal) {
    const el = document.getElementById(idModal);
    if (el) {
        const instancia = bootsrap.Modal.getInstance(el);
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
        toastMensaje.innerHTML = `<p class="mb-0>${mensaje}</p>`;
        const toastBootstrap = bootsrap.Toast.getOrCreateInstance(elToast);
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