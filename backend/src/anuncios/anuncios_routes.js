const express = require('express');
const router = express.Router();
const anunciosController = require('./anuncios_controller');

// GET
router.get('/', anunciosController.obtenerAnuncios);
// POST
router.post('/', anunciosController.crearAnuncio);
// DELETE
router.delete('/:id', anunciosController.eliminarAnuncio);
// PUT
router.put('/:id', anunciosController.editarAnuncio);

module.exports = router;