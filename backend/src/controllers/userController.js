const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { nombre_completo, email, password } = req.body;

        // Verificar si existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const userId = await User.create({ nombre_completo, email, password_hash });

        res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.json({ token, user: { id: user.id, nombre: user.nombre_completo, rol: user.rol } });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const badges = await User.getBadges(req.user.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Remove password hash
        delete user.password_hash;

        res.json({ ...user, badges });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
    }
}

module.exports = { register, login, getProfile };
