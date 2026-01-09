const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const moduleRoutes = require('./routes/moduleRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/progress', require('./routes/progressRoutes'));

// Base route
app.get('/', (req, res) => {
    res.send('API de Entorno Virtual Educativo funcionando');
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}

module.exports = app;
