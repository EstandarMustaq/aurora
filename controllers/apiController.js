const News = require('../models/News');
const Comment = require('../models/Comment');

// Listar notícias com suporte a DataTables
exports.listNews = async (req, res) => {
    try {
        const { start, length, draw, search, order, columns } = req.query;
        const searchValue = search.value;

        let query = {};
        if (searchValue) {
            query = {
                $or: [
                    { title: { $regex: searchValue, $options: 'i' } },
                    { author: { $regex: searchValue, $options: 'i' } },
                    { category: { $regex: searchValue, $options: 'i' } }
                ]
            };
        }

        const totalRecords = await News.countDocuments();
        const filteredRecords = await News.countDocuments(query);

        const news = await News.find(query)
            .sort({ createdAt: -1 })
            .skip(parseInt(start))
            .limit(parseInt(length));

        res.json({
            draw: parseInt(draw),
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data: news
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao listar notícias');
    }
};

// Obter estatísticas para os gráficos
exports.getStats = async (req, res) => {
    try {
        // Notícias por categoria
        const newsByCategory = await News.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Comentários por notícia
        const commentsByNews = await Comment.aggregate([
            { $group: { _id: "$newsId", count: { $sum: 1 } } }
        ]);

        res.json({ newsByCategory, commentsByNews });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao obter estatísticas');
    }
};

