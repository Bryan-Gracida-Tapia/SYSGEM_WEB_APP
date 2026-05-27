"use strict";
const db = require("../config/db");
/**
 * ============================================================
 * 📌 Controller: anuncios
 * ============================================================
 */

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Obtener candidatos
 */
exports.getElegibles = async (req, res) => {
    try {
        const { cargoId } = req.params;

        const [rows] = await db.query("SELECT c.id, c.nombre_completo,c.fecha_inicio FROM comuneros c WHERE c.estado = 'activo' AND NOT EXISTS (SELECT 1 FROM asignaciones_cargo ac WHERE ac.comunero_id = c.id AND ac.activo = 1) ORDER BY c.fecha_inicio ASC");

        res.json({ success: true, data: rows });

    } catch (error) {
        console.error("Error elegibles:", error);
        res.status(500).json({
            success: false,
            message: "Error obteniendo elegibles"
        });
    }
};

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Asignar cargo
 */
exports.asignarCargo = async (req, res) => {
    try {
        const {
            comunero_id,
            cargo_id,
            fecha_inicio,
            fecha_fin
        } = req.body;

        // Validacion de datos
        if (!comunero_id || !cargo_id || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                message: "Faltan datos"
            });
        }

        // Validar si ya tiene un cargo activo
        const [activo] = await db.query("SELECT id FROM asignaciones_cargo WHERE comunero_id = ? AND activo = 1", [comunero_id]);

        if (activo.length > 0) {
            return res.status(400).json({
                success: false,
                message: "El comunero ya tiene un cargo activo"
            });
        }

        // Insert
        await db.query("INSERT INTO asignaciones_cargo(comunero_id, cargo_id, fecha_inicio, fecha_fin, activo) VALUES (?, ?, ?, ?, 1)", [comunero_id, cargo_id, fecha_inicio, fecha_fin]);

        res.json({
            success: true,
            message: "Cargo asignado correctamente"
        });

    } catch (error) {
        console.error("Error asignar:", error);
        res.status(500).json({
            success: false,
            message: "Error al asignar cargo"
        });
    }
};
/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Cargar datos
 */
exports.getCargos = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, nombre FROM cargos WHERE activo = 1 ORDER BY nombre ASC");

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error obteniendo cargos"
        });
    }
};