const Alumno = require('../models/Alumno');
const Escuela = require('../models/Escuela');
const ftpUploader = require('../ftpUploader');
const fs = require('fs').promises;

// ... (getAllAlumnos y verifyAlumnoByMatricula se mantienen sin cambios)

exports.createAlumno = async (req, res, next) => {
    try {
        const { matricula, nombre, apellido, generacion, curso, EscuelaId } = req.body;

        if (!matricula || !nombre || !apellido || !EscuelaId) {
            return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
        }

        let final_foto_url = null;
        let final_certificado_url = null;

        // Intentar subida con ruta dinámica para evitar errores de objeto
        const uploader = ftpUploader.ftp || ftpUploader;

        if (req.files && req.files['foto_url']) {
            const fotoFile = req.files['foto_url'][0];
            const result = await uploader.uploadFile(fotoFile.path, fotoFile.filename);
            final_foto_url = result.url;
            await fs.unlink(fotoFile.path).catch(console.error);
        }

        if (req.files && req.files['certificado_url']) {
            const certFile = req.files['certificado_url'][0];
            const result = await uploader.uploadFile(certFile.path, certFile.filename);
            final_certificado_url = result.url;
            await fs.unlink(certFile.path).catch(console.error);
        }

        const nuevoAlumno = await Alumno.create({
            matricula, nombre, apellido, generacion, curso, EscuelaId,
            foto_url: final_foto_url,
            certificado_url: final_certificado_url
        });

        res.status(201).json({ success: true, data: nuevoAlumno });
    } catch (error) {
        console.error("Error en createAlumno:", error);
        res.status(500).json({ success: false, message: 'Error al registrar egresado.' });
    }
};

// --- ELIMINAR EGRESADO (CORRECCIÓN FINAL PARA EL LIVE) ---
exports.deleteAlumno = async (req, res, next) => {
    try {
        const { id } = req.params;
        const alumno = await Alumno.findByPk(id);

        if (!alumno) return res.status(404).json({ success: false, message: 'Alumno no encontrado.' });

        // Identificar dinámicamente el objeto correcto para no fallar el TypeError
        const uploader = ftpUploader.ftp || ftpUploader;

        // Borrar archivos con manejo de errores silencioso para no bloquear el destroy()
        if (alumno.foto_url) {
            try {
                const fotoName = alumno.foto_url.split('/').pop();
                await uploader.deleteFile(fotoName);
            } catch (fErr) { console.error("Error borrando foto FTP:", fErr.message); }
        }

        if (alumno.certificado_url) {
            try {
                const certName = alumno.certificado_url.split('/').pop();
                await uploader.deleteFile(certName);
            } catch (cErr) { console.error("Error borrando certificado FTP:", cErr.message); }
        }

        // Ejecutar el borrado en la base de datos
        await alumno.destroy();

        res.status(200).json({
            success: true,
            message: 'Egresado eliminado de la base de datos correctamente.'
        });

    } catch (error) {
        console.error("Error fatal en deleteAlumno:", error);
        res.status(500).json({
            success: false,
            message: "No se pudo eliminar: " + error.message
        });
    }
};