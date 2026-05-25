
document.addEventListener('DOMContentLoaded', () => {
    // Logout
    const detectarBotonLogout = setInterval(() => {
        const btnLogout = document.getElementById('btn-logout');

        if (btnLogout) {
            clearInterval(detectarBotonLogout);

            btnLogout.addEventListener('click', () => {
                console.log("Cerrando sesión...");
                localStorage.clear();
                window.location.href = '../views/Login.html';
            });
        }
    }, 500);
});

fetch('../components/footer.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
    })
    .catch(err => console.error("Error al cargar el footer:", err));