const News = require('../models/News');
const Comment = require('../models/Comment');

exports.getAllNews = async (req, res) => {
    try {
        const { category, page = 1 } = req.query; // Pega a página e a categoria
        const limit = 6;
        const skip = (page - 1) * limit;

        // Valida se a categoria existe e é válida
        const validCategories = ['Esportes',
                                 'Política',
                                 'Entretenimento',
                                 'Tecnologia',
                                 'Saúde'
                                ];
        const filter = validCategories.includes(category) ? { category } : {};

        // Busca as notícias com paginação
        const news = await News.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const entertainmentNews = await News.find({ category: 'Saúde' }).limit(1);
        const tecnologiesNews = await News.find({ category: 'Tecnologia' }).limit(1);
        const popularNews = await News.find().sort({ views: -1 }).limit(3);

        // Verifica se há mais notícias para carregar
        const totalNews = await News.countDocuments(filter);
        const hasMore = skip + news.length < totalNews;

        res.render('news/index', { 
            news,
            entertainmentNews,
            tecnologiesNews,
            popularNews,
            selectedCategory: category || 'All',
            currentPage: parseInt(page),
            hasMore
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao obter notícias');
    }
};

/**
 * Função auxiliar para determinar a cor do avatar com base no nome do usuário.
 * @param {string} username - Nome do usuário.
 * @returns {string} - Cor hexadecimal.
 */
function getAvatarColor(username) {
    const colors = ['#e67e22',
                    '#2e8b57',
                    '#32cd75',
                    '#0073e6'
                   ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
}

// Exibi detalhes de uma notícia específica com comentários
exports.getNewsDetail = async (req, res) => {
    try {
        const newsItem = await News.findById(req.params.id);
        if (!newsItem) {
            return res.status(404).send('Notícia não encontrada');
        }
        const comments = await Comment.find({ newsId: req.params.id }).sort({ createdAt: -1 });
        const categoriesFromDB = await News.distinct('category'); // Obter categorias únicas

        // Mapea categorias para incluir imagens
        const categoryImages = {       
            Esportes: "/uploads/images/newsCategory/category-esportes.png",
            Política: "/uploads/images/newsCategory/category-politica.jpg",
            Entretenimento: "/uploads/images/newsCategory/category-entertenimento.jpg",
            Tecnologia: "/uploads/images/newsCategory/category-tecnologia.jpg",
            Saúde: "/uploads/images/newsCategory/category-saude.jpg",
        };
               
        const categories = categoriesFromDB.map(category => ({
            name: category,
            image: categoryImages[category] || "/uploads/images/news.category/news-category.png", // Imagem padrão
        }));
        
        // Adiciona cor dinâmica aos comentários
        const commentsWithColors = comments.map(comment => ({
            ...comment.toObject(),
            avatarColor: getAvatarColor(comment.username),
        }));
        
        // Busca as 3 notícias mais recentes, excluindo a notícia atual
        const recentNews = await News.find({ _id: { $ne: req.params.id } })
            .sort({ createdAt: -1 })
            .limit(3);

        res.render('news/detail', { 
            news: newsItem, 
            comments: commentsWithColors, 
            categories,
            recentNews,
            likes: newsItem.likes, 
            dislikes: newsItem.dislikes         
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao obter detalhes da notícia');
    }
};

// Adiciona comentário a uma notícia
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
