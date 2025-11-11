const express = require('express');
const router = express.Router();

// Importamos al "buzón"
const { createMensaje } = require('../controllers/contacto.controller.js');

// POST a la raíz ('/') -> Recibe un nuevo mensaje
router.post('/', createMensaje);

module.exports = router;