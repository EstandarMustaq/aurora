const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/admin/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        console.error(err);
        res.redirect('/admin/login');
    }
};


