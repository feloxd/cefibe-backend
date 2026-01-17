const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

class FTPUploader {
    constructor() {
        this.config = {
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: process.env.FTP_SECURE === 'true',
            port: process.env.FTP_PORT || 21
        };

        this.remotePath = process.env.FTP_REMOTE_PATH || '/public_html/uploads';
    }

    async uploadFile(localFilePath, remoteFileName) {
        const client = new ftp.Client();
        client.ftp.verbose = process.env.NODE_ENV !== 'production';

        try {
            // Conectar al servidor FTP
            await client.access(this.config);
            console.log(`✅ Conectado a FTP: ${this.config.host}`);

            // Verificar/crear directorio remoto
            try {
                await client.ensureDir(this.remotePath);
                console.log(`📁 Directorio verificado: ${this.remotePath}`);
            } catch (error) {
                console.warn(`⚠️ No se pudo crear/verificar directorio: ${error.message}`);
            }

            // Subir archivo
            const remotePath = `${this.remotePath}/${remoteFileName}`;
            await client.uploadFrom(localFilePath, remotePath);
            console.log(`✅ Archivo subido: ${remotePath}`);

            return {
                success: true,
                url: `https://cefibe.com/uploads/${remoteFileName}`,
                remotePath
            };

        } catch (error) {
            console.error('❌ Error FTP:', error);
            throw new Error(`FTP Upload failed: ${error.message}`);
        } finally {
            client.close();
        }
    }

    async deleteFile(remoteFileName) {
        const client = new ftp.Client();
        try {
            await client.access(this.config);
            const remotePath = `${this.remotePath}/${remoteFileName}`;
            await client.remove(remotePath);
            console.log(`🗑️ Archivo eliminado: ${remotePath}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Error al eliminar:', error);
            return { success: false, error: error.message };
        } finally {
            client.close();
        }
    }
}
module.exports = new FTPUploader();