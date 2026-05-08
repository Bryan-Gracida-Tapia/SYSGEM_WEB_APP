const express = require('express');
const router = express.Router();
const PerfilController = require('./perfil_controller');

// Usamos obtenerDatos que es la función que ya tienes en tu controlador
router.get('/:id', async (req, res) => {
    try {
        const datos = await PerfilController.obtenerDatos(req.params.id);
        res.json({ success: true, data: datos });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

module.exports = router;