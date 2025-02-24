const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const upload = require('../middleware/upload');
const { body } = require('express-validator');

// Rotas de autenticação
router.get('/login', authController.getLogin);
router.post('/login', [
    body('username').notEmpty().withMessage('Usuário é obrigatório'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
], authController.postLogin);
router.get('/logout', authController.logout);

// Rotas protegidas
router.get('/', protect, adminController.adminDashboard);

// Criar notícia com Cloudinary
router.get('/news/new', protect, authorize('admin'), (req, res) => {
    res.render('admin/news', { user: req.user, errors: [] });
});

router.post('/news', protect, authorize('admin'), upload.single('image'), [
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('content').notEmpty().withMessage('Conteúdo é obrigatório'),
    body('author').notEmpty().withMessage('Autor é obrigatório'),
    body('category').notEmpty().withMessage('Categoria é obrigatória')
], adminController.createNews);

router.get('/edit/:id', protect, authorize('admin'), adminController.editNewsForm);
router.put('/edit/:id', protect, authorize('admin'), upload.single('image'), [
    body('title').notEmpty().withMessage('Título é obrigatório'),
    body('content').notEmpty().withMessage('Conteúdo é obrigatório'),
    body('author').notEmpty().withMessage('Autor é obrigatório'),
    body('category').notEmpty().withMessage('Categoria é obrigatória')
], adminController.updateNews);

router.delete('/news/:id', protect, authorize('admin'), adminController.deleteNews);

module.exports = router;
