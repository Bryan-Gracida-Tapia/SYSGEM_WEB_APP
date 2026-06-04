"use strict";
/**
 * ============================================================
 * 📌 MÓDULO: Perfil de comunero
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

    // Módulo de Notificaciones
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

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Cargar datos
 */
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

            document.getElementById("stats-cumplidos").textContent = d.cumplidos || 0;
            document.getElementById("stats-faltantes").textContent = d.en_curso || 0;

            if (d.fecha_nacimiento) {
                const fecha = new Date(d.fecha_nacimiento).toLocaleDateString('es-MX');
                document.getElementById("info-fecha").textContent = fecha;
            }

            // 📌 RENDERIZAR FOTO DESDE BASE64 (BASE DE DATOS)
            const contenedorIcono = document.querySelector(".profile__icon");
            if (contenedorIcono && d.foto_perfil) {
                const imgNode = document.createElement("img");

                // El backend mandará la foto codificada en string base64
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

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Inyección Dinámica del Formulario
 */
function inyectarFormularioEdicion(sesion) {
    const mainSection = document.querySelector(".dashboard__section--profile");
    if (!mainSection) return;

    const tarjetas = document.querySelectorAll(".shortcut");
    let btnVerEditar = null;

    tarjetas.forEach(tarjeta => {
        if (tarjeta.textContent.includes("Ver y editar") || tarjeta.textContent.includes("Perfil")) {
            btnVerEditar = tarjeta;
        }
    });

    if (btnVerEditar) {
        btnVerEditar.style.cursor = "pointer";
    }

    const formSeccion = document.createElement("section");
    formSeccion.className = "information";
    formSeccion.id = "form-edicion-perfil";
    formSeccion.style.display = "none";
    formSeccion.style.marginTop = "20px";

    formSeccion.innerHTML = `
        <div class="information__box">
            <h3 class="card__title">Modificar Información Personal</h3>
            <p class="card__description">Actualiza tu correo o foto de perfil</p>
        </div>
        <div style="padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-top: 15px;">
            <div style="margin-bottom: 15px;">
                <label style="font-weight: bold; color: #333;">Correo Electrónico *</label><br>
                <input type="email" id="edit-correo" style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;" />
            </div>
            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; color: #333;">Nueva Foto de Perfil</label><br>
                <input type="file" id="edit-foto" accept="image/*" style="margin-top: 5px;" />
            </div>
            <button id="btn-guardar-perfil" style="background: #0056b3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Guardar Cambios</button>
            <button id="btn-cancelar-perfil" style="background: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px; font-weight: bold;">Cancelar</button>
        </div>
    `;

    mainSection.appendChild(formSeccion);

    if (btnVerEditar) {
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

        // 📌 CREACIÓN DE FORMDATA PARA TRANSMISIÓN BINARIA
        const formData = new FormData();
        formData.append("correo", nuevoCorreo);

        if (inputFoto.files.length > 0) {
            formData.append("foto_perfil", inputFoto.files[0]);
        }

        try {
            // Saltamos apiFetch temporalmente ya que FormData requiere que el navegador defina los Boundaries manualmente
            const res = await fetch(`http://localhost:3000/api/perfil/${sesion.id}`, {
                method: 'PUT',
                body: formData
            });

            const result = await res.json();

            if (result.success) {
                alert("Información actualizada correctamente.");
                formSeccion.style.display = "none";
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