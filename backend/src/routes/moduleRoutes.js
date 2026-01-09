const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const jwt = require('jsonwebtoken');

// Middleware para verificar token (opcional si los módulos son públicos, pero recomendable)
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // Permitir acceso sin token si es necesario, o forzarlo. Aquí lo forzamos.
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido' });
    }
};

router.get('/', authMiddleware, moduleController.getAllModules);
router.get('/:id', authMiddleware, moduleController.getModuleById);

module.exports = router;
