"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    const sesion = JSON.parse(localStorage.getItem("sysgem_user"));

    if (!sesion) {
        window.location.href = "./Login.html";
        return;
    }


    await cargarDatosPerfil(sesion.id);

    const btnLogout = document.getElementById('logout-btn');
    if (btnLogout) {
        btnLogout.onclick = () => {
            if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                localStorage.removeItem("sysgem_user");
                // Ajustado a la misma carpeta views
                window.location.href = "./Login.html";
            }
        };
    }


    const btnNotif = document.getElementById('notification-btn');

    if (btnNotif) {
        btnNotif.onclick = async () => {
            try {
                const res = await window.SYSGEM_DB.apiFetch('/anuncios');
                const result = await res.json();

                if (result.success && result.data.length > 0) {
                    // Creamos una cadena de texto para acumular los anuncios
                    let listaAnuncios = "🔔 TABLÓN DE ANUNCIOS 🔔\n\n";

                    result.data.forEach((anuncio, index) => {
                        listaAnuncios += `${index + 1}.- ${anuncio.nombre.toUpperCase()}\n`;
                        listaAnuncios += `📌 ${anuncio.descripcion}\n`;
                        listaAnuncios += `----------------------------------\n`;
                    });

                    alert(listaAnuncios);
                } else {
                    alert("No hay anuncios por el momento.");
                }
            } catch (err) {
                console.error("Error al obtener anuncios:", err);
                alert("No se pudo conectar con el servidor de anuncios.");
            }
        };
    }
});

async function cargarDatosPerfil(userId) {
    try {
        const res = await window.SYSGEM_DB.apiFetch(`/perfil/${userId}`);
        const result = await res.json();

        if (result.success) {
            const d = result.data;

            document.getElementById("perf-usuario").textContent = d.nombre_completo;
            document.getElementById("info-nombre").textContent = d.nombre_completo;
            document.getElementById("info-correo").textContent = d.correo;

            const cargoTexto = d.cargo_actual || "Sin cargo activo";
            document.getElementById("info-cargo").textContent = cargoTexto;
            document.getElementById("view-curso").textContent = cargoTexto;

            const cumplidos = parseInt(d.cumplidos) || 0;
            const enCurso = parseInt(d.en_curso) || 0;

            document.getElementById("stats-cumplidos").textContent = cumplidos;
            document.getElementById("stats-actuales").textContent = enCurso;
            document.getElementById("stats-total").textContent = cumplidos + enCurso;

            if (d.fecha_nacimiento) {
                const fecha = new Date(d.fecha_nacimiento).toLocaleDateString('es-MX');
                document.getElementById("info-fecha").textContent = fecha;
            }
        }
    } catch (err) {
        console.error("Error al cargar perfil:", err);
    }
}