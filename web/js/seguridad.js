const token = localStorage.getItem('token_jwt');

if (!token && !window.location.pathname.includes('login.html')) {
    window.location.href = 'login.html';
}