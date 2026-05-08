const express = require('express');
const router = express.Router();
const anunciosController = require('./anuncios_controller');

router.get('/', anunciosController.obtenerAnuncios);
router.post('/', anunciosController.crearAnuncio);
router.delete('/:id', anunciosController.eliminarAnuncio); // Para eliminar
router.put('/:id', anunciosController.editarAnuncio);     // Para editar

module.exports = router;