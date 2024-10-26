const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// Conectar ao banco de dados MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method')); // Para suportar PUT e DELETE via forms
app.use(express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');

// Rotas
const newsRoutes = require('../routes/index');
const adminRoutes = require('../routes/admin');
const apiRoutes = require('../routes/api');

app.use('/', newsRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

module.exports = app;
