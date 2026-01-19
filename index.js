// 1. IMPORTS PRINCIPALES
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, sequelize } = require('./config/db'); // Importamos sequelize para sincronizar

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

// 4. INICIAR APP
const app = express();
const PORT = process.env.PORT || 5000;

// 5. MIDDLEWARES
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta de subidas y archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static('public'));

// 6. RUTAS (Uso)
app.use('/api/v1/escuelas', escuelaRoutes);
app.use('/api/v1/alumnos', alumnoRoutes);
app.use('/api/v1/contacto', contactoRoutes);

app.get('/', (req, res) => {
    res.send('¡API de CEFIBE funcionando y conectada a la BD!');
});

// 7. CONEXIÓN Y SINCRONIZACIÓN (LA CLAVE)
async function startServer() {
    try {
        await connectDB();

        // Sincroniza el modelo con la tabla real. 
        // alter: true agregará la columna logo_url sin borrar tus datos actuales.
        await sequelize.sync({ alter: true });
        console.log('✅ Base de datos sincronizada y actualizada');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto: ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
    }
}

startServer();