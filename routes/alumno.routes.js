const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// CONFIGURACIÓN DE ALMACENAMIENTO TEMPORAL
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Render usará esta carpeta temporalmente antes de mandar al FTP
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const {
    createAlumno,
    getAllAlumnos,
    verifyAlumnoByMatricula,
    updateAlumno,
    deleteAlumno
} = require('../controllers/alumno.controller.js');

// Configuración de campos para Multer (reutilizable)
const uploadFields = upload.fields([
    { name: 'foto_url', maxCount: 1 },
    { name: 'certificado_url', maxCount: 1 }
]);

router.get('/', getAllAlumnos);

// POST: Crear alumno con archivos
router.post('/', uploadFields, createAlumno);

router.get('/verificar/:matricula', verifyAlumnoByMatricula);

// CAMBIO CLAVE: Agregamos uploadFields aquí para que updateAlumno pueda recibir nuevas fotos
router.put('/:id', uploadFields, updateAlumno);

router.delete('/:id', deleteAlumno);

module.exports = router;