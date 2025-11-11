const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);


const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida exitosamente.');

       
        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados con la BD.');

    } catch (error) {
        console.error('❌ No se pudo conectar/sincronizar la BD:', error);
        process.exit(1);
    }
};


module.exports = { sequelize, connectDB };