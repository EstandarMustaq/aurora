const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// API para listar notícias (usado pelo DataTables e Chart.js)
router.get('/news', protect, authorize('admin'), apiController.listNews);

// API para obter estatísticas
router.get('/stats', protect, authorize('admin'), apiController.getStats);

module.exports = router;

