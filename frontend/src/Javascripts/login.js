"use strict";
/**
 * ============================================================
 * 📌 MÓDULO: Login
 * ============================================================
 */

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// INICIALIZACIÓN
 * Se ejecuta al cargar el DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("input-user").value;
            const password = document.getElementById("password-login").value;

            try {

                const res = await window.SYSGEM_DB.apiFetch("/login", {
                    method: "POST",
                    body: { username, password }
                });

                const data = await res.json();

                if (data.success) {
                    localStorage.setItem("sysgem_user", JSON.stringify(data.user));


                    if (data.user.role === "admin") {
                        window.location.href = "gestion_cargos.html";
                    } else if (data.user.role === "secretaria") {
                        window.location.href = "Gestión_de_anuncios.html";
                    } else {
                        window.location.href = "User_Perfil.html";
                    }
                }
            } catch (err) {

                let mensaje = "Error de conexión";

                try {
                    const jsonParte = err.message.substring(err.message.indexOf('{'));
                    const errorData = JSON.parse(jsonParte);
                    mensaje= errorData.message;
                } catch (parseError) {

                    mensaje = err.message;
                }

                alert("Atención: " + mensaje);
            }
        });
    }
});