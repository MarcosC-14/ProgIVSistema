document.addEventListener("DOMContentLoaded",  async function(){
    try{
    const respuesta = await fetch("js/cursos.json");
    const datos = await respuesta.json();
    
    const tabla=document.getElementById("tbody");
    const miModal = new bootstrap.Modal(document.getElementById('modalCurso'));
    datos.forEach(curso=>{
        const fila = document.createElement("tr");
        fila.style.cursor="pointer";
        fila.innerHTML =`
            <td class="text-center">${curso.idCurso}</td>
            <td>${curso.nombre}</td>
            <td>${curso.descripcion}</td>
            <td class="text-center">${new Date(curso.fechaInicio).toLocaleDateString()}</td>
            <td class="text-center">${curso.cantidadHoras}</td>
            <td class="text-center">${curso.inscriptosMax}</td>
        `;

        fila.addEventListener("click", () => {
            document.getElementById("modalNombre").value= curso.nombre;
            document.getElementById("modalDescripcion").value= curso.descripcion;
            document.getElementById("modalFecha").value= curso.fechaInicio.split("T")[0];
            document.getElementById("modalHoras").value= curso.cantidadHoras;
            document.getElementById("modalCupo").value= curso.inscriptosMax;

            
            miModal.show();
        });
        tabla.appendChild(fila);
        
    });
    document.getElementById("error").style.display = "none";
    }catch (error){
        document.getElementById("error").innerHTML="<p>Error al cargar los datos.<p>";
        document.getElementById("error").style.display="block";
    }
});
