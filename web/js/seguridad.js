(function() {
    const sesionActiva = localStorage.getItem('sesion_activa');

   
    if (!sesionActiva || sesionActiva !== 'true') {
        alert("Acceso denegado. Por favor, inicie sesión primero.");
        window.location.href = "login.html"; 
    }
})();