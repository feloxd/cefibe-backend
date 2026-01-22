const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Escuela = sequelize.define('Escuela', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // NUEVA COLUMNA: Para que el buscador de Fer funcione por numero oficial
    matricula: {
        type: DataTypes.STRING(50),
        allowNull: true, // Lo ponemos true por si hay escuelas viejas sin matricula, pero en el admin sera obligatorio
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
    },
    logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    // Esto asegura que Sequelize use exactamente el nombre de la tabla que vimos en phpMyAdmin
    tableName: 'Escuelas',
    timestamps: false
});

module.exports = Escuela;