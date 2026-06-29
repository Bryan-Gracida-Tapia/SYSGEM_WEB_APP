"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API
app.use("/api/comuneros", require("./src/comuneros/comuneros_routes"));
app.use("/api/asignaciones_cargo", require("./src/asignaciones_cargo/asignaciones_routes"));
app.use("/api/login", require("./src/login/login_routes"));
app.use("/api/perfil", require("./src/perfil/perfil_routes"));
app.use("/api/anuncios", require("./src/anuncios/anuncios_routes"));

// Ruta absoluta del frontend
const frontendPath = path.resolve(__dirname, "../frontend");

console.log("Frontend:", frontendPath);

// Servir TODOS los archivos del frontend
app.use(express.static(frontendPath));

// Página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
