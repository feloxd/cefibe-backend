const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Escuela = sequelize.define('Escuela', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // Matricula para el buscador oficial solicitado por Fer
    matricula: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    // NUEVOS CAMPOS: Ramos de belleza y administracion
    fecha_incorporacion: {
        type: DataTypes.DATEONLY, // Solo fecha YYYY-MM-DD
        allowNull: true,
    },
    maestra_responsable: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ramo: {
        type: DataTypes.ENUM(
            'Academia en Uñas',
            'Academia de Barberia',
            'Lashista',
            'Maquillaje profesional',
            'Spa'
        ),
        allowNull: true,
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