"use strict";
const db = require("../config/db");

const PerfilController = {
    async obtenerDatos(userId) {
        const sql = `
            SELECT
                c.id as comunero_id, c.nombre_completo, c.fecha_nacimiento, c.correo,
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
        return rows[0];
    },

    async actualizarDatos(userId, { correo }) {
        const sql = "UPDATE comuneros SET correo = ? WHERE id = (SELECT comunero_id FROM usuarios WHERE id = ?)";
        const [result] = await db.query(sql, [correo, userId]);
        return result.affectedRows > 0;
    }
};

module.exports = PerfilController;