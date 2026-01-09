const pool = require('../config/db');

const User = {
    create: async (user) => {
        const { nombre_completo, email, password_hash } = user;
        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre_completo, email, password_hash) VALUES (?, ?, ?)',
            [nombre_completo, email, password_hash]
        );
        return result.insertId;
    },

    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    },

    asignarPuntos: async (usuarioId, puntos) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Sumar puntos
            await connection.query(
                'UPDATE usuarios SET puntos_totales = puntos_totales + ? WHERE id = ?',
                [puntos, usuarioId]
            );

            // 2. Obtener nuevos puntos totales
            const [rows] = await connection.query('SELECT puntos_totales FROM usuarios WHERE id = ?', [usuarioId]);
            const nuevosPuntos = rows[0].puntos_totales;

            // 3. Verificar insignias desbloqueables
            // Buscar insignias que el usuario NO tenga y que cumplan el requisito de puntos
            const [insigniasNuevas] = await connection.query(
                `SELECT * FROM insignias 
         WHERE puntos_requeridos <= ? 
         AND id NOT IN (SELECT insignia_id FROM usuario_insignias WHERE usuario_id = ?)`,
                [nuevosPuntos, usuarioId]
            );

            // 4. Asignar insignias nuevas
            for (const insignia of insigniasNuevas) {
                await connection.query(
                    'INSERT INTO usuario_insignias (usuario_id, insignia_id) VALUES (?, ?)',
                    [usuarioId, insignia.id]
                );
            }

            // 5. Actualizar Nivel (Ejemplo: cada 100 puntos es un nivel)
            const nuevoNivel = Math.floor(nuevosPuntos / 100) + 1;
            await connection.query('UPDATE usuarios SET nivel_actual = ? WHERE id = ?', [nuevoNivel, usuarioId]);

            await connection.commit();
            return { nuevosPuntos, insigniasNuevas, nuevoNivel };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    getBadges: async (usuarioId) => {
        const [rows] = await pool.query(
            `SELECT i.*, ui.fecha_obtencion 
           FROM insignias i 
           JOIN usuario_insignias ui ON i.id = ui.insignia_id 
           WHERE ui.usuario_id = ?`,
            [usuarioId]
        );
        return rows;
    }
};

module.exports = User;
