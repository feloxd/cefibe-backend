const express = require('express');
const router = express.Router();
const upload = require('../ftpUploader.js');

const {
    getAllEscuelas,
    createEscuela,
    updateEscuela,
    deleteEscuela
} = require('../controllers/escuela.controller.js');

router.get('/', getAllEscuelas);

// Sincronizado: el nombre del campo debe ser 'logo' en el frontend
router.post('/', upload.single('logo'), createEscuela);

// Actualizado: agregamos Multer al PUT para permitir cambiar el logo de una academia
router.put('/:id', upload.single('logo'), updateEscuela);

router.delete('/:id', deleteEscuela);

module.exports = router;