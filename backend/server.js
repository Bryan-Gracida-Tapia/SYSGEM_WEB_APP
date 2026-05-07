"use strict";

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

app.use("/api/comuneros", comunerosRoutes);
app.use("/api/asignaciones_cargo", asignacionesRoutes);

// Test
app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

// Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
