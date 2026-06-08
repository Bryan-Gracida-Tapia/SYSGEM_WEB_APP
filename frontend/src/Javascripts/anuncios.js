"use strict";
/**
 * ============================================================
 * MÓDULO: Gestión de anuncios (100% Separado de HTML y CSS)
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    const formAdd = document.getElementById('form-add');
    const btnCancelar = document.getElementById('btn-cancel-add');
    const btnCrearAnuncio = document.querySelector('.actions__button--create');
    const contenedorEditor = formAdd ? formAdd.closest('.card') : null;
    const tituloEditor = contenedorEditor ? contenedorEditor.querySelector('.card__title') : null;
    const inputFecha = document.getElementById('publication-date');
    const contenedorFecha = inputFecha ? inputFecha.closest('.form__group') : null;
    const plantilla = document.getElementById('plantilla-anuncio');
    const btnSoporte = document.querySelector('.summary-card__btn');
    let editandoId = null;

    if (contenedorEditor) contenedorEditor.classList.add('card-editor-hidden');
    if (contenedorFecha) contenedorFecha.classList.add('card-editor-hidden');

    if (btnSoporte) {
        btnSoporte.addEventListener('click', () => {
            const correoSoporte = "li01232317@unsij.edu.mx";
            const asunto = encodeURIComponent("Soporte Técnico - Sistema de Gestión Municipal");
            const cuerpo = encodeURIComponent(
                "Hola, Equipo de Soporte Técnico:\n\n" +
                "Tengo un problema/duda en el módulo de anuncios del sistema.\n" +
                "[Describe detalladamente tu problema aquí]\n\n" +
                "Saludos cordiales."
            );

            const urlGmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${correoSoporte}&su=${asunto}&body=${cuerpo}`;

            window.open(urlGmailWeb, '_blank');
        });
    }

    const obtenerFechaActualLocal = () => {
        const d = new Date();
        const offset = d.getTimezoneOffset();
        const fechaLocal = new Date(d.getTime() - (offset * 60 * 1000));
        return fechaLocal.toISOString().split('T')[0];
    };

    const limpiarYQuitarFormulario = () => {
        editandoId = null;
        formAdd.reset();
        const btnEnviar = formAdd.querySelector('.form__button--primary');
        if (btnEnviar) {
            btnEnviar.innerHTML = 'Publicar anuncio';
            btnEnviar.style.backgroundColor = "";
        }
        if (tituloEditor) tituloEditor.textContent = 'Panel de Edición';
        if (contenedorEditor) contenedorEditor.classList.add('card-editor-hidden');
    };

    if (btnCrearAnuncio) {
        btnCrearAnuncio.addEventListener('click', () => {
            limpiarYQuitarFormulario();
            if (contenedorEditor) {
                if (tituloEditor) tituloEditor.textContent = 'Crear Nuevo Anuncio';
                if (inputFecha) inputFecha.value = obtenerFechaActualLocal();
                contenedorEditor.classList.remove('card-editor-hidden');
                contenedorEditor.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', limpiarYQuitarFormulario);
    }

    const cargarAnuncios = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/anuncios');
            const result = await res.json();
            const contenedor = document.getElementById('lista-anuncios-db');

            if (!contenedor) return;
            contenedor.innerHTML = "";

            if (result.success && result.data.length > 0) {
                result.data.forEach(anuncio => {
                    const fechaLimpia = anuncio.fecha ? anuncio.fecha.split('T')[0] : '';
                    const clon = plantilla.content.cloneNode(true);

                    clon.querySelector('.anuncio-item__title').textContent = anuncio.nombre;
                    clon.querySelector('.anuncio-item__description').textContent = anuncio.descripcion;
                    clon.querySelector('.anuncio-item__date-text').textContent = fechaLimpia;

                    clon.querySelector('.anuncio-item__btn-edit').addEventListener('click', () => {
                        prepararEdicion({
                            id_anuncio: anuncio.id_anuncio,
                            nombre: anuncio.nombre,
                            descripcion: anuncio.descripcion,
                            fecha: fechaLimpia
                        });
                    });

                    clon.querySelector('.anuncio-item__btn-delete').addEventListener('click', () => {
                        eliminarAnuncio(anuncio.id_anuncio);
                    });

                    contenedor.appendChild(clon);
                });
            } else {
                const pMensaje = document.createElement('p');
                pMensaje.className = 'anuncio-item__status-text';
                pMensaje.textContent = 'No hay anuncios publicados actualmente.';
                contenedor.appendChild(pMensaje);
            }
        } catch (error) {
            console.error("Error al renderizar la lista de anuncios:", error);
        }
    };

    const prepararEdicion = (anuncio) => {
        editandoId = anuncio.id_anuncio;
        if (contenedorEditor) contenedorEditor.classList.remove('card-editor-hidden');
        if (tituloEditor) tituloEditor.textContent = 'Modificar Anuncio';

        document.getElementById('title').value = anuncio.nombre;
        document.getElementById('description').value = anuncio.descripcion;
        if (inputFecha) inputFecha.value = anuncio.fecha;

        const btnEnviar = formAdd.querySelector('.form__button--primary');
        if (btnEnviar) {
            btnEnviar.innerHTML = '<i class="fa-solid fa-save"></i> Guardar Cambios';
            btnEnviar.style.backgroundColor = "#059669";
        }

        if (contenedorEditor) contenedorEditor.scrollIntoView({ behavior: 'smooth' });
    };

    formAdd.onsubmit = async (e) => {
        e.preventDefault();
        if (!inputFecha.value) inputFecha.value = obtenerFechaActualLocal();

        const datos = {
            nombre: document.getElementById('title').value,
            descripcion: document.getElementById('description').value,
            fecha: inputFecha.value
        };

        const url = editandoId ? `http://localhost:3000/api/anuncios/${editandoId}` : 'http://localhost:3000/api/anuncios';
        const method = editandoId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const result = await res.json();

            if (result.success) {
                alert(editandoId ? "Anuncio actualizado correctamente." : "Anuncio creado exitosamente.");
                limpiarYQuitarFormulario();
                cargarAnuncios();
            } else {
                alert("Hubo un contratiempo: " + result.message);
            }
        } catch (error) {
            console.error("Error al procesar el formulario de anuncios:", error);
            alert("No se pudo establecer conexión con el servidor.");
        }
    };

    const eliminarAnuncio = async (id) => {
        if (!confirm("¿Estás completamente seguro de eliminar este anuncio?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/anuncios/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (result.success) {
                if (editandoId === id) limpiarYQuitarFormulario();
                cargarAnuncios();
            }
        } catch (error) {
            console.error("Error al intentar eliminar el anuncio:", error);
        }
    };

    cargarAnuncios();
});