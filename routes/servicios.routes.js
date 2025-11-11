const express = require('express');
const router = express.Router();

const {
    getAllServicios,
    createServicio,
    updateServicio, // <-- NUEVA
    deleteServicio  // <-- NUEVA
} = require('../controllers/servicio.controller.js');

// Rutas que afectan a la raíz (GET todos, POST uno)
router.get('/', getAllServicios);
router.post('/', createServicio);

// Rutas que afectan a un ID específico (Update, Delete)
// El ':id' es un parámetro que recibimos en la URL
router.put('/:id', updateServicio);    // <-- NUEVA
router.delete('/:id', deleteServicio); // <-- NUEVA

module.exports = router;