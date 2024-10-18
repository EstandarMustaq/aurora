const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Exibir página de login
exports.getLogin = (req, res) => {
    res.render('admin/login');
};

// Processar login
exports.postLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('admin/login', { error: errors.array()[0].msg });
    }

    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('admin/login', { error: 'Usuário ou senha inválidos' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('admin/login', { error: 'Usuário ou senha inválidos' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao fazer login');
    }
};

// Processar logout
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
};

// Exibir página de registro
exports.getRegister = (req, res) => {
    res.render('admin/register');
};

// Processar registro 
exports.postRegister = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('admin/register', { error: 'Usuário já existe' });
        }

        const user = new User({ username, password });
        await user.save();
        res.redirect('/admin/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao registrar usuário');
    }
};

