"use strict";

require("dotenv").config();
const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test conexión
(async () => {
    try {
        await db.query("SELECT 1");
        console.log("✅ MySQL conectado");
    } catch (err) {
        console.error("❌ Error MySQL:", err.message);
    }
})();

module.exports = db;