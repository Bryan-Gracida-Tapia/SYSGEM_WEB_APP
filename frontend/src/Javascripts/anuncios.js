/**
 * ============================================================
 * 📌 MÓDULO: Gestión de anuncios
 * ============================================================
 */

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// INICIALIZACIÓN
 * Se ejecuta al cargar el DOM.
 */
document.addEventListener('DOMContentLoaded', () => {
    const formAdd = document.getElementById('form-add');
    const btnCancelar = document.getElementById('btn-cancel-add');
    let editandoId = null;

    // Limpiar el formulario
    const limpiarFormulario = () => {
        editandoId = null;
        formAdd.reset();
        const btnEnviar = formAdd.querySelector('.form__button--primary');
        btnEnviar.innerHTML = 'Publicar anuncio';
        btnEnviar.style.backgroundColor = "";
    };

    if (btnCancelar) {
        btnCancelar.addEventListener('click', limpiarFormulario);
    }

    // Obtener los anuncios desde backend
    const cargarAnuncios = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/anuncios');
            const result = await res.json();
            const contenedor = document.getElementById('lista-anuncios-db');

            if (result.success && result.data.length > 0) {
                contenedor.innerHTML = result.data.map(a => `
                    <div class="anuncio-item" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0; color: #1e293b;">${a.nombre}</h4>
                            <p style="margin: 5px 0; color: #64748b; font-size: 0.9rem;">${a.descripcion}</p>
                            <small style="color: #94a3b8;">${a.fecha}</small>
                        </div>
                        <div style="display: flex; gap: 15px; margin-left: 20px;">
                            <button onclick='prepararEdicion(${JSON.stringify(a)})' style="color: #2563eb; background:none; border:none; cursor:pointer; font-size: 1.2rem;">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button onclick="eliminarAnuncio(${a.id_anuncio})" style="color: #ef4444; background:none; border:none; cursor:pointer; font-size: 1.2rem;">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            } else {
                contenedor.innerHTML = "<p>No hay anuncios publicados.</p>";
            }
        } catch (error) { console.error(error); }
    };

    // Editar anuncio
    window.prepararEdicion = (anuncio) => {
        editandoId = anuncio.id_anuncio;
        document.getElementById('title').value = anuncio.nombre;
        document.getElementById('description').value = anuncio.descripcion;
        document.getElementById('publication-date').value = anuncio.fecha;

        const btnEnviar = formAdd.querySelector('.form__button--primary');
        btnEnviar.innerHTML = '<i class="fa-solid fa-save"></i> Guardar Cambios';
        btnEnviar.style.backgroundColor = "#059669";

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Enviar formulario
    formAdd.onsubmit = async (e) => {
        e.preventDefault();
        const datos = {
            nombre: document.getElementById('title').value,
            descripcion: document.getElementById('description').value,
            fecha: document.getElementById('publication-date').value
        };

        const url = editandoId ? `http://localhost:3000/api/anuncios/${editandoId}` : 'http://localhost:3000/api/anuncios';
        const method = editandoId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if ((await res.json()).success) {
            alert(editandoId ? "Actualizado" : "Creado");
            limpiarFormulario();
            cargarAnuncios();
        }
    };

    // Eliminar
    window.eliminarAnuncio = async (id) => {
        if (!confirm("¿Eliminar anuncio?")) return;
        const res = await fetch(`http://localhost:3000/api/anuncios/${id}`, { method: 'DELETE' });
        if ((await res.json()).success) cargarAnuncios();
    };

    cargarAnuncios();

});