const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Assuming db config is here, if not I'll check userRoutes

// Update Progress (Complete Level)
router.post('/complete', async (req, res) => {
    const { userId, levelId, diamonds } = req.body;

    if (!userId || !levelId || !diamonds) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    try {
        // Get current user stats
        const [users] = await db.query('SELECT nivel_actual, puntos_totales FROM usuarios WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const currentUser = users[0];
        let newLevel = currentUser.nivel_actual;
        let pointsAdded = 0;
        let newPoints = currentUser.puntos_totales;

        // Check if level is already completed
        if (levelId < currentUser.nivel_actual) {
            // Return current state without update
            return res.json({
                message: 'Nivel ya completado anteriormente',
                nivel_actual: currentUser.nivel_actual,
                puntos_totales: currentUser.puntos_totales,
                pointsAdded: 0
            });
        }

        // Only advance level if completing the current max level
        if (levelId === currentUser.nivel_actual) {
            newLevel = currentUser.nivel_actual + 1;
            newPoints = currentUser.puntos_totales + diamonds;
            pointsAdded = diamonds;

            await db.query(
                'UPDATE usuarios SET nivel_actual = ?, puntos_totales = ? WHERE id = ?',
                [newLevel, newPoints, userId]
            );
        }

        res.json({
            message: 'Progreso guardado',
            nivel_actual: newLevel,
            puntos_totales: newPoints,
            pointsAdded: pointsAdded
        });

    } catch (error) {
        console.error('Error al guardar progreso:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Get User Progress
router.get('/:userId', async (req, res) => {
    try {
        const [users] = await db.query('SELECT nivel_actual, puntos_totales FROM usuarios WHERE id = ?', [req.params.userId]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error al obtener progreso:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// Reset Progress (For Testing)
router.post('/reset', async (req, res) => {
    const { userId } = req.body;
    try {
        await db.query('UPDATE usuarios SET nivel_actual = 1, puntos_totales = 0 WHERE id = ?', [userId]);
        res.json({ message: 'Progreso reiniciado', nivel_actual: 1, puntos_totales: 0 });
    } catch (error) {
        console.error('Error reset:', error);
        res.status(500).json({ error: 'Error server' });
    }
});

module.exports = router;
