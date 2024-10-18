const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Página inicial com todas as notícias
router.get('/', newsController.getAllNews);

// Detalhes de uma notícia específica
router.get('/news/:id', newsController.getNewsDetail);

// Adicionar comentário a uma notícia
router.post('/news/:id/comment', newsController.addComment);

module.exports = router;

