const express = require('express');
const router = express.Router();
const upload = require('../ftpUploader.js'); // Importamos el middleware que ya usas para alumnos

const {
    getAllEscuelas,
    createEscuela,
    updateEscuela,
    deleteEscuela
} = require('../controllers/escuela.controller.js');

router.get('/', getAllEscuelas);

// Agregamos el middleware .single('logo') para capturar el archivo
// El nombre 'logo' debe coincidir con el campo que enviemos desde el frontend
router.post('/', upload.single('logo'), createEscuela);

router.put('/:id', updateEscuela);
router.delete('/:id', deleteEscuela);

module.exports = router;