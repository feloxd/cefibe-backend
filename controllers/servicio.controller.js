const Servicio = require('../models/Servicio'); // Importamos el molde

// 1. OBTENER TODOS los servicios (Este ya lo tenías)
exports.getAllServicios = async (req, res, next) => {
    try {
        const servicios = await Servicio.findAll();

        res.status(200).json({
            success: true,
            count: servicios.length,
            data: servicios,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// 2. CREAR un nuevo servicio (¡Este es el que faltaba!)
exports.createServicio = async (req, res, next) => {
    try {
        const { nombre, descripcion, precio, duracion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El campo "nombre" es obligatorio.',
            });
        }

        const nuevoServicio = await Servicio.create({
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            duracion: duracion,
        });

        res.status(201).json({
            success: true,
            data: nuevoServicio,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};// PUT /api/v1/servicios/:id
// Función para ACTUALIZAR un servicio
exports.updateServicio = async (req, res, next) => {
    try {
        // El 'id' viene en la URL (req.params.id)
        const { id } = req.params;
        // Los datos a cambiar vienen en el body (req.body)
        const { nombre, descripcion, precio, duracion } = req.body;

        // Buscamos el servicio por su ID
        const servicio = await Servicio.findByPk(id);

        // Si no lo encontramos, mandamos un 404
        if (!servicio) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado.',
            });
        }

        // Actualizamos el servicio en la BD
        await servicio.update({
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            duracion: duracion,
        });

        res.status(200).json({
            success: true,
            data: servicio, // Devolvemos el servicio ya actualizado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// DELETE /api/v1/servicios/:id
// Función para ELIMINAR un servicio
exports.deleteServicio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado.',
            });
        }

        // Eliminamos el servicio de la BD
        await servicio.destroy();

        res.status(200).json({
            success: true,
            message: 'Servicio eliminado exitosamente.',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};