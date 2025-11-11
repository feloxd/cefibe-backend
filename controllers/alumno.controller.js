const Alumno = require('../models/Alumno'); 
const Escuela = require('../models/Escuela'); 


exports.verifyAlumnoByMatricula = async (req, res, next) => {
    try {
        
        const { matricula } = req.params;
   
        const alumno = await Alumno.findOne({
            where: { matricula: matricula },
            include: {
                model: Escuela, 
                attributes: ['nombre', 'ciudad', 'pais'] 
            }
        });

        
        if (!alumno) {
            return res.status(404).json({
                success: false,
                message: 'Matrícula no encontrada. Verifica los datos.',
            });
        }

       
        res.status(200).json({
            success: true,
            data: alumno,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};


exports.createAlumno = async (req, res, next) => {
    try {
        
        const { matricula, nombre, apellido, generacion, curso, EscuelaId } = req.body;

        
        if (!matricula || !nombre || !apellido || !EscuelaId) {
            return res.status(400).json({
                success: false,
                message: 'Los campos "matricula", "nombre", "apellido" y "EscuelaId" son obligatorios.',
            });
        }

        
        const nuevoAlumno = await Alumno.create({
            matricula,
            nombre,
            apellido,
            generacion,
            curso,
            EscuelaId, 
        });

        res.status(201).json({
            success: true,
            data: nuevoAlumno,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};


exports.getAllAlumnos = async (req, res, next) => {
    try {
        const alumnos = await Alumno.findAll({ include: Escuela });

        res.status(200).json({
            success: true,
            count: alumnos.length,
            data: alumnos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

exports.updateAlumno = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const { matricula, nombre, apellido, generacion, curso, EscuelaId } = req.body;

        const alumno = await Alumno.findByPk(id);

        if (!alumno) {
            return res.status(404).json({
                success: false,
                message: 'Alumno no encontrado.',
            });
        }

        
        await alumno.update({
            matricula,
            nombre,
            apellido,
            generacion,
            curso,
            EscuelaId,
        });

        res.status(200).json({
            success: true,
            data: alumno, 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};


exports.deleteAlumno = async (req, res, next) => {
    try {
        const { id } = req.params;
        const alumno = await Alumno.findByPk(id);

        if (!alumno) {
            return res.status(404).json({
                success: false,
                message: 'Alumno no encontrado.',
            });
        }

        await alumno.destroy();

        res.status(200).json({
            success: true,
            message: 'Alumno eliminado exitosamente.',
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};