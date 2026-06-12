const btnCerrar = document.getElementById('btn-cerrar-sesion');
if (btnCerrar) {
    btnCerrar.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('sesion_activa');
        localStorage.removeItem('usuario_nombre');
        alert("Sesión cerrada.");
        window.location.href = "login.html";
    });
}