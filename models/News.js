const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true }, // Nova categoria
    image: { type: String }, // URL da imagem
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('News', newsSchema);

