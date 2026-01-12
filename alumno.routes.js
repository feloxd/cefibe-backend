const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// CONFIGURACIÓN DE ALMACENAMIENTO PARA ARCHIVOS
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Asegúrate de que esta carpeta exista
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

router.get('/', getAllAlumnos);

// CAMBIO CLAVE: Ahora aceptamos múltiples archivos (foto y certificado)
router.post('/', upload.fields([
    { name: 'foto_url', maxCount: 1 },
    { name: 'certificado_url', maxCount: 1 }
]), createAlumno);

router.get('/verificar/:matricula', verifyAlumnoByMatricula);

router.put('/:id', updateAlumno);
router.delete('/:id', deleteAlumno);

module.exports = router;