"use strict";

const db = require("../config/db");

/**
 * Mapear datos
 */
function mapComunero(row) {
    return {
        id: row.id,
        nombre: row.nombre_completo,
        nombreCompleto: row.nombre_completo,
        fechaNacimiento: row.fecha_nacimiento,
        estadoCivil: row.estado_civil,
        tipo: row.tipo,
        direccion: row.direccion,
        correo: row.correo,
        estado: row.estado,
        fechaInicio: row.fecha_inicio
    };
}

/**
 * Obtener todos
 */
exports.getComuneros = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM comuneros");
        res.json({ comuneros: rows.map(mapComunero) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Crear comunero
 */
exports.createComunero = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        let {
            nombreCompleto,
            fechaNacimiento,
            estadoCivil,
            tipo,
            direccion,
            correo
        } = req.body;

        // Normalizar tipo
        tipo = tipo?.replace("type_", "");

        // Validación
        if (!nombreCompleto || !fechaNacimiento || !estadoCivil || !tipo || !direccion || !correo) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const [result] = await db.query(
            "INSERT INTO comuneros (nombre_completo, fecha_nacimiento, estado_civil, tipo, direccion, correo, estado, fecha_inicio) VALUES (?, ?, ?, ?, ?, ?, 'activo', NOW())"
            ,[nombreCompleto, fechaNacimiento, estadoCivil, tipo, direccion, correo]
        );

        res.json({
            success: true,
            id: result.insertId
        });

    } catch (err) {
        console.error("ERROR SQL:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Actualizar
 */
exports.updateComunero = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreCompleto, direccion, correo } = req.body;

        await db.query(
            "UPDATE comuneros SET nombre_completo = ?, direccion = ?, correo = ? WHERE id = ?",
            [nombreCompleto, direccion, correo, id]
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Eliminar
 */
exports.deleteComunero = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query("DELETE FROM comuneros WHERE id = ?", [id]);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Cambiar estado
 */
exports.changeEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        await db.query(
            "UPDATE comuneros SET estado = ? WHERE id = ?",
            [estado, id]
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
