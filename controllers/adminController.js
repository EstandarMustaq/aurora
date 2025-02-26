const News = require('../models/News');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Exibir painel administrativo com estatísticas
exports.adminDashboard = async (req, res) => {
    try {
        const newsCount = await News.countDocuments();
        const usersCount = await User.countDocuments();
        const newsByCategory = await News.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);
        res.render('admin/dashboard', { newsCount, usersCount, newsByCategory, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar dashboard');
    }
};

// Listar todas as notícias para o DataTable com Paginação e Busca
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

// Criar uma nova notícia com validação e upload de imagem
exports.createNews = async (req, res) => {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.render('admin/news', {
      errors: errors.array(), user: req.usersCount});
  }

  try {
    const { title, content, author, category } = req.body; 
    const image = req.file ? req.file.path : null; 
    await News.create({ title, content, author, category, image });
    res.redirect('/admin');
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar notícia');
  } 
};

// Exibir formulário de edição de notícia
exports.editNewsForm = async (req, res) => {
    try {
        const newsItem = await News.findById(req.params.id);
        if (!newsItem) {
            return res.status(404).send('Notícia não encontrada');
        }
        res.render('admin/edit', { news: newsItem, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar formulário de edição');
    }
};

// Atualizar notícia
exports.updateNews = async (req, res) => { 
  const errors = validationResult(req); 
  if (!errors.isEmpty()) { 
    const newsItem = await News.findById(req.params.id); 
    return res.render('admin/edit', { errors: errors.array(), news: newsItem, user: req.user });
  } 

  try { 
    const { title, content, author, category } = req.body; 
    const image = req.file ? req.file.path : req.body.currentImage; 
    await News.findByIdAndUpdate(req.params.id, { title, content, author, category, image }); 
    res.redirect('/admin'); 
  } 
  catch (err) { 
    console.error(err); 
    res.status(500).send('Erro ao atualizar notícia'); 
  } 
};

// Deletar uma notícia
exports.deleteNews = async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao deletar notícia');
    }
};

