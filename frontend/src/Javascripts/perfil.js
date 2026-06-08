"use strict";
/**
 * ============================================================
 * MÓDULO: Perfil de comunero
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
    const sesion = JSON.parse(localStorage.getItem("sysgem_user"));

    if (!sesion) {
        window.location.href = "./Login.html";
        return;
    }

    await cargarDatosPerfil(sesion.id);
    inyectarFormularioEdicion(sesion);
    inicializarHistorialCargos(sesion);

    const btnNotif = document.getElementById('notification-btn');
    if (btnNotif) {
        btnNotif.onclick = async () => {
            try {
                const res = await window.SYSGEM_DB.apiFetch('/anuncios');
                const result = await res.json();

                if (result.success && result.data.length > 0) {
                    let contenedor = document.getElementById("alert-anuncios");

                    if (!contenedor) {
                        contenedor = document.createElement("div");
                        contenedor.id = "alert-anuncios";
                        contenedor.className = "alert-anuncios";
                        document.body.appendChild(contenedor);
                    }

                    let html = `
                        <div class="alert-anuncios__header">
                            <h3 class="alert-anuncios__title">Notificaciones</h3>
                            <span class="alert-anuncios__subtitle">Anuncios vigentes</span>
                        </div>
                        <div class="alert-anuncios__list">
                    `;

                    result.data.forEach((anuncio, index) => {
                        html += `
                            <div class="alert-anuncios__item">
                                <strong>${index + 1}. ${anuncio.nombre.toUpperCase()}</strong>
                                <p>${anuncio.descripcion}</p>
                            </div>
                        `;
                    });

                    html += `
                        <button class="alert-anuncios__btn"
                            onclick="document.getElementById('alert-anuncios').remove()">
                            Aceptar
                        </button>
                    `;

                    contenedor.innerHTML = html;
                    setTimeout(() => contenedor.classList.add("show"), 10);
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
            document.getElementById("perf-status").textContent = cargoTexto;

            document.getElementById("stats-cumplidos").textContent = d.cumplidos;
            document.getElementById("stats-faltantes").textContent = d.en_curso;

            if (d.fecha_nacimiento) {
                const fecha = new Date(d.fecha_nacimiento).toLocaleDateString('es-MX');
                document.getElementById("info-fecha").textContent = fecha;
            }

            const contenedorIcono = document.querySelector(".profile__icon");
            if (contenedorIcono && d.foto_perfil) {
                const imgNode = document.createElement("img");

                imgNode.src = `data:image/jpeg;base64,${d.foto_perfil}`;
                imgNode.alt = "Foto de perfil";
                imgNode.style.width = "100%";
                imgNode.style.height = "100%";
                imgNode.style.borderRadius = "50%";
                imgNode.style.objectFit = "cover";

                imgNode.onerror = function() {
                    this.onerror = null;
                    this.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";
                };

                contenedorIcono.innerHTML = "";
                contenedorIcono.appendChild(imgNode);
            }
        }
    } catch (err) {
        console.error("Error al cargar perfil:", err);
    }
}


function inyectarFormularioEdicion(sesion) {
    const formSeccion = document.getElementById("form-edicion-perfil");
    if (!formSeccion) return;

    const tarjetas = document.querySelectorAll(".shortcut");
    let btnVerEditar = null;

    tarjetas.forEach(tarjeta => {
        if (tarjeta.textContent.includes("Ver y editar") || tarjeta.textContent.includes("Perfil")) {
            btnVerEditar = tarjeta;
        }
    });

    if (btnVerEditar) {
        btnVerEditar.style.cursor = "pointer";
        btnVerEditar.onclick = () => {
            document.getElementById("edit-correo").value = document.getElementById("info-correo").textContent;
            formSeccion.style.display = "block";
            formSeccion.scrollIntoView({ behavior: 'smooth' });
        };
    }

    document.getElementById("btn-cancelar-perfil").onclick = () => {
        document.getElementById("edit-correo").value = "";
        document.getElementById("edit-foto").value = "";
        formSeccion.style.display = "none";
    };

    document.getElementById("btn-guardar-perfil").onclick = async () => {
        const nuevoCorreo = document.getElementById("edit-correo").value.trim();
        const inputFoto = document.getElementById("edit-foto");

        if (!nuevoCorreo) {
            alert("El campo de Correo electrónico no puede estar vacío.");
            return;
        }

        const formData = new FormData();
        formData.append("correo", nuevoCorreo);

        if (inputFoto.files.length > 0) {
            formData.append("foto_perfil", inputFoto.files[0]);
        }

        try {
            const res = await fetch(`http://localhost:3000/api/perfil/${sesion.id}`, {
                method: 'PUT',
                body: formData
            });

            const result = await res.json();

            if (result.success) {
                alert("Información actualizada correctamente.");
                formSeccion.style.display = "none";
                document.getElementById("edit-foto").value = "";
                await cargarDatosPerfil(sesion.id);
            } else {
                alert("No se pudieron guardar los cambios: " + result.message);
            }
        } catch (err) {
            console.error("Error al actualizar el perfil:", err);
            alert("Error de conexión con el servidor.");
        }
    };
}


function inicializarHistorialCargos(sesion) {
    const tarjetas = document.querySelectorAll(".shortcut");
    let btnHistorial = null;

    // Buscamos la tarjeta convirtiendo el texto a minúsculas para evitar problemas de sensibilidad
    tarjetas.forEach(tarjeta => {
        const textoTarjeta = tarjeta.textContent.toLowerCase();
        if (textoTarjeta.includes("historial") || textoTarjeta.includes("cargos")) {
            btnHistorial = tarjeta;
        }
    });

    if (btnHistorial) {
        btnHistorial.style.cursor = "pointer";
        btnHistorial.onclick = async () => {
            try {
                // Realizamos la consulta con la herramienta global del proyecto
                const res = await window.SYSGEM_DB.apiFetch(`/perfil/${sesion.id}/historial`);
                const result = await res.json();

                if (result.success) {
                    // Evitamos duplicar modales limpiando si existiera uno viejo
                    let modalContainer = document.getElementById("pop-historial-cargos");
                    if (modalContainer) modalContainer.remove();

                    // Creamos el contenedor del modal
                    modalContainer = document.createElement("div");
                    modalContainer.id = "pop-historial-cargos";
                    modalContainer.className = "modal-historial";

                    let htmlContenido = `
                        <div class="modal-historial__card">
                            <div class="modal-historial__header">
                                <h3 class="modal-historial__title">Historial de Cargos</h3>
                                <span class="modal-historial__subtitle">Cargos desempeñados en la comunidad</span>
                            </div>
                            <div class="modal-historial__list">
                    `;

                    // 📭 CONDICIÓN: Si el array viene vacío (longitud 0), pintamos el historial vacío
                    if (!result.data || result.data.length === 0) {
                        htmlContenido += `
                            <div class="modal-historial__empty">
                                <i class="fas fa-folder-open" style="font-size: 2.5rem; color: #adb5bd; margin-bottom: 10px; display: block;"></i>
                                No has completado ningún cargo comunitario todavía.
                            </div>
                        `;
                    } else {
                        // 📜 Si contiene datos, recorremos las columnas reales 'cargo' y 'year'
                        result.data.forEach(cargo => {
                            const anioTexto = cargo.year ? `Año: ${cargo.year}` : "Año: No registrado";

                            htmlContenido += `
                                <div class="modal-historial__item">
                                    <div class="modal-historial__item-title">${cargo.cargo}</div>
                                    <div class="modal-historial__item-date">
                                        <i class="far fa-calendar-check" style="color: #2b8a3e;"></i> ${anioTexto}
                                    </div>
                                </div>
                            `;
                        });
                    }

                    htmlContenido += `
                            </div>
                            <button class="modal-historial__btn" id="btn-cerrar-modal-historial">
                                Aceptar
                            </button>
                        </div>
                    `;

                    modalContainer.innerHTML = htmlContenido;
                    document.body.appendChild(modalContainer);

                    // Acción para cerrar y destruir el pop-up de la pantalla
                    document.getElementById("btn-cerrar-modal-historial").onclick = () => {
                        modalContainer.classList.remove("show");
                        setTimeout(() => modalContainer.remove(), 250);
                    };

                    // Disparamos la animación CSS de entrada
                    setTimeout(() => modalContainer.classList.add("show"), 10);

                } else {
                    alert("Error al cargar el historial: " + result.message);
                }
            } catch (err) {
                console.error("Error en la conexión del historial:", err);
                alert("No se pudo conectar con el servidor para obtener el historial.");
            }
        };
    }
}