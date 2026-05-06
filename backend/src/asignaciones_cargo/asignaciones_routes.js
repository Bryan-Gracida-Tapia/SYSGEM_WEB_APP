"use strict";

const express = require("express");
const router = express.Router();
const ctrl = require("./asignaciones_controller");

// dashboard
router.get("/elegibles/:cargoId", ctrl.getElegibles);
router.get("/cargos", ctrl.getCargos);
// asignar
router.post("/asignar", ctrl.asignarCargo);

module.exports = router;