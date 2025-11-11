const Mensaje = require('../models/Mensaje'); // Importamos el molde

// POST /api/v1/contacto
// Función para RECIBIR un nuevo mensaje
exports.createMensaje = async (req, res, next) => {
    try {
        const { nombre, email, mensaje } = req.body;

        if (!nombre || !email || !mensaje) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos (nombre, email, mensaje) son obligatorios.',
            });
        }

        const nuevoMensaje = await Mensaje.create({
            nombre,
            email,
            mensaje,
        });

        res.status(201).json({
            success: true,
            message: 'Mensaje recibido exitosamente.',
            data: nuevoMensaje,
        });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ success: false, message: 'Email inválido.' });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};