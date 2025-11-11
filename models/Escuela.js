const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Escuela = sequelize.define('Escuela', {
    
    nombre: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true 
    },
    contacto: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
    ciudad: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pais: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = Escuela;