"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());

// ==========================
// RUTAS
// ==========================
app.use("/api/comuneros", require("./src/comuneros/comuneros_routes"));
app.use("/api/asignaciones_cargo", require("./src/asignaciones_cargo/asignaciones_routes"));
app.use("/api/login", require("./src/login/login_routes"));
app.use("/api/perfil", require("./src/perfil/perfil_routes"));
app.use("/api/anuncios", require("./src/anuncios/anuncios_routes"));

// ==========================
// TEST
// ==========================
app.get("/", (req, res) => {
    res.send("API funcionando");
});

// ==========================
// 404 HANDLER (🔥 IMPORTANTE)
// ==========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada"
    });
});

// ==========================
// SERVIDOR
// ==========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
