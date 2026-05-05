window.SYSGEM_DB = {
    async apiFetch(endpoint, options = {}) {

        const base = window.SYSGEM_API_BASE;

        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            ...options
        };

        if (config.body && typeof config.body !== "string") {
            config.body = JSON.stringify(config.body);
        }

        const res = await fetch(base + endpoint, config);

        return res;
    }
};