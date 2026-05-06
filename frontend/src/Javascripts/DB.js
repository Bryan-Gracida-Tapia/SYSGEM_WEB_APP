"use strict";

window.SYSGEM_DB = {
    async apiFetch(endpoint, options = {}) {

        const base = window.SYSGEM_API_BASE || "http://localhost:3000/api";

        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            ...options
        };

        // Serializar body automáticamente
        if (config.body && typeof config.body !== "string") {
            config.body = JSON.stringify(config.body);
        }

        const res = await fetch(base + endpoint, config);

        console.log("HTTP:", config.method || "GET", base + endpoint, res.status);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Error ${res.status}: ${text}`);
        }

        return res;
    }
};