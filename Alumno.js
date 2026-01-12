const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Alumno = sequelize.define('Alumno', {

    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    generacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    curso: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // NUEVOS CAMPOS PARA ARCHIVOS
    foto_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    certificado_url: {
        type: DataTypes.STRING,
        allowNull: true,
    }

});

module.exports = Alumno;