"use strict";
/**
 * ============================================================
 * 📌 Server
 * ============================================================
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const comunerosRoutes = require("./src/comuneros/comuneros_routes");
const asignacionesRoutes = require("./src/asignaciones_cargo/asignaciones_routes");
const loginRoutes = require("./src/login/login_routes");


app.use("/api/comuneros", comunerosRoutes);
app.use("/api/asignaciones_cargo", asignacionesRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/perfil", require("./src/perfil/perfil_routes"));
app.use("/api/anuncios", require("./src/anuncios/anuncios_routes"));
// Test
app.get("/", (req, res) => {
    res.send("API funcionando ");
});

// Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
