const Escuela = require('../models/Escuela');
const upload = require('../ftpUploader'); // Importamos el middleware para usar la lógica FTP

// --- 1. OBTENER TODAS las escuelas ---
exports.getAllEscuelas = async (req, res, next) => {
    try {
        const escuelas = await Escuela.findAll();
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
        let logo_url = null;

        // Si Multer recibió un archivo, lo subimos al FTP de Hostinger
        if (req.file) {
            // upload.ftp.uploadFile es la función que definimos en ftpUploader.js
            await upload.ftp.uploadFile(req.file.path, req.file.filename);
            logo_url = req.file.filename;
        }

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El campo "nombre" es obligatorio.',
            });
        }

        const nuevaEscuela = await Escuela.create({
            nombre,
            contacto,
            status,
            ciudad,
            pais,
            logo_url
        });

        res.status(201).json({
            success: true,
            data: nuevaEscuela,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al crear academia' });
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

        let logo_url = escuela.logo_url;

        // Si se sube un nuevo logo, lo mandamos al FTP y actualizamos el nombre
        if (req.file) {
            await upload.ftp.uploadFile(req.file.path, req.file.filename);
            logo_url = req.file.filename;
        }

        await escuela.update({
            nombre,
            contacto,
            status,
            ciudad,
            pais,
            logo_url
        });

        res.status(200).json({
            success: true,
            data: escuela,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al actualizar academia' });
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

        // Opcional: Podrías añadir lógica aquí para borrar el archivo del FTP también
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