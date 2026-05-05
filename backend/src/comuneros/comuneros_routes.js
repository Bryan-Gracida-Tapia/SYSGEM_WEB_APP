"use strict";

const express = require("express");
const router = express.Router();
const ctrl = require("./comuneros_controller");

// GET
router.get("/", ctrl.getComuneros);

// POST
router.post("/", ctrl.createComunero);

// PUT
router.put("/:id", ctrl.updateComunero);

// DELETE
router.delete("/:id", ctrl.deleteComunero);

// PATCH
router.patch("/:id/estado", ctrl.changeEstado);

module.exports = router;