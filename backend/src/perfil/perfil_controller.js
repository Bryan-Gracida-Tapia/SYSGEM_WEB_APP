"use strict";
const db = require("../config/db");

/**
 * ============================================================
 * 📌 Controller: Perfil
 * ============================================================
 */
const PerfilController = {
    async obtenerDatos(userId) {
        const sql = `
            SELECT
                c.id as comunero_id, c.nombre_completo, c.fecha_nacimiento, c.correo, c.foto_perfil,
                (SELECT ca.nombre FROM asignaciones_cargo ac
                                           JOIN cargos ca ON ac.cargo_id = ca.id
                 WHERE ac.comunero_id = c.id AND ac.activo = 1 LIMIT 1) as cargo_actual,
                (SELECT COUNT(*) FROM comunero_cargos_cumplidos WHERE comunero_id = c.id) as cumplidos,
                (SELECT COUNT(*) FROM asignaciones_cargo WHERE comunero_id = c.id AND activo = 1) as en_curso
            FROM usuarios u
                JOIN comuneros c ON u.comunero_id = c.id
            WHERE u.id = ?
        `;
        const [rows] = await db.query(sql, [userId]);
        if (rows.length === 0) throw new Error("Perfil no encontrado");

        const usuario = rows[0];

        // 📌 Transformar el Buffer Binario de la base de datos a un String Base64 para el Frontend
        if (usuario.foto_perfil) {
            usuario.foto_perfil = usuario.foto_perfil.toString('base64');
        }

        return usuario;
    },

    async actualizarDatos(userId, { correo, foto_perfil }) {
        const sqlGetComunero = "SELECT comunero_id FROM usuarios WHERE id = ?";
        const [rows] = await db.query(sqlGetComunero, [userId]);
        if (rows.length === 0) return false;

        const comuneroId = rows[0].comunero_id;

        const sqlUpdate = `
            UPDATE comuneros
            SET correo = ?, foto_perfil = IFNULL(?, foto_perfil)
            WHERE id = ?
        `;
        const [result] = await db.query(sqlUpdate, [correo, foto_perfil, comuneroId]);
        return result.affectedRows > 0;
    }
};

module.exports = PerfilController;