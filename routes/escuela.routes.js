const express = require('express');
const router = express.Router();


const {
    getAllEscuelas,
    createEscuela,
    updateEscuela,  
    deleteEscuela   
} = require('../controllers/escuela.controller.js');


router.get('/', getAllEscuelas);
router.post('/', createEscuela);


router.put('/:id', updateEscuela);    
router.delete('/:id', deleteEscuela); 

module.exports = router;