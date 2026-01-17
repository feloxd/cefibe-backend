const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// CONFIGURACIÓN DE ALMACENAMIENTO TEMPORAL
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// IMPORTANTE: Verifica que estos nombres coincidan con los 'exports' de tu controlador
const {
    createAlumno,
    getAllAlumnos,
    verifyAlumnoByMatricula, // Si en el controlador se llama 'verificarAlumno', cámbialo aquí
    updateAlumno,
    deleteAlumno
} = require('../controllers/alumno.controller.js');

const uploadFields = upload.fields([
    { name: 'foto_url', maxCount: 1 },
    { name: 'certificado_url', maxCount: 1 }
]);

router.get('/', getAllAlumnos);
router.post('/', uploadFields, createAlumno);
router.get('/verificar/:matricula', verifyAlumnoByMatricula);
router.put('/:id', uploadFields, updateAlumno);
router.delete('/:id', deleteAlumno);

module.exports = router;