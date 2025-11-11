// 1. IMPORTS PRINCIPALES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');



const Escuela = require('./models/Escuela');
const Alumno = require('./models/Alumno');
const Mensaje = require('./models/Mensaje');


Escuela.hasMany(Alumno);
Alumno.belongsTo(Escuela);
// ------------------------------

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
// Configuración de CORS: Acepta peticiones del puerto 8080 (tu Frontend) y del CLIENT_URL
app.use(cors({ origin: ['http://localhost:8080', process.env.CLIENT_URL] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 7. RUTAS (Uso)
app.use('/api/v1/escuelas', escuelaRoutes);
app.use('/api/v1/alumnos', alumnoRoutes);
app.use('/api/v1/contacto', contactoRoutes);

// Ruta raíz de prueba (GET /)
app.get('/', (req, res) => {
    res.send('¡API de CEFIBE funcionando y conectada a la BD!');
});

// 8. MANEJADOR DE ERRORES (¡Al final!)
// app.use(errorHandler); // Lo dejamos apagado

// 9. INICIAR EL SERVIDOR (¡Esto DEBE ir al final de todo!)
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});