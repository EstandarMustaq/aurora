const multer = require('multer');
const path = require('path');

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Ex: 1234567890.jpg
    }
});

// Filtrar tipos de arquivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Erro: Apenas imagens são permitidas!');
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

module.exports = upload;

