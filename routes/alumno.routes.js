const express = require('express');
const router = express.Router();


const {
    createAlumno,
    getAllAlumnos,
    verifyAlumnoByMatricula,
    updateAlumno,  
    deleteAlumno  
} = require('../controllers/alumno.controller.js');


router.get('/', getAllAlumnos);


router.post('/', createAlumno);


router.get('/verificar/:matricula', verifyAlumnoByMatricula);


router.put('/:id', updateAlumno);    
router.delete('/:id', deleteAlumno); 

module.exports = router;