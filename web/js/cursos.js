const URL_API = 'http://localhost:3000/api/cursos';

let paginaActual = 1;
const limitePorPagina = 10;

document.addEventListener('DOMContentLoaded', () => {
    cargarCursos(1);
    configurarEventos();
    cargarEstados();
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
        // Hacemos la petición GET a nuestro backend
        const respuesta = await fetch(`${URL_API}?limit=${limitePorPagina}&offset=${offset}`);
        
        if (!respuesta.ok) {
            throw new Error('No se pudo conectar con el servidor');
        }
        
        const datos = await respuesta.json();
        const cursos = datos.respuesta;
        
        // Limpiamos el tbody por si tenía datos viejos
        tbody.innerHTML = '';
        divError.style.display = 'none';

        if (cursos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay cursos registrados actualmente.</td></tr>`;
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
                    <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${curso.idCurso}">👁️ Ver</button>
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
    
    btnAgregar.addEventListener('click', () => {
        document.getElementById('formCurso').reset();
        document.getElementById('modalIdCurso').value = '';
        document.getElementById('modalCursoLabel').textContent = 'Nuevo Curso';
        document.getElementById('btnEliminar').style.display = 'none';
        document.getElementById('btnGuardar').textContent= 'Crear Curso';
        document.getElementById('modalDescripcion').value="";
    });

    // Escuchamos el Submit del Formulario (Sirve tanto para CREAR como para ACTUALIZAR)
    formCurso.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos que la página se recargue
        await guardarCurso();
    });

    // Escuchamos el clic del botón Eliminar
    btnEliminar.addEventListener('click', async () => {
        await eliminarCurso();
    });
    
    
}

/**
 * 3. Asigna el evento de edición a los botones de la tabla
 */
function asignarEventosBotones() {
    const botonesEditar = document.querySelectorAll('.btn-editar');
    botonesEditar.forEach(boton => {
        boton.addEventListener('click', async () => {
            const id = boton.getAttribute('data-id');
            console.log("🔍 Detective Frontend - ID clickeado:", id);
            await abrirModalEdicion(id);
        });
    });
}

/**
 * 4. Busca un curso por ID y llena el modal para editarlo (Lógica del GET por ID)
 */
async function abrirModalEdicion(id) {
    try {
        const respuesta = await fetch(`${URL_API}/${id}`);
        if (!respuesta.ok) throw new Error('No se pudo obtener el detalle del curso');
        
        const curso = await respuesta.json();

        // Llenamos los inputs del modal con la data que vino de Postgres
        document.getElementById('modalIdCurso').value = curso.idCurso || id;
        document.getElementById('modalNombre').value = curso.nombre;
        document.getElementById('modalDescripcion').value = curso.descripcion;
        
        const estadoCurso = curso.idCursoEstado || curso.id_curso_estado;
        if (estadoCurso) {
            document.getElementById('modalEstadoCurso').value = estadoCurso;
        }
        // Formateamos la fecha al formato YYYY-MM-DD que requiere el input de tipo date
        if (curso.fechaInicio) {
            document.getElementById('modalFecha').value = curso.fechaInicio.split('T')[0];
        }
        
        document.getElementById('modalHoras').value = curso.cantidadHoras;
        document.getElementById('modalCupo').value = curso.inscriptosMax;

        // Modificamos el aspecto del modal para que sea de edición
        document.getElementById('modalCursoLabel').textContent = 'Modificar Curso';
        document.getElementById('btnEliminar').style.display = 'block';
        document.getElementById('btnGuardar').textContent= 'Modificar Curso';

        // Abrimos el modal programáticamente usando la instancia de Bootstrap instalada
        const modalElement = document.getElementById('modalCurso');
        const modalBootstrap = bootstrap.Modal.getOrCreateInstance(modalElement);
        modalBootstrap.show();

    } catch (error) {
        console.error(error);
        
        alert('Error al cargar los detalles del curso.');
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
    
    const datosCurso = {
    nombre: document.getElementById('modalNombre').value,
    descripcion: document.getElementById('modalDescripcion').value,
    fechaInicio: document.getElementById('modalFecha').value, // <-- camelCase
    cantidadHoras: parseInt(document.getElementById('modalHoras').value) || 0, // <-- camelCase
    inscriptosMax: parseInt(document.getElementById('modalCupo').value) || 0, // <-- camelCase
    idCursoEstado: parseInt(document.getElementById('modalEstadoCurso').value), // <-- camelCase
    idUsuarioModificacion: 1 
    };

    let url = URL_API;
    let metodo = 'POST';

    // Si el idCurso existe, significa que estamos EDITANDO, cambiamos url y método
    if (idCurso) {
        url = `${URL_API}/${idCurso}`;
        metodo = 'PUT';
    }

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosCurso)
        });

        if (!respuesta.ok) {
            throw new Error('Error al procesar la solicitud en el servidor');
        }

        // Si todo salió bien, cerramos el modal de Bootstrap
        const modalElement = document.getElementById('modalCurso');
        const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
        modalBootstrap.hide();

        // Refrescamos la tabla para ver los cambios instantáneamente
        await cargarCursos(paginaActual);
        const elToast = document.getElementById('miToast');
        const toastMensaje = document.getElementById("contenidoToast");
        toastMensaje.innerHTML="<p> Curso Guardado con exito.</p>"
        // Lo inicializamos con Bootstrap
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(elToast);
        
        // Lo mostramos
        toastBootstrap.show();
        

    } catch (error) {
        console.error('Error al guardar curso:', error);
        const errorGuardar = document.getElementById("error");
        const modalElement = document.getElementById('modalCurso');
        const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
        if(errorGuardar){
            errorGuardar.innerHTML="<p> Ocurrió un error al intentar guardar el curso.</p>"
            errorGuardar.style.display="block";
            modalBootstrap.hide();
            window.scrollTo(0,0);
            setTimeout(() =>{
                errorGuardar.style.display = "none";
            }, 3000)
        }
    } finally{
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
    }
}

/**
 * Eliminar
 */
async function eliminarCurso() {
    const idCurso = document.getElementById('modalIdCurso').value;
    const nombreCurso = document.getElementById('modalNombre').value;

    if (!idCurso) return;

    // Aca tiene que aparecer algo que le pregunte al usuario si esta seguro
    const confirmar = confirm(`¿Estás completamente seguro de que querés eliminar el curso "${nombreCurso}"?`);
    
    if (!confirmar) return;

    try {
        const respuesta = await fetch(`${URL_API}/${idCurso}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo eliminar el curso del servidor');
        }

        // Cerramos el modal
        const modalElement = document.getElementById('modalCurso');
        const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
        modalBootstrap.hide();

        // Refrescamos la tabla
        await cargarCursos(paginaActual);
        //aca tiene que llamar a algo que avise al usuario
        alert('Curso eliminado correctamente.');

    } catch (error) {
        console.error('Error al eliminar curso:', error);
        //aca tiene que llamar a algo que avise al usuario
        const errorGuardar = document.getElementById("error");
        const modalElement = document.getElementById('modalCurso');
        const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
        if(errorGuardar){
            errorGuardar.innerHTML="<p> Ocurrió un error al intentar eliminar el curso.</p>"
            errorGuardar.style.display="block";
            modalBootstrap.hide();
            window.scrollTo(0,0);
            setTimeout(() =>{
                errorGuardar.style.display = "none";
            }, 3000)
        }
    }
    
}
async function cargarEstados() {
    const selectEstado = document.getElementById('modalEstadoCurso');
    
    try {
        // Hacemos el fetch que consulta la tabla cursos_estados
        const respuesta = await fetch('http://localhost:3000/api/estados'); 

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