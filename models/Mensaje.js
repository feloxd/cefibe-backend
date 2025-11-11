const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Mensaje = sequelize.define('Mensaje', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate: {
            isEmail: true 
        }
    },
    mensaje: {
        type: DataTypes.TEXT, 
        allowNull: false, 
    },
    
});

module.exports = Mensaje;