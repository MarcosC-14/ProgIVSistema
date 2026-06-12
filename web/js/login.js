const API_URL_LOGIN = 'http://localhost:3000/api/login';

const loginForm = document.getElementById('form-login');

loginForm.addEventListener('submit', async function(event) {
     
    event.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const contrasenia = document.getElementById('contraseña').value;

    try {
        const respuesta = await fetch(API_URL_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                nombre_usuario:usuario, 
                contraseia:contrasenia 
            })
        });
            const datos = await respuesta.json();

            if (respuesta.ok) {
                localStorage.setItem('sesion_activa', 'true');
                localStorage.setItem('token', datos.token);
                localStorage.setItem('usuario_nombre', usuario);
                alert("Sesión iniciada correctamente");
                window.location.href = "index.html"; 
            } else {
                alert(datos.mensaje || "Usuario o contraseña incorrectos");
            }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
    }

});
