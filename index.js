// 1. IMPORTS PRINCIPALES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Añadido para manejar rutas de archivos
const { connectDB } = require('./config/db');

const Escuela = require('./models/Escuela');
const Alumno = require('./models/Alumno');
const Mensaje = require('./models/Mensaje');

// 2. RELACIONES
Escuela.hasMany(Alumno);
Alumno.belongsTo(Escuela);

// 3. RUTAS (Imports)
const escuelaRoutes = require('./routes/escuela.routes.js');
const alumnoRoutes = require('./routes/alumno.routes.js');
const contactoRoutes = require('./routes/contacto.routes.js');

// 4. CONECTAR A LA BD
connectDB();

// 5. INICIAR APP
const app = express();
const PORT = process.env.PORT || 5000;

// 6. MIDDLEWARES
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS ---
// Esto permite que cuando entres a cefibe.com/uploads/foto.jpg se pueda ver la imagen
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// También servimos la carpeta public por si acaso
app.use(express.static('public'));

// 7. RUTAS (Uso)
app.use('/api/v1/escuelas', escuelaRoutes);
app.use('/api/v1/alumnos', alumnoRoutes);
app.use('/api/v1/contacto', contactoRoutes);

// Ruta raíz de prueba
app.get('/', (req, res) => {
    res.send('¡API de CEFIBE funcionando y conectada a la BD con soporte para archivos!');
});

// 8. INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
});