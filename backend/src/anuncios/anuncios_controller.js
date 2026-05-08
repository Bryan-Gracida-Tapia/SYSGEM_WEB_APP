"use strict";
const db = require('../config/db');

const AnunciosController = {
    // 1. OBTENER ANUNCIOS (Para la campana y la lista de gestión)
    async obtenerAnuncios(req, res) {
        try {
            // DATE_FORMAT ayuda a que la fecha llegue limpia (AAAA-MM-DD) al input del frontend
            const sql = `SELECT id_anuncio, nombre, descripcion, 
                         DATE_FORMAT(fecha, '%Y-%m-%d') as fecha 
                         FROM anuncios ORDER BY fecha DESC`;
            const [rows] = await db.query(sql);
            res.json({ success: true, data: rows });
        } catch (err) {
            console.error("Error al obtener:", err);
            res.status(500).json({ success: false, message: "Error al consultar la base de datos" });
        }
    },

    // 2. CREAR ANUNCIO (POST)
    async crearAnuncio(req, res) {
        const { nombre, descripcion, fecha } = req.body;
        try {
            const sql = "INSERT INTO anuncios (nombre, descripcion, fecha) VALUES (?, ?, ?)";
            await db.query(sql, [nombre, descripcion, fecha]);
            res.json({ success: true, message: "Anuncio publicado con éxito" });
        } catch (err) {
            console.error("Error al crear:", err);
            res.status(500).json({ success: false, message: "No se pudo guardar el anuncio" });
        }
    },

    // 3. ELIMINAR ANUNCIO (DELETE)
    async eliminarAnuncio(req, res) {
        const { id } = req.params; // Este 'id' viene de la ruta /:id
        try {
            const sql = "DELETE FROM anuncios WHERE id_anuncio = ?";
            const [result] = await db.query(sql, [id]);

            if (result.affectedRows > 0) {
                res.json({ success: true, message: "Anuncio eliminado correctamente" });
            } else {
                res.status(404).json({ success: false, message: "Anuncio no encontrado" });
            }
        } catch (err) {
            console.error("Error al eliminar:", err);
            res.status(500).json({ success: false, message: "Error interno al eliminar" });
        }
    },

    // 4. EDITAR ANUNCIO (PUT)
    async editarAnuncio(req, res) {
        const { id } = req.params;
        const { nombre, descripcion, fecha } = req.body;
        try {
            const sql = "UPDATE anuncios SET nombre = ?, descripcion = ?, fecha = ? WHERE id_anuncio = ?";
            const [result] = await db.query(sql, [nombre, descripcion, fecha, id]);

            if (result.affectedRows > 0) {
                res.json({ success: true, message: "Anuncio actualizado correctamente" });
            } else {
                res.status(404).json({ success: false, message: "No se encontró el anuncio para editar" });
            }
        } catch (err) {
            console.error("Error al editar:", err);
            res.status(500).json({ success: false, message: "Error al actualizar la base de datos" });
        }
    }
};

module.exports = AnunciosController;