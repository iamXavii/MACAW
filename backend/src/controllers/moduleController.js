const Module = require('../models/Module');

const getAllModules = async (req, res) => {
    try {
        const modules = await Module.findAll();
        res.json(modules);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener módulos', error: error.message });
    }
};

const getModuleById = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ message: 'Módulo no encontrado' });
        res.json(module);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener módulo', error: error.message });
    }
}

module.exports = { getAllModules, getModuleById };
