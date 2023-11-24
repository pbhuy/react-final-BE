const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const configs = {
    dest: uploadDir,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (!fs.existsSync(uploadDir))
                cb({ status: 400, message: 'Not found directory' }, false);
            else cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname);
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else cb({ status: 400, message: 'Invalid file type' }, false);
    }
};

module.exports = multer(configs);
