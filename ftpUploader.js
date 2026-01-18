const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // IMPORTANTE: Necesitamos Multer

// 1. Configuración de Multer para recibir la imagen temporalmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

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
            await client.access(this.config);
            console.log(`✅ Conectado a FTP: ${this.config.host}`);
            try {
                await client.ensureDir(this.remotePath);
            } catch (error) {
                console.warn(`⚠️ Error directorio: ${error.message}`);
            }
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
}

// 2. Exportamos AMBOS: El middleware y la lógica de subida
// Esto arregla el error "upload.single is not a function"
upload.ftp = new FTPUploader();
module.exports = upload;