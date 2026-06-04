const express = require('express');
const router = express.Router();
const PerfilController = require('./perfil_controller');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/:id/historial', async (req, res) => {
    try {
        const userId = req.params.id;
        const historial = await PerfilController.obtenerHistorialCargos(userId);
        res.json({ success: true, data: historial });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const datos = await PerfilController.obtenerDatos(req.params.id);
        res.json({ success: true, data: datos });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});


router.put('/:id', upload.single('foto_perfil'), async (req, res) => {
    try {
        const userId = req.params.id;
        const { correo } = req.body;

        const fotoBinaria = req.file ? req.file.buffer : null;

        const actualizado = await PerfilController.actualizarDatos(userId, { correo, foto_perfil: fotoBinaria });

        if (actualizado) {
            res.json({ success: true, message: "Perfil actualizado correctamente." });
        } else {
            res.status(400).json({ success: false, message: "No se pudo actualizar el perfil." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;