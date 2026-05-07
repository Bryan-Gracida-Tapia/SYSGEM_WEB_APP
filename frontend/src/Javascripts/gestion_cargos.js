"use strict";
/**
 * ============================================================
 * 📌 MÓDULO: GESTIÓN DE CARGOS
 * ============================================================
 * Similar a gestión de comuneros:
 * ✔ Manejo robusto de endpoints (fallback)
 * ✔ Normalización de datos
 * ✔ Manejo de errores seguro
 * ✔ No rompe flujo si falla backend
 */

/**
 * ============================================================
 * 📌 CONFIGURACIÓN HTTP
 * ============================================================
 */
const db = window.SYSGEM_DB;

/**
 * Función base HTTP con:
 * ✔ Timeout
 * ✔ JSON automático
 * ✔ Headers estándar
 */
const dbApiFetch = (db && db.apiFetch)
    ? db.apiFetch.bind(db)
    : async (endpoint, options = {}) => {

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const headers = {
                "Content-Type": "application/json",
                ...(options.headers || {})
            };

            const config = {
                ...options,
                headers,
                signal: controller.signal
            };

            if (config.body && typeof config.body !== "string") {
                config.body = JSON.stringify(config.body);
            }

            const baseUrl = window.SYSGEM_API_BASE || "http://localhost:3000/api";

            return await fetch(`${baseUrl}${endpoint}`, config);

        } finally {
            clearTimeout(timeout);
        }
    };

/**
 * ============================================================
 * 📌 ENDPOINTS (CON FALLBACK)
 * ============================================================
 * 🔥 NUEVO: ahora soporta múltiples rutas como comuneros
 */
const ENDPOINTS = {
    dashboardCandidates: [], // (desactivado)

    cargosCandidates: [
        "/asignaciones_cargo/cargos"
    ],

    elegiblesCandidates: () => [
        `/asignaciones_cargo/elegibles`
    ],

    asignarCargoCandidates: [
        "/asignaciones_cargo/asignar"
    ]
};

/**
 * ============================================================
 * 📌 ESTADO GLOBAL
 * ============================================================
 */
const state = {
    comuneroObjetivo: null,
    cargosDisponibles: [],
    elegibles: [],
    seleccionadoRuleta: null,
    cargoSeleccionado: null
};

/**
 * ============================================================
 * 📌 INIT
 * ============================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    attachAssignHandler();
    attachRuletaEvents();

    cargarCargosDesdeBD().catch((err) => {
        console.error(err);
        setStatusMessage("❌ Error cargando cargos");
    });
});

/**
 * ============================================================
 * 📌 CARGAR CARGOS (CON FALLBACK)
 * ============================================================
 * 🔥 NUEVO: estilo comuneros
 */
async function cargarCargosDesdeBD() {
    try {
        const res = await SYSGEM_DB.apiFetch("/asignaciones_cargo/cargos");
        const data = await res.json();

        if (!data.success) {
            throw new Error("No se pudieron cargar los cargos");
        }

        console.log("Cargos:", data.data);

        llenarSelectCargos(data.data);

    } catch (error) {
        console.error("Error cargar cargos:", error);
    }
}
function llenarSelectCargos(cargos) {
    const select = document.getElementById("cargo-select");
    if (!select) return;

    select.innerHTML = `<option value="">-- Seleccionar cargo</option>`;

    cargos.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.nombre;
        select.appendChild(option);
    });

    state.cargosDisponibles = cargos;
}
/**
 * ============================================================
 * 📌 NORMALIZACIÓN DE CARGOS
 * ============================================================
 * 🔥 NUEVO: igual que comuneros
 */
function normalizeCargos(payload) {

    const data = payload?.data ?? payload ?? [];

    return ensureArray(data).map(c => ({
        id: c.id,
        nombre: c.nombre,
        nivel: c.nivel,
        duracion: c.duracion,
        edad: c.edad,
        activo: c.activo
    }));
}

/**
 * ============================================================
 * 📌 RULETA
 * ============================================================
 */
function attachRuletaEvents() {

    const select = document.getElementById("cargo-select");
    const btn = document.getElementById("roulette-btn");

    select?.addEventListener("change", async (e) => {

        const cargoId = e.target.value;
        if (!cargoId) return;

        const cargo = state.cargosDisponibles.find(c => c.id == cargoId);
        state.cargoSeleccionado = cargo;

        sugerirFechas(cargo);

        await cargarElegibles();
    });

    btn?.addEventListener("click", girarRuleta);
}

/**
 * ============================================================
 * 📌 SUGERIR FECHAS (YA EXISTENTE)
 * ============================================================
 */
function sugerirFechas(cargo) {

    if (!cargo) return;

    const inputInicio = document.getElementById("fecha-inicio");
    const inputFin = document.getElementById("fecha-fin");

    if (!inputInicio || !inputFin) return;

    const hoy = new Date();

    inputInicio.value = hoy.toISOString().split("T")[0];

    if (!cargo.duracion) return;

    const fin = new Date(hoy);

    const d = cargo.duracion.toLowerCase();

    if (d.includes("año")) fin.setFullYear(fin.getFullYear() + 1);
    if (d.includes("mes")) fin.setMonth(fin.getMonth() + 1);
    if (d.includes("semana")) fin.setDate(fin.getDate() + 7);

    inputFin.value = fin.toISOString().split("T")[0];
}

/**
 * ============================================================
 * 📌 CARGAR ELEGIBLES (CON FALLBACK)
 * ============================================================
 * 🔥 NUEVO estilo comuneros
 */
async function cargarElegibles(cargoId) {

    setStatusMessage("Buscando elegibles...");

    let lastError;

    for (const endpoint of ENDPOINTS.elegiblesCandidates(cargoId)) {
        try {

            const res = await dbApiFetch(endpoint);

            if (!res.ok) throw new Error(`Error ${res.status}`);

            const json = await safeJson(res);

            state.elegibles = ensureArray(json.data);

            renderRuleta();

            setStatusMessage(`✅ ${state.elegibles.length} elegibles encontrados`);
            return;

        } catch (err) {
            lastError = err;
        }
    }

    console.error(lastError);
    setStatusMessage("❌ Error cargando elegibles");
}

/**
 * ============================================================
 * 📌 RENDER RULETA
 * ============================================================
 */
function renderRuleta() {

    const container = document.getElementById("roulette-container");

    if (!container) return;

    if (!state.elegibles.length) {
        container.innerHTML = "<p>No hay elegibles</p>";
        return;
    }

    container.innerHTML = state.elegibles.map(c => `
        <div class="roulette-item">${escapeHtml(c.nombre_completo)}</div>
    `).join("");
}

/**
 * ============================================================
 * 📌 GIRAR RULETA
 * ============================================================
 */
function girarRuleta() {

    if (!state.elegibles.length) {
        setStatusMessage("No hay elegibles");
        return;
    }

    const i = Math.floor(Math.random() * state.elegibles.length);
    const seleccionado = state.elegibles[i];

    state.seleccionadoRuleta = seleccionado;

    document.getElementById("resultado-roulette").textContent =
        `Seleccionado: ${seleccionado.nombre_completo}`;
}

/**
 * ============================================================
 * 📌 ASIGNAR CARGO
 * ============================================================
 */
function attachAssignHandler() {

    const button = document.getElementById("asignar-btn");
    if (!button) return;

    button.addEventListener("click", async () => {

        const select = document.getElementById("cargo-select");
        const cargoId = select?.value;

        const fechaInicio = document.getElementById("fecha-inicio")?.value;
        const fechaFin = document.getElementById("fecha-fin")?.value;

        if (!cargoId) {
            setStatusMessage("Selecciona un cargo.");
            return;
        }

        if (!fechaInicio || !fechaFin) {
            setStatusMessage("Debes seleccionar fechas.");
            return;
        }

        if (fechaInicio > fechaFin) {
            setStatusMessage("Fecha inválida.");
            return;
        }

        try {

            setStatusMessage("Asignando...");
            if (!state.seleccionadoRuleta) {
                setStatusMessage("Debes girar la ruleta primero");
                return;
            }

            const res = await assignCargo({
                comunero_id: state.seleccionadoRuleta.id,
                cargo_id: cargoId,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin
            });

            const data = await safeJson(res);

            setStatusMessage(data.message || "Asignado correctamente");

        } catch (err) {
            console.error(err);
            setStatusMessage("❌ Error al asignar");
        }
    });
}

/**
 * ============================================================
 * 📌 API ASIGNAR (CON FALLBACK)
 * ============================================================
 */
async function assignCargo(body) {

    let lastError;

    for (const endpoint of ENDPOINTS.asignarCargoCandidates) {
        try {

            const res = await dbApiFetch(endpoint, {
                method: "POST",
                body
            });

            if (res.ok) return res;

            lastError = new Error(`Error ${res.status}`);

        } catch (err) {
            lastError = err;
        }
    }

    throw lastError;
}

/**
 * ============================================================
 * 📌 HELPERS (REUTILIZADOS)
 * ============================================================
 */
function setStatusMessage(msg) {
    const el = document.getElementById("roulette-message");
    if (el) el.textContent = msg;
}

function safeJson(res) {
    return res.json().catch(() => ({}));
}

function ensureArray(v) {
    return Array.isArray(v) ? v : [];
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}