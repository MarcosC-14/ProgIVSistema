const API_URL_LOGIN = 'http://localhost:3000/api/auth/login';

const loginForm = document.getElementById('form-login');

loginForm.addEventListener('submit', async function(event) {
     
    event.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const contrasenia = document.getElementById('contrasenia').value;

    const contenedorError = document.getElementById('contenedor-error');

    if (contenedorError) {
        contenedorError.classList.remove('mostrar');
        contenedorError.textContent = '';
    }
    
    try {
        const respuesta = await fetch(API_URL_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: usuario, 
                password: contrasenia
            })
        });
        const datos = await respuesta.json();

        if (respuesta.ok) {
            
            localStorage.setItem('token_jwt', datos.token);
            localStorage.setItem('usuario_nombre', datos.usuario.nombreCompleto);
            
            window.location.href = "index.html"; 
        } else {
         
            throw new Error(datos.error || "Usuario o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        
        
        if (contenedorError) {
            contenedorError.textContent = error.message;
            contenedorError.classList.add('mostrar');
        }
    }
});