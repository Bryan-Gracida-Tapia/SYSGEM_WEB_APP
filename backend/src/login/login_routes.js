"use strict";

const express = require("express");
const router = express.Router();
const LoginController = require("./login_controller");
// POST
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await LoginController.autenticar(username, password);

        res.json({
            success: true,
            user: usuario
        });
    } catch (err) {
        // Capturamos los errores del controlador (usuario no existe / contraseña incorrecta)
        res.status(401).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;