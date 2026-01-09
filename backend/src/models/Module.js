const pool = require('../config/db');

const Module = {
    findAll: async () => {
        // Obtener módulos ordenados
        const [modules] = await pool.query('SELECT * FROM modulos ORDER BY orden ASC');

        // Para cada módulo, obtener sus lecciones
        for (const mod of modules) {
            const [lessons] = await pool.query('SELECT id, titulo, orden, dinamica_sugerida FROM lecciones WHERE modulo_id = ? ORDER BY orden ASC', [mod.id]);
            mod.lessons = lessons;
        }

        return modules;
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM modulos WHERE id = ?', [id]);
        if (rows.length === 0) return null;

        const module = rows[0];
        const [lessons] = await pool.query('SELECT * FROM lecciones WHERE modulo_id = ? ORDER BY orden ASC', [id]);
        module.lessons = lessons;

        return module;
    }
};

module.exports = Module;
