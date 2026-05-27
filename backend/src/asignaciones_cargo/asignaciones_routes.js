"use strict";
const express = require("express");
const router = express.Router();
const ctrl = require("./asignaciones_controller");

// GET
router.get("/elegibles/:cargoId", ctrl.getElegibles);
router.get("/cargos", ctrl.getCargos);
// POST
router.post("/asignar", ctrl.asignarCargo);

module.exports = router;