const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true }, // Nova categoria
    image: { type: String }, // URL da imagem
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] }, // Armazena IPs de usuários que deram like
    dislikedBy: { type: [String], default: [] }, // Armazena IPs de usuários que deram dislike   
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('News', newsSchema);

