"use strict";
const bcrypt = require("bcrypt");
const db = require("../config/db");
/**
 * ============================================================
 * 📌 Controller: login
 * ============================================================
 */
/**
 * //////////////////////////////////////////////////////////////////////////////////////////////////
 * Valida credenciales y retorna datos del usuario + datos de comunero si existen
 */
const LoginController = {
    async autenticar(username, password) {
        const sql = `SELECT u.id, u.username, u.password_hash, u.role, u.comunero_id, c.nombre_completo, c.correo FROM usuarios u LEFT JOIN comuneros c ON u.comunero_id = c.id WHERE u.username = ? AND u.activo = 1`;

        const [rows] = await db.query(sql, [username]);

        if (rows.length === 0) {
            throw new Error("El usuario no existe o está inactivo");
        }

        const usuario = rows[0];

        // Se encripta la contraseña recibida para la correcta validacion
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            throw new Error("Contraseña incorrecta");
        }

        // Estructuramos la respuesta
        return {
            id: usuario.id,
            username: usuario.username,
            role: usuario.role,
            // Solo incluimos datos de perfil si es comunero
            perfil: usuario.role === 'comunero' ? {
                nombre: usuario.nombre_completo,
                correo: usuario.correo
            } : null
        };
    }
};

module.exports = LoginController;