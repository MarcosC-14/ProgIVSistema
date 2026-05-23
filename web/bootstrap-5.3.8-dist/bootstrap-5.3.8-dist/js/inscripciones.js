document.addEventListener("DOMContentLoaded", async function(){
    let paginaActual = 1;
    const limitePorPagina = 10;

    const cargarTablaInscripciones = async (paginaReq) => {
        try {
            paginaActual = paginaReq;

            const offset = (paginaActual - 1) * limitePorPagina;

            const respuesta = await fetch(`http://localhost:3000/api/inscripciones?limit=${limitePorPagina}&offset=${offset}`);
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            
            
            const datos = await respuesta.json();
            console.log(datos);
            const tabla = document.getElementById("tbody");

            tabla.innerHTML = "";
        
            if (datos.data && datos.data.length > 0){
                datos.data.forEach(inscripcion => {
                    const fila = document.createElement("tr");
                    fila.classList.add("clickeable");
                    const fechaTabla = new Date(inscripcion.fechaInscripcion).toLocaleString("es-AR",{ hour12: false });

                    fila.innerHTML = `
                    <td class="text-center">${inscripcion.idInscripcion}</td>
                    <td class="text-center">${inscripcion.idCurso}</td>
                    <td class="text-center">${inscripcion.cursoNombre}</td>
                    <td class="text-center">${inscripcion.idEstudiante}</td>
                    <td class="text-center">${inscripcion.estudianteApellido}, ${inscripcion.estudianteNombres}</td>
                    <td class="text-center">${inscripcion.documento}</td>
                    <td class="text-center">${fechaTabla}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-info btn-detalle" data-id="${inscripcion.id_estudiante}">Ver
                    </button></td>
                    `;
                    console.log(typeof inscripcion.fechaInscripcion);
                    tabla.appendChild(fila);
                });
            } else{
                tabla.innerHTML = `<tr><td colspan="8" class="text-center">No hay inscripciones registradas.</td></tr>`;
            }

            const totalInscripciones = datos.totalInscripciones || 0;
            mostrarControlesPaginacion(totalInscripciones);


        } catch (error) {
            const errorDiv = document.getElementById("error");
            if (errorDiv) {
                errorDiv.innerHTML = "<p>Error de conexión al cargar el listado.</p>";
                errorDiv.style.display = "block";
            }
            console.error("Error en la obtención de datos:", error);
        }   
    };

    const mostrarControlesPaginacion = (totalInscripciones) => {
        const contenedor = document.getElementById("paginacion-contenedor");
        contenedor.innerHTML = "";

        const totalPaginas = Math.ceil(totalInscripciones/limitePorPagina);

        if (totalPaginas <= 1) return;

        const liAnterior = document.createElement("li");
        liAnterior.className = `page-item ${paginaActual === 1 ? 'disabled':''}`;
        liAnterior.innerHTML = `<button class="page-link">Anterior</button>`;
        if (paginaActual > 1){
            liAnterior.addEventListener("click", () => cargarTablaInscripciones(paginaActual -1));
        }
        contenedor.appendChild(liAnterior);

        for (let i = 1; i <= totalPaginas; i++){
            const liNumero = document.createElement("li");
            liNumero.className = `page-item ${paginaActual === i ? 'active':''}`;
            liNumero.innerHTML = `<button class="page-link">${i}</button>`;

            if (paginaActual !== i){
                liNumero.addEventListener("click",() => cargarTablaInscripciones(i));
            }
            contenedor.appendChild(liNumero);
        }

        const liSiguiente = document.createElement("li");
        liSiguiente.className = `page-item ${paginaActual === totalPaginas ? 'disabled':''}`;
        liSiguiente.innerHTML = `<button class="page-link">Siguiente</button>`;

        if (paginaActual <totalPaginas){
            liSiguiente.addEventListener("click", () => cargarTablaInscripciones(paginaActual + 1));
        }
        contenedor.appendChild(liSiguiente);
    }

    await cargarTablaInscripciones(1);





    // ==========================================
    // 2. LÓGICA DEL MODAL Y ALTA DE REGISTROS
    // ==========================================
    
    // Selectores del DOM
    const btnNuevaInscripcion = document.querySelector('main > div > button.btn-primary');
    const modal = document.getElementById('modal-nueva-inscripcion');
    const btnCerrar = document.getElementById('btn-cerrar-inscripcion');
    const btnCancelar = document.getElementById('btn-cancelar-inscripcion');
    const form = document.getElementById('form-inscripcion');
    
    const inputBuscar = document.getElementById('buscar-estudiante');
    const listaResultados = document.getElementById('resultados-estudiantes');
    const inputHiddenId = document.getElementById('id_estudiante');
    const selectCurso = document.getElementById('id_curso');

    // Función de cierre y limpieza del estado
    const cerrarModal = () => {
        modal.close();
        form.reset();
        listaResultados.style.display = 'none';
        inputHiddenId.value = '';
    };

    if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
    if (btnCancelar) btnCancelar.addEventListener('click', cerrarModal);

    // Obtención dinámica del listado de cursos para el Select
    const cargarCursosSelect = async () => {
        try {
            const respuesta = await fetch('http://localhost:3000/api/cursos?limit=50');
            if (!respuesta.ok) return;
            const datos = await respuesta.json();
            
            selectCurso.innerHTML = '<option value="">-- Seleccione un curso --</option>';
            
            // Asumiendo que el DTO de cursos devuelve los datos en la propiedad 'data'
            const cursos = datos.data || datos; 
            cursos.forEach(curso => {
                selectCurso.innerHTML += `<option value="${curso.id_curso || curso.idCurso}">${curso.nombre}</option>`;
            });
        } catch (error) {
            console.error("Error cargando cursos:", error);
        }
    };

    // Evento de apertura
    if (btnNuevaInscripcion) {
        btnNuevaInscripcion.addEventListener('click', async () => {
            await cargarCursosSelect();
            modal.showModal();
        });
    }

    // Búsqueda Asíncrona (Typeahead) de Estudiantes
    let debounceTimer;
    inputBuscar.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(debounceTimer); // Reinicia el temporizador de Debounce

        // Abortar peticiones si la cadena es muy corta
        if (query.length < 2) {
            listaResultados.style.display = 'none';
            inputHiddenId.value = ''; 
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                // Petición parametrizada al endpoint del profesor
                const response = await fetch(`http://localhost:3000/api/estudiantes?limit=5&apellido=${query}`);
                if (!response.ok) throw new Error("Error en la red");
                
                const data = await response.json();
                const estudiantes = data.data || data;

                listaResultados.innerHTML = '';

                if (estudiantes.length === 0) {
                    listaResultados.innerHTML = '<li class="list-group-item text-muted">Sin resultados</li>';
                } else {
                    estudiantes.forEach(est => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item list-group-item-action';
                        li.textContent = `${est.documento || ''} - ${est.apellido}, ${est.nombres}`;
                        
                        // Asignación de variables al hacer clic en un resultado
                        li.addEventListener('click', () => {
                            inputHiddenId.value = est.id_estudiante || est.idEstudiante;
                            inputBuscar.value = `${est.apellido}, ${est.nombres}`;
                            listaResultados.style.display = 'none';
                        });
                        
                        listaResultados.appendChild(li);
                    });
                }
                listaResultados.style.display = 'block';
            } catch (error) {
                console.error("Error en Typeahead:", error);
            }
        }, 300); // Demora de 300ms para mitigar la sobrecarga de red
    });

    // Ocultar el Typeahead si se hace clic en otro nodo del DOM
    document.addEventListener('click', (e) => {
        if (e.target !== inputBuscar && e.target !== listaResultados) {
            listaResultados.style.display = 'none';
        }
    });

    // Intercepción y envío del formulario (POST)
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Suprime la acción nativa del navegador

        if (!inputHiddenId.value) {
            alert("Debe seleccionar un estudiante válido del listado desplegable.");
            return;
        }

        const payload = {
            idCurso: parseInt(selectCurso.value, 10),
            idEstudiante: parseInt(inputHiddenId.value, 10),
            idUsuarioModificacion: 1 // Variable estática requerida por el esquema SQL
        };

        try {
            const response = await fetch('http://localhost:3000/api/inscripciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json(); 

            // Evaluación del código de estado HTTP para manejar excepciones de negocio
            if (!response.ok) {
                alert(`Fallo en la operación: ${result.message || 'Error de validación.'}`);
                return;
            }

            alert('Inscripción registrada correctamente en la base de datos.');
            cerrarModal();
            
            // Renderizado síncrono para reflejar la alteración de datos
            await cargarTablaInscripciones(1); 

        } catch (error) {
            console.error("Fallo durante la transacción POST:", error);
            alert("Excepción de red. Compruebe el estado del servidor.");
        }
    });



});
