const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 


const Servicio = sequelize.define('Servicio', {
    
    nombre: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    descripcion: {
        type: DataTypes.TEXT, 
        allowNull: true, 
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: true,
    },
    duracion: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
    
});

module.exports = Servicio;