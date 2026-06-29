"use strict";
const bcrypt = require("bcrypt");
const db = require("../config/db");
/**
 * ============================================================
 * 📌 Controller: comuneros
 * ============================================================
 */
/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Mapear datos
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
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Funcion para crear username
 */
function generarUsername(nombreCompleto) {
    return nombreCompleto
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ".")        // espacios → puntos
        .normalize("NFD")            // quitar acentos
        .replace(/[\u0300-\u036f]/g, "");
}

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Obtener datos
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
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Create
 */
exports.createComunero = async (req, res) => {
    const connection = await db.getConnection(); // ✅ CREAR CONEXIÓN

    try {
        console.log("BODY:", req.body);

        let {
            nombreCompleto,
            fechaNacimiento,
            estadoCivil,
            tipo,
            direccion,
            correo,
            password,
            cargos
        } = req.body;
        console.log("CARGOS BACKEND:", cargos);

        tipo = tipo?.replace("type_", "");

        if (!nombreCompleto || !fechaNacimiento || !estadoCivil || !tipo || !direccion || !correo || !password) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const username = generarUsername(nombreCompleto);
        const hashedPassword = await bcrypt.hash(password, 10);


        await connection.beginTransaction();

        // Crear comunero
        const [result] = await connection.query(
            `INSERT INTO comuneros 
            (nombre_completo, fecha_nacimiento, estado_civil, tipo, direccion, correo, estado, fecha_inicio) 
            VALUES (?, ?, ?, ?, ?, ?, 'activo', NOW())`,
            [nombreCompleto, fechaNacimiento, estadoCivil, tipo, direccion, correo]
        );

        const comuneroId = result.insertId;

        //
        console.log("Comunero ID:", comuneroId);

        // 2. Crear usuario
        await connection.query(
            `INSERT INTO usuarios (username, password_hash, role, comunero_id)
             VALUES (?, ?, 'comunero', ?)`,
            [username, hashedPassword, comuneroId]
        );
        // 3. Insertando cargos
        if (cargos && Array.isArray(cargos) && cargos.length > 0) {
            console.log("Insertando cargos:", cargos);

            for (const c of cargos) {

                const cargoId = Number(c.cargoId);
                const anio = Number(c.anio);

                console.log("Insertando:", { comuneroId, cargoId, anio });

                if (!cargoId || !anio) {
                    throw new Error(`Datos inválidos en cargos: ${JSON.stringify(c)}`);
                }

                await connection.query(
                    `INSERT INTO comunero_cargos_cumplidos
                         (comunero_id,  year, cargo_id
                     VALUES (?, ?, ?)`,
                    [comuneroId, anio, cargoId]
                );
            }
        }

        await connection.commit();

        res.json({
            message: "Comunero y usuario creados correctamente"
        });
    } catch (error) {
        if (connection) await connection.rollback();

        console.error("ERROR:", error);

        res.status(500).json({
            error: "Error al crear comunero y usuario",
            detalle: error.message
        });

    } finally {
        if (connection) connection.release();
    }
};

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Update
 */
exports.updateComunero = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            estadoCivil,
            direccion,
        } = req.body;

        await db.query(
            "UPDATE comuneros SET estado_civil = ?, direccion = ? WHERE id = ?",
            [estadoCivil, direccion, id]
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Delete
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
 * ////////////////////////////////////////////////////////////////////////////////////////////////// Cambiar estado
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
