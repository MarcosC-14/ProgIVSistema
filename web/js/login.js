const loginForm = document.getElementById('form-login');

loginForm.addEventListener('submit', function(event) {
     
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const contrasenia = document.getElementById('contraseña').value;

    if (usuario === "admin" && contrasenia === "1234") {
        alert("Bienvenido");
        
        window.location.href = "index.html"; 
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});