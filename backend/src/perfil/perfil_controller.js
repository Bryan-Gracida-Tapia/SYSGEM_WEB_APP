"use strict";
const db = require("../config/db");

/**
 * ============================================================
 * Controller: Perfil
 * ============================================================
 */
const PerfilController = {
    async obtenerDatos(userId) {
        const sql = `
            SELECT
                c.id as comunero_id, 
                c.nombre_completo, 
                c.fecha_nacimiento, 
                c.correo, 
                c.foto_perfil,
                (SELECT ca.nombre FROM asignaciones_cargo ac
                     JOIN cargos ca ON ac.cargo_id = ca.id
                 WHERE ac.comunero_id = c.id AND ac.activo = 1 LIMIT 1) as cargo_actual,
                -- Contamos cuántos cargos tiene registrados como terminados
                (SELECT COUNT(*) FROM comunero_cargos_cumplidos WHERE comunero_id = c.id) as cumplidos
            FROM usuarios u
                JOIN comuneros c ON u.comunero_id = c.id
            WHERE u.id = ?
        `;

        const [rows] = await db.query(sql, [userId]);
        if (rows.length === 0) throw new Error("Perfil no encontrado");

        const usuario = rows[0];


        const totalCargosRequeridos = 6;
        const cumplidos = usuario.cumplidos || 0;


        let faltantes = totalCargosRequeridos - cumplidos;
        if (faltantes < 0) faltantes = 0;


        usuario.cumplidos = cumplidos;
        usuario.en_curso = faltantes;

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
    },


    async obtenerHistorialCargos(userId) {
        // 1. Buscamos el comunero_id asociado a la cuenta del usuario conectado
        const sqlGetComunero = "SELECT comunero_id FROM usuarios WHERE id = ?";
        const [userRows] = await db.query(sqlGetComunero, [userId]);
        if (userRows.length === 0) throw new Error("Usuario no encontrado");

        const comuneroId = userRows[0].comunero_id;

        // 2. Traemos el historial con las columnas reales: id, cargo, year
        const sqlHistorial = `
            SELECT
                id,
                cargo,
                year
            FROM comunero_cargos_cumplidos
            WHERE comunero_id = ?
            ORDER BY year DESC
        `;

        const [historialRows] = await db.query(sqlHistorial, [comuneroId]);
        return historialRows; // Retorna un array vacío [] si no encuentra registros
    }
};

module.exports = PerfilController;