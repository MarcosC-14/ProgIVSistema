const API_URL_REGISTRO = 'http://localhost:3000/api/usuarios'; 

const registroForm = document.getElementById('form-registro');

registroForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const apellido = document.getElementById('reg-apellido').value.trim();
    const usuario = document.getElementById('reg-usuario').value.trim();
    const contrasenia = document.getElementById('reg-contrasenia').value;

    try {
        const respuesta = await fetch(API_URL_REGISTRO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
           body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                nombre_usuario: usuario,
                contrasenia: contrasenia
            })
        });

        const textoRespuesta = await respuesta.text(); 
        
        if (respuesta.ok) {
            alert("¡Registrado con éxito!");
            window.location.href = "login.html"; 
        } else {
            alert("Error al registrar el usuario." + (datos.mensaje || datos.error));
        }

    } catch (error) {
        console.error("Error en el registro:", error);
        alert("Error de conexión. No se pudo registrar el usuario.");
    }
});