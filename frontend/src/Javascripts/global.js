
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
    loadComuneros().catch((error) => {
        console.error(error);
        setStatusMessage("Error al cargar comuneros");
    });
});
/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// CARGA DE DATOS
 * Carga todos los comuneros desde backend
 */
async function loadComuneros() {
    setStatusMessage("Cargando...");

    const data = await fetchComunerosDashboard();

    state.comuneros = data.comuneros || [];
    state.filtered = [...state.comuneros];

    renderComunerosList(state.filtered);
    renderSummary(data.estadisticas);

    setStatusMessage(`${state.comuneros.length} comuneros cargados`);
}

/**
 * Intenta obtener comuneros desde varios endpoints
 */
async function fetchComunerosDashboard() {
    let lastError;

    for (const endpoint of ENDPOINTS.dashboardCandidates) {
        try {
            const res = await dbApiFetch(endpoint);

            //validar errores del backend
            if (!res.ok) {
                throw new Error(`Error HTTP ${res.status}`);
            }

            const json = await safeJson(res);

            console.log("Respuesta backend:", json);

            return normalizeDashboardPayload(json);

        } catch (e) {
            lastError = e;
        }
    }

    throw lastError || new Error("Error obteniendo comuneros");
}
/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// NORMALIZACIÓN DE DATOS
 * Unifica estructura de respuesta del backend
 */
function normalizeDashboardPayload(payload) {
    const data = payload?.data ?? payload ?? {};
    const comunerosRaw = Array.isArray(data) ? data : ensureArray(data.comuneros);

    const comuneros = comunerosRaw.map(normalizeComunero);
    const stats = computeStats(comuneros);

    return { comuneros, estadisticas: stats };
}
/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// ESTADÍSTICAS
 */
function computeStats(comuneros) {
    const total = comuneros.length;
    const activos = comuneros.filter(c => c.estado === "activo").length;
    const baja = comuneros.filter(c => c.estado === "baja").length;

    return {
        total,
        activos,
        inactivos: total - activos - baja,
        baja
    };
}
fetch('../components/footer.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
    })
    .catch(err => console.error("Error al cargar el footer:", err));