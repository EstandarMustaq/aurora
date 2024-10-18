require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');

// Conectar ao banco de dados MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride('_method')); // Para suportar PUT e DELETE via forms
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Rotas
const newsRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use('/', newsRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
