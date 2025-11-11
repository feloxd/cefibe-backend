const Escuela = require('../models/Escuela'); // Importamos el molde

// --- 1. OBTENER TODAS las escuelas ---
exports.getAllEscuelas = async (req, res, next) => {
    try {
        const escuelas = await Escuela.findAll(); // Busca todas

        res.status(200).json({
            success: true,
            count: escuelas.length,
            data: escuelas,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// --- 2. CREAR una nueva escuela ---
exports.createEscuela = async (req, res, next) => {
    try {
        const { nombre, contacto, status, ciudad, pais } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El campo "nombre" es obligatorio.',
            });
        }

        const nuevaEscuela = await Escuela.create({
            nombre: nombre,
            contacto: contacto,
            status: status,
            ciudad: ciudad,
            pais: pais,
        });

        res.status(201).json({
            success: true,
            data: nuevaEscuela,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// --- 3. ACTUALIZAR una escuela (por ID) ---
exports.updateEscuela = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, contacto, status, ciudad, pais } = req.body;

        const escuela = await Escuela.findByPk(id);

        if (!escuela) {
            return res.status(404).json({
                success: false,
                message: 'Escuela no encontrada.',
            });
        }

        await escuela.update({
            nombre: nombre,
            contacto: contacto,
            status: status,
            ciudad: ciudad,
            pais: pais,
        });

        res.status(200).json({
            success: true,
            data: escuela,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// --- 4. ELIMINAR una escuela (por ID) ---
exports.deleteEscuela = async (req, res, next) => {
    try {
        const { id } = req.params;
        const escuela = await Escuela.findByPk(id);

        if (!escuela) {
            return res.status(404).json({
                success: false,
                message: 'Escuela no encontrada.',
            });
        }

        await escuela.destroy();

        res.status(200).json({
            success: true,
            message: 'Escuela eliminada exitosamente.',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};