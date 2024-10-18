const News = require('../models/News');
const Comment = require('../models/Comment');

// Exibir todas as notícias com filtro por categoria
exports.getAllNews = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const news = await News.find(filter).sort({ createdAt: -1 });
        res.render('news/index', { news, selectedCategory: category || 'All' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao obter notícias');
    }
};

// Exibir detalhes de uma notícia específica com comentários
exports.getNewsDetail = async (req, res) => {
    try {
        const newsItem = await News.findById(req.params.id);
        if (!newsItem) {
            return res.status(404).send('Notícia não encontrada');
        }
        const comments = await Comment.find({ newsId: req.params.id }).sort({ createdAt: -1 });
        res.render('news/detail', { news: newsItem, comments });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao obter detalhes da notícia');
    }
};

// Adicionar um comentário a uma notícia
exports.addComment = async (req, res) => {
    try {
        const { username, comment } = req.body;
        const { id } = req.params;
        await Comment.create({ newsId: id, username, comment });
        res.redirect(`/news/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao adicionar comentário');
    }
};


