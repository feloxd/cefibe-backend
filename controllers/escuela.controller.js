const Escuela = require('../models/Escuela');
const upload = require('../ftpUploader');
const fs = require('fs').promises;

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

exports.createEscuela = async (req, res, next) => {
    try {
        // ACTUALIZADO: Se reciben los nuevos campos de belleza del req.body
        const {
            nombre,
            matricula,
            contacto,
            status,
            ciudad,
            pais,
            fecha_incorporacion,
            maestra_responsable,
            ramo
        } = req.body;

        let logo_url = null;
        const uploader = upload.ftp || upload;

        if (req.file) {
            await uploader.uploadFile(req.file.path, req.file.filename);
            logo_url = req.file.filename;
            await fs.unlink(req.file.path).catch(console.error);
        }

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El campo "nombre" es obligatorio.',
            });
        }

        const nuevaEscuela = await Escuela.create({
            nombre,
            matricula,
            contacto,
            status,
            ciudad,
            pais,
            fecha_incorporacion, // NUEVO
            maestra_responsable, // NUEVO
            ramo,               // NUEVO
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

exports.updateEscuela = async (req, res, next) => {
    try {
        const { id } = req.params;
        // ACTUALIZADO: Se reciben los nuevos campos para permitir ediciones
        const {
            nombre,
            matricula,
            contacto,
            status,
            ciudad,
            pais,
            fecha_incorporacion,
            maestra_responsable,
            ramo
        } = req.body;

        const escuela = await Escuela.findByPk(id);

        if (!escuela) {
            return res.status(404).json({
                success: false,
                message: 'Escuela no encontrada.',
            });
        }

        let logo_url = escuela.logo_url;
        const uploader = upload.ftp || upload;

        if (req.file) {
            if (escuela.logo_url) {
                const oldFile = escuela.logo_url.split('/').pop();
                try { await uploader.deleteFile(oldFile); } catch (e) { }
            }
            await uploader.uploadFile(req.file.path, req.file.filename);
            logo_url = req.file.filename;
            await fs.unlink(req.file.path).catch(console.error);
        }

        await escuela.update({
            nombre,
            matricula,
            contacto,
            status,
            ciudad,
            pais,
            fecha_incorporacion, 
            maestra_responsable, 
            ramo,               
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

        const uploader = upload.ftp || upload;

        if (escuela.logo_url) {
            try {
                const fileName = escuela.logo_url.split('/').pop();
                await uploader.deleteFile(fileName);
            } catch (err) {
                console.error("Error borrando archivo en FTP:", err.message);
            }
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