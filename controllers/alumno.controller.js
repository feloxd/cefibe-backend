const Alumno = require('../models/Alumno');
const Escuela = require('../models/Escuela');
const ftpUploader = require('../ftpUploader');
const fs = require('fs').promises;

// --- NUEVA FUNCIÓN: Obtener todos los alumnos ---
exports.getAllAlumnos = async (req, res, next) => {
    try {
        const alumnos = await Alumno.findAll({ include: Escuela });
        res.status(200).json({
            success: true,
            count: alumnos.length,
            data: alumnos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

// --- NUEVA FUNCIÓN: Verificar por matrícula (Frontend) ---
exports.verifyAlumnoByMatricula = async (req, res, next) => {
    try {
        const { matricula } = req.params;
        const alumno = await Alumno.findOne({
            where: { matricula: matricula },
            include: {
                model: Escuela,
                attributes: ['nombre', 'ciudad', 'pais']
            }
        });

        if (!alumno) {
            return res.status(404).json({
                success: false,
                message: 'Matrícula no encontrada.',
            });
        }

        res.status(200).json({
            success: true,
            data: alumno,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

exports.createAlumno = async (req, res, next) => {
    try {
        const { matricula, nombre, apellido, generacion, curso, EscuelaId } = req.body;

        if (!matricula || !nombre || !apellido || !EscuelaId) {
            return res.status(400).json({
                success: false,
                message: 'Los campos "matricula", "nombre", "apellido" y "EscuelaId" son obligatorios.',
            });
        }

        let final_foto_url = null;
        let final_certificado_url = null;

        if (req.files && req.files['foto_url']) {
            const fotoFile = req.files['foto_url'][0];
            const result = await ftpUploader.uploadFile(fotoFile.path, fotoFile.filename);
            final_foto_url = result.url;
            await fs.unlink(fotoFile.path).catch(console.error);
        }

        if (req.files && req.files['certificado_url']) {
            const certFile = req.files['certificado_url'][0];
            const result = await ftpUploader.uploadFile(certFile.path, certFile.filename);
            final_certificado_url = result.url;
            await fs.unlink(certFile.path).catch(console.error);
        }

        const nuevoAlumno = await Alumno.create({
            matricula,
            nombre,
            apellido,
            generacion,
            curso,
            EscuelaId,
            foto_url: final_foto_url,
            certificado_url: final_certificado_url
        });

        res.status(201).json({ success: true, data: nuevoAlumno });

    } catch (error) {
        console.error("Error en createAlumno:", error);
        res.status(500).json({ success: false, message: 'Error al registrar alumno en FTP/BD' });
    }
};

exports.updateAlumno = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { matricula, nombre, apellido, generacion, curso, EscuelaId } = req.body;
        const alumno = await Alumno.findByPk(id);

        if (!alumno) return res.status(404).json({ success: false, message: 'Alumno no encontrado.' });

        let final_foto_url = alumno.foto_url;
        let final_certificado_url = alumno.certificado_url;

        if (req.files && req.files['foto_url']) {
            if (alumno.foto_url) {
                const oldFoto = alumno.foto_url.split('/').pop();
                await ftpUploader.deleteFile(oldFoto).catch(console.error);
            }
            const fotoFile = req.files['foto_url'][0];
            const result = await ftpUploader.uploadFile(fotoFile.path, fotoFile.filename);
            final_foto_url = result.url;
            await fs.unlink(fotoFile.path).catch(console.error);
        }

        if (req.files && req.files['certificado_url']) {
            if (alumno.certificado_url) {
                const oldCert = alumno.certificado_url.split('/').pop();
                await ftpUploader.deleteFile(oldCert).catch(console.error);
            }
            const certFile = req.files['certificado_url'][0];
            const result = await ftpUploader.uploadFile(certFile.path, certFile.filename);
            final_certificado_url = result.url;
            await fs.unlink(certFile.path).catch(console.error);
        }

        await alumno.update({ matricula, nombre, apellido, generacion, curso, EscuelaId, foto_url: final_foto_url, certificado_url: final_certificado_url });
        res.status(200).json({ success: true, data: alumno });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

exports.deleteAlumno = async (req, res, next) => {
    try {
        const { id } = req.params;
        const alumno = await Alumno.findByPk(id);

        if (!alumno) return res.status(404).json({ success: false, message: 'Alumno no encontrado.' });

        if (alumno.foto_url) {
            const fotoName = alumno.foto_url.split('/').pop();
            await ftpUploader.deleteFile(fotoName).catch(console.error);
        }
        if (alumno.certificado_url) {
            const certName = alumno.certificado_url.split('/').pop();
            await ftpUploader.deleteFile(certName).catch(console.error);
        }

        await alumno.destroy();
        res.status(200).json({ success: true, message: 'Alumno y archivos eliminados correctamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al eliminar' });
    }
};